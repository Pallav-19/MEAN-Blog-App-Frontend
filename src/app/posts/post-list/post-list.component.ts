import { Component, OnInit, } from '@angular/core';
import { PostService } from 'src/app/posts.service';
import {Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

 posts:Post[] = [  ]

  constructor(public PostService:PostService) { }

  ngOnInit(): void {
    this.posts = this.PostService.getPosts();
  }

}
