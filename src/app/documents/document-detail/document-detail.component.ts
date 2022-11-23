import { Component, OnInit,} from '@angular/core';
import { from } from 'rxjs';
import { Document } from '../document-list/document.model';
import { DocumentService } from '../document.service';
import {Router,ActivatedRoute, Params} from '@angular/router'
import { WindRefService } from 'src/app/wind-ref.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document:Document;
  id:string;
  nativeWindow:any

  constructor(private documentService:DocumentService, private route:ActivatedRoute, private router:Router, private windRef:WindRefService) {
    this.nativeWindow = windRef.getNativeWindow();
   }

  ngOnInit(){
    this.route.params
    .subscribe((params:Params)=>{
      this.id = params['id'];
      this.document = this.documentService.getDocument(this.id);
    })
  }

  onView(){
    if(this.document.url){
      this.nativeWindow.open(this.document.url);
    }
  }
  onDelete(){
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['../documents']);
  }

}
