import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contacts.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts:Contact[], term:string) {
    //console.log(term);
    //console.log(contacts)
    let filteredContacts:Contact[] =[];
    if(term && term.length > 0){
      filteredContacts = contacts.filter((contact:Contact)=>
        contact.name.toLowerCase().includes(term.toLowerCase())
      );
      console.log(filteredContacts);
    }

    if(filteredContacts.length <1){
      return contacts;
    }
    
    return filteredContacts;
  }

}
