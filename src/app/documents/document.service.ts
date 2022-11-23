import { Document } from "./document-list/document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import {EventEmitter} from "@angular/core";
import {Subject} from 'rxjs'

export class DocumentService{
    maxDocumentId:number
    documents:Document[] ;
    documentSelectedEvent = new EventEmitter<Document>();
    //documentChangedEvent = new EventEmitter<Document[]>();
    documentListChangedEvent = new Subject<Document[]>();

    constructor(){
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId()
    }

    getDocuments():Document[]{
        return this.documents.slice();
    }

    getDocument(id:string){
        for(let document of this.documents){
            if(document.id === id){
                return document;
            }
        }
        return null;
    }

    deleteDocument(document: Document) {
        if (!document) {
           return;
        }
        const pos = this.documents.indexOf(document);
        if (pos < 0) {
           return;
        }
        this.documents.splice(pos, 1);
        this.documentListChangedEvent.next(this.documents.slice());
     }

    getMaxId():number{
        let maxId = 0;
        for(let document of this.documents){
            let currentId = parseInt(document.id);
            if (currentId> maxId){
                maxId = currentId;
            }
        }
        return maxId
    }

    addDocument(newDocument:Document){
        if(!newDocument){
            return;
        }
        this.maxDocumentId++;
        newDocument.id =this.maxDocumentId.toString();
        this.documents.push(newDocument);
        this.documentListChangedEvent.next(this.documents.slice());

    }

    updateDocument(originalDocument:Document,newDocument:Document){
        if (!originalDocument || !newDocument){
            return
        }

        let pos = this.documents.indexOf(originalDocument);
        if (pos<0){
            return
        }

        newDocument.id = originalDocument.id;
        this.documents[pos] = newDocument;
        this.documentListChangedEvent.next(this.documents.slice())
    }

  
}