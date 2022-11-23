import { Message } from "./message.model";
import { MOCKMESSAGES } from "./MOCKMESSAGES";
import {EventEmitter} from '@angular/core';

export class MessageService{
    messages:Message[] = [];
    messageChangedEvent = new EventEmitter<Message[]>()

    constructor(){
        this.messages = MOCKMESSAGES;
    }

    getMessages(){
        return this.messages.slice()
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
        this.messageChangedEvent.emit(this.messages.slice());
    }
}