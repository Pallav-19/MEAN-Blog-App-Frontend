import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { PageEvent } from "@angular/material/paginator";
import { userService } from "src/app/auth/user.service";
@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: any[] = [];
  private postsSub: Subscription = new Subscription;
  public authStatusSubscription = new Subscription;
  public isUserAuthorised: boolean = false;
  isLoading = false;
  totalPosts = 0;
  postPerPage = 2;
  currentPage: number = 1;
  pageSizeOptions = [1, 2, 5, 10]
  isUserAuthenticated: boolean;
  authListenerSubs: Subscription;
  constructor(public postsService: PostsService, private userService: userService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postData: { posts: Post[], postCount: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.postCount;
      });
    this.isUserAuthorised = this.userService.getIsAuth()
    this.authStatusSubscription = this.userService.getAuthStatusListener().subscribe((authStatus) => {
      this.isUserAuthorised = authStatus
    })
    this.isUserAuthenticated = this.userService.getIsAuth();
    this.authListenerSubs = this.userService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.isUserAuthenticated = isAuthenticated;
    })

  }
  onDelete(postId: String) {
    this.isLoading = true
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.postPerPage, this.currentPage)
    })

  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
  onChangedPage(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postPerPage = event.pageSize
    // console.log(event);
    this.postsService.getPosts(this.postPerPage, this.currentPage);


  }
  userID() {
    return localStorage.getItem("userId")
  }
}
