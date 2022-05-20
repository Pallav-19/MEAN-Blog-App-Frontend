import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators"
import { Router } from "@angular/router"

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        "http://localhost:3300/api/posts"
      ).pipe(map((postData) => {
        return postData.posts.map((post: { title: any; content: any; _id: any; image: any }) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            image: post.image
          }
        })

      })

      )
      .subscribe(transformedPost => {
        this.posts = transformedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }
  getPost(id: string) {

    return this.http.get<{ _id: string, title: string, content: string, image: string }>('http://localhost:3300/api/posts/' + id)

  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    // const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, createdPost: Post }>("http://localhost:3300/api/posts",
        postData)
      .subscribe(responseData => {
        const post: Post = { id: responseData.createdPost.id, title: title, content: content, image: responseData.createdPost.image }

        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }
  deletePost(postId: String) {
    this.http.delete("http://localhost:3300/api/posts/" + postId).subscribe(() => {
      const updatedPost = this.posts.filter(post => {
        post.id !== postId;
      })
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
      this.router.navigate(["/"]);

    })

  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData : FormData | Post
    if (typeof (image) === 'object') {
      postData = new FormData()
      postData.append("id",id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);

    } else {
       postData = { id: id, title: title, content: content, image: image }

    }
    this.http.patch<{ message: String }>("http://localhost:3300/api/posts/" + id, postData).subscribe(responseData => {
      console.log(responseData.message);
      const updatedPosts = [...this.posts]
      const oldPostIndex = updatedPosts.findIndex(p => (p.id === id));
      const post = { id: id, title: title, content: content,image:image }
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next([...this.posts])
      this.router.navigate(["/"]);


    })
  }
}
