import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ContactService } from '../contact.service';
import { Contact } from '../contacts.model';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
  originalContact:Contact;
  contact:Contact;
  editMode:boolean = false;
  groupContacts:Contact[] =[];
  constructor(private contactService:ContactService,private router:Router, private route:ActivatedRoute) { }

  ngOnInit(){
    this.route.params.subscribe((params:Params)=>{
      let id = params['id'];
      if (id===null || id===undefined){
        return;
      }
      this.originalContact = this.contactService.getContact(id);
      if(!this.originalContact ){
        return;
      }

      this.editMode = true;
      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if(this.contact.group != null ){
        this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
      }
    });
  }

  onSubmit(form:NgForm){
    const value = form.value;
    const newContact = new Contact(value.id,value.name,value.email,value.phone,value.imageUrl,this.groupContacts);
    
    if(this.editMode=== true){
      this.contactService.updateContact(this.originalContact,newContact);
    } else {
      console.log(newContact)
      this.contactService.addContact(newContact);
    }

    this.router.navigate(['/contacts']);
  }

  onCancel(){
    this.router.navigate(['/contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact) {
      return true;
    }
    if (this.contact && newContact.id === this.contact.id) {
       return true;
    }
    for (let i = 0; i < this.groupContacts.length; i++){
       if (newContact.id === this.groupContacts[i].id) {
         return true;
      }
    }
    return false;
 }
 addToGroup($event: any) {
  const selectedContact: Contact = $event.dragData;
  const invalidGroupContact = this.isInvalidContact(selectedContact);
  if (invalidGroupContact){
     return;
  }
  this.groupContacts.push(selectedContact);
}

onRemoveItem(index: number) {
  if (index < 0 || index >= this.groupContacts.length) {
     return;
  }
  this.groupContacts.splice(index, 1);
}
}
