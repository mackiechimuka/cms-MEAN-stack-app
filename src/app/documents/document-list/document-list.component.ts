import { Component, OnInit,Output ,EventEmitter, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { DocumentService } from '../document.service';
import { Document } from './document.model';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  documents:Document[]=[];
  subscription:Subscription

  constructor(private documentService:DocumentService) { }

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
    //this.documentService.documentChangedEvent.subscribe((documents:Document[])=>{
    //  this.documents = documents;
    //})
    this.subscription = this.documentService.documentListChangedEvent.subscribe((documentList:Document[])=>{
      this.documents = documentList;

    })
  }

  ngOnDestroy(){
    this.subscription.unsubscribe()
  }

  


}
