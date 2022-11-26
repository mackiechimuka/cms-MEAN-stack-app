import { Component, OnInit,Output,EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactService } from '../contact.service';
import { Contact } from '../contacts.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  contacts:Contact[] =[];
  subscription:Subscription;
  term:string;

  constructor(private contactService:ContactService) { }

  ngOnInit() {
    this.contactService.getContacts();
    this.subscription = this.contactService.contactListChangedEvent.subscribe((contacts:Contact[])=>{
      this.contacts = contacts;
    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  //onSelected(contact: Contact){
    //this.contactService.contactSelectedEvent.emit(contact);
  //}

  search(value:string){
    this.term = value;
    //.log(this.term);
  }

}
