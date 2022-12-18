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
        this.http.get<{message: string, contacts: Contact[]}>('http://localhost:3000/contacts').subscribe(
            (response)=>{
                this.contacts = response.contacts;
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
        this.http.delete(`http://localhost:3000/contacts/${contact.id}`)
        .subscribe((contacts: Contact[]) => {
          this.getContacts();
        })
      
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
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
          });
      
        newContact.id = '';
        this.http
       .post<{message: string, contact: Contact}>('http://localhost:3000/contacts', newContact, {headers: headers})
       .subscribe((response: any) => {
       this.contacts.push(response.contact);
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
    });
    }

    updateContact(originalContact:Contact,newContact:Contact){
        if(!originalContact || !newContact){
            return
        }
        let pos = this.contacts.indexOf(originalContact);
        if(pos<0){
            return
        }

        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
          });

        const stringfiedContact = JSON.stringify(newContact);

        this.http
        .put<{message: string}>(`http://localhost:3000/contacts/${originalContact.id}`, stringfiedContact, {headers: headers})
        .subscribe((response: any) => {
        this.getContacts();
       });
    }

    storeContacts(): void {
        let json = JSON.stringify(this.contacts);
        let header = new HttpHeaders();
        header.set('Content-Type', 'application/json');
        this
        .http
        .put('http://localhost:3000/documents', json, {
          headers: header
        }).subscribe(() => {
          this.contactListChangedEvent.next((this.contacts.slice()));
        });
      }
}