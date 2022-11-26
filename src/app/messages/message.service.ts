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
        this.http.get('https://angular-cms-7b3d3-default-rtdb.firebaseio.com/messages.json').subscribe((messages:Message[])=>{
            this.messages = messages;
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
        this.messages.push(message);
        this.storeMessages();
    }

    storeMessages(): void {
        let json = JSON.stringify(this.messages);
        let header = new HttpHeaders();
        header.set('Content-Type', 'application/json');
        this
        .http
        .put('https://angular-cms-7b3d3-default-rtdb.firebaseio.com/messages.json', json, {
          headers: header
        }).subscribe(() => {
          this.messageChangedEvent.emit(this.messages.slice());
        });
      }

  
}