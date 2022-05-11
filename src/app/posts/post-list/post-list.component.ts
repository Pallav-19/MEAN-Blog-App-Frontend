import { Component, OnInit,OnDestroy } from '@angular/core';
import { PostService } from 'src/app/posts.service';
import { Post } from '../post.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = []
  private postSub: Subscription = new Subscription;
  constructor(public PostService: PostService) { }

  ngOnInit(): void {
    this.posts = this.PostService.getPosts();
    this.postSub =this.PostService.getPostUpdatListener().subscribe((posts: Post[]) => { this.posts = posts })
  }
  ngOnDestroy():void{
    this.postSub.unsubscribe();
  }

}
 