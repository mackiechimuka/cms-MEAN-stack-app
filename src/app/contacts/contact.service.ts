import { Injectable } from "@angular/core";
import { HttpClient ,HttpHeaders} from "@angular/common/http";
import { Contact } from "./contacts.model";
import {EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import { MOCKCONTACTS } from "./MOCKCONTACTS";

@Injectable({
    providedIn:'root'
})

export class ContactService{
    contacts:Contact[] = [];
    contactSelectedEvent = new EventEmitter<Contact>();
    contactListChangedEvent = new Subject<Contact[]>();
    maxContactId:number

    constructor(private http:HttpClient){
        this.contacts = MOCKCONTACTS;
        this.maxContactId = this.getMaxId();
    }

    getContacts():void{
        this.http.get('https://angular-cms-7b3d3-default-rtdb.firebaseio.com/contacts.json').subscribe(
            (contacts:Contact[])=>{
                this.contacts = contacts;
                this.maxContactId = this.getMaxId();
                this.contacts.sort((contA:Contact,contB:Contact):number =>{
                    if(contA.name<contB.name){
                        return -1;
                    } else if (contA.id ===contB.id){
                        return 0;
                    }else{
                        return 1;
                    }
                });
                this.contactListChangedEvent.next(this.contacts.slice());
            },(err: any) => {
                console.error(err);
              }
        )
    }

    getContact(id:string):Contact{
        for(let contact of this.contacts ){
            if(contact.id === id){
                return contact;
            }
        }
        return null
    }

    deleteContact(contact:Contact){
        if(!contact){
            return;
        }
        const pos = this.contacts.indexOf(contact);
        if(pos<0){
            return;
        }
        this.contacts.splice(pos,1);
        this.storeContacts();
    }
    getMaxId():number{
        let maxId = 0;
        for(let contact of this.contacts){
            let currentId = parseInt(contact.id);
            if (currentId> maxId){
                maxId = currentId;
            }
        }
        return maxId
    }

    addContact(newContact:Contact){
        if(!newContact){
            return
        }
        this.maxContactId++;
        newContact.id = this.maxContactId.toString();
        this.contacts.push(newContact);
        this.storeContacts();

    }

    updateContact(originalContact:Contact,newContact:Contact){
        if(!originalContact || !newContact){
            return
        }
        let pos = this.contacts.indexOf(originalContact);
        if(pos<0){
            return
        }
        newContact.id = originalContact.id;
        this.contacts[pos] = newContact;
        this.storeContacts();
    }

    storeContacts(): void {
        let json = JSON.stringify(this.contacts);
        let header = new HttpHeaders();
        header.set('Content-Type', 'application/json');
        this
        .http
        .put('https://angular-cms-7b3d3-default-rtdb.firebaseio.com/contacts.json', json, {
          headers: header
        }).subscribe(() => {
          this.contactListChangedEvent.next((this.contacts.slice()));
        });
      }
}