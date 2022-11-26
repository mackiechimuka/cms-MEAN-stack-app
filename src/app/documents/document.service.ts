import { Document } from "./document-list/document.model";
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import {EventEmitter, Injectable, Injector} from "@angular/core";
import {Subject} from 'rxjs'
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class DocumentService{
    maxDocumentId:number
    documents:Document[] =[] ;
    documentSelectedEvent = new EventEmitter<Document>();
    documentChangedEvent = new EventEmitter<Document[]>();
    documentListChangedEvent = new Subject<Document[]>();

    constructor(private http:HttpClient){
        this.documents = MOCKDOCUMENTS;
        this.maxDocumentId = this.getMaxId()
    }

    getDocuments():void{
        this.http.get('https://angular-cms-7b3d3-default-rtdb.firebaseio.com/documents.json').subscribe(
            (documents:Document[])=>{
                this.documents = documents;
                this.maxDocumentId = this.getMaxId();
                this.documents.sort((docA :Document,docB:Document):number=>{
                    if(docA.id<docB.id){
                        return -1;
                    } else if (docA === docB){
                        return 0;
                    }else {
                        return 1;
                    }
                });
                this.documentListChangedEvent.next(this.documents.slice());

            },(err: any) => {
                console.error(err);
              }
        );
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
        this.storeDocuments();
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
        this.storeDocuments();

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
        this.storeDocuments();
    }

    storeDocuments(): void {
        let json = JSON.stringify(this.documents);
        let header = new HttpHeaders();
        header.set('Content-Type', 'application/json');
        this
        .http
        .put('https://angular-cms-7b3d3-default-rtdb.firebaseio.com/documents.json', json, {
          headers: header
        }).subscribe(() => {
          this.documentListChangedEvent.next((this.documents.slice()));
        });
      }

  
}