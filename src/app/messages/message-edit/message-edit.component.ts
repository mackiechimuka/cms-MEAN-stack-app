import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject') subjectRef:ElementRef;
  @ViewChild('msgText') msgTextRef:ElementRef;
  

  constructor(private messageService:MessageService) { 

  }

  ngOnInit(): void {
  }

  onSendMessage(){
    const subject =this.subjectRef.nativeElement.value;
    const msgText =  this.msgTextRef.nativeElement.value;
    const sender ='3';
    const id ='4';
    const newMsg = new Message(id,subject,msgText,sender);
    this.messageService.addMessage(newMsg);
  }

  onClear(){
    this.subjectRef.nativeElement.value ='';
    this.msgTextRef.nativeElement.value ='';
  }



}
