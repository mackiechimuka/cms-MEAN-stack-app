import { Component, OnInit,Input } from '@angular/core';
import { ContactService } from '../contact.service';
import { Contact } from '../contacts.model';
import {ActivatedRoute,Router,Params} from '@angular/router';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
  contact:Contact;
  details:Contact[] = []

  constructor(private contactService:ContactService, private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.route.params
    .subscribe((params:Params)=>{
      this.contact = this.contactService.getContact(params['id']);
    })
    
  }

  onDelete(){
    this.contactService.deleteContact(this.contact);
    this.router.navigate(['../contacts']);
  }

}
