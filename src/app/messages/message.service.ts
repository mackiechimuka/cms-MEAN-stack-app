import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";
import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class MessageService{
    messages:Message[] = [];
    messageChangedEvent = new EventEmitter<Message[]>()

    constructor(private http:HttpClient){
        this.messages = MOCKMESSAGES;
    }

    getMessages():void{
        this.http.get<{message: string, messages: Message[]}>('http://localhost:3000/messages').subscribe((response:any)=>{
            this.messages = response.messages;
            this.messageChangedEvent.emit(this.messages.slice());
        },(err: any) => {
            console.error(err);
          }
            
        )
        
    }

    getMessage(id:string){
        for(let message of this.messages){
            if(message.id === id){
                return message
            }
        return null
        }
    }

    addMessage(message:Message){
        if (!message) {
            return;
          }
        
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
          });

        message.id = '';
        
        this.http
       .post<{message: string, newMessage: Message}>('http://localhost:3000/messages', message, {headers: headers})
       .subscribe((response: any) => {
       this.messages.push(response.newMessage);
       this.messageChangedEvent.next(this.messages.slice());
       this.getMessages();
    } );
        
    }

    storeMessages(): void {
        let json = JSON.stringify(this.messages);
        let header = new HttpHeaders();
        header.set('Content-Type', 'application/json');
        this
        .http
        .put('http://localhost:3000/messages', json, {
          headers: header
        }).subscribe(() => {
          this.messageChangedEvent.emit(this.messages.slice());
        });
      }

  
}