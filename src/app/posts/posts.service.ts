import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators"

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http
      .get<{ message: string; posts: any }>(
        "http://localhost:3000/api/posts"
      ).pipe(map((postData) => {
        return postData.posts.map((post: { title: any; content: any; _id: any; }) => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
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

    return { ...this.posts.find(p => p.id === id) }

  }

  addPost(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string, resultId: String }>("http://localhost:3000/api/posts", post)
      .subscribe(responseData => {
        const responseId = responseData.resultId
        post.id = responseId
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
  deletePost(postId: String) {
    this.http.delete("http://localhost:3000/api/posts/" + postId).subscribe(() => {
      const updatedPost = this.posts.filter(post => {
        post.id !== postId;
      })
      this.posts = updatedPost;
      this.postsUpdated.next([...this.posts]);
    })

  }
  updatePost(id: string, title: string, content: string) {
    const post = { id: id, title: title, content: content }
    this.http.patch<{ message: String }>("http://localhost:3000/api/posts/" + id, post).subscribe(responseData => {
      console.log(responseData.message);

    })
  }
}
