import { JSDocComment } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Route, Router } from '@angular/router';
import { Document } from '../document-list/document.model'
import { DocumentService } from '../document.service';

@Component({
  selector: 'app-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit {
  originalDocument:Document;
  document:Document;
  editMode:boolean = false;
 



  constructor(private documentService:DocumentService,private route:ActivatedRoute,private router:Router) { }

  ngOnInit() {
    this.route.params.subscribe((params:Params)=>{
      let id = params['id'];
      if (id === null || id===undefined){
        this.editMode = false;
        return;
      }
      this.originalDocument = this.documentService.getDocument((id));
      if(!this.originalDocument ){
        return;
      }

      this.editMode = true;
     
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
  
    })
  }

  onSubmit(form:NgForm){
    const value = form.value;
    const newDocument =new Document(value.id,value.name,value.description,value.url,null);
    if(this.editMode=== true){
      this.documentService.updateDocument(this.originalDocument,newDocument);
    } else{
      this.documentService.addDocument(newDocument);
    }

    this.router.navigate(['./documents']);

  }

  onCancel(){
    this.router.navigate(['./documents']);
  }

}
