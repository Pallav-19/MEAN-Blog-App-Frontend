import { Component, OnInit,EventEmitter,Output } from '@angular/core';
import { NgForm } from '@angular/forms';

import { PostService } from 'src/app/posts.service';
// import {Post} from '../post.model'
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {

  constructor(public PostService:PostService) { }
  onAddPost(form:NgForm) {
    if (form.invalid){
      return;
    }
    this.PostService.addPosts( form.value.title,  form.value.content)
  }


  ngOnInit(): void {
  }

}
