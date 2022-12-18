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
        this.http.get<{message: string, documents: Document[]}>('http://localhost:3000/documents').subscribe(
            (response)=>{
                this.documents = response.documents;
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
        this.http.delete<{message: String}>(`http://localhost:3000/documents/${document.id}`)
        .subscribe((response: any) => {
          this.getDocuments();
        })
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
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
          });

        newDocument.id = '';

        this.http
        .post<{message: string, document: Document}>('http://localhost:3000/documents', newDocument, {headers: headers})
        .subscribe((response: any) => {
        this.documents.push(response.document);
        this.documents.sort((docA :Document,docB:Document):number=>{
            if(docA.id<docB.id){
                return -1;
            } else if (docA === docB){
                return 0;
            }else {
                return 1;
            }
        });
        this.documentChangedEvent.next(this.documents.slice());
        this.getDocuments();
    });
    }

    updateDocument(originalDocument:Document,newDocument:Document){
        if (!originalDocument || !newDocument){
            return
        }

        let pos = this.documents.indexOf(originalDocument);
        if (pos<0){
            return
        }
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
          });
        
        const stringfiedDocument = JSON.stringify(newDocument);

        this.http
        .put<{message: string}>(`http://localhost:3000/documents/${originalDocument.id}`, stringfiedDocument, {headers: headers})
        .subscribe((response: any) => {
          this.getDocuments();
        });

        
    }

    storeDocuments(): void {
        let json = JSON.stringify(this.documents);
        let header = new HttpHeaders();
        header.set('Content-Type', 'application/json');
        this
        .http
        .put('http://localhost:3000/documents', json, {
          headers: header
        }).subscribe(() => {
          this.documentListChangedEvent.next((this.documents.slice()));
        });
      }

  
}