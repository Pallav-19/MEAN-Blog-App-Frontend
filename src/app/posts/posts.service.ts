import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators"
import { Router } from "@angular/router"

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  public date = new Date()
  private postsUpdated = new Subject<{ posts: Post[], postCount: any }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(postsPerPage?: number, currentPage?: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`
    this.http
      .get<{ message: string; posts: any, postCount: number }>(
        "http://localhost:3300/api/posts" + queryParams
      ).pipe(map((postData) => {
        return {
          posts: postData.posts.map((post: { title: any; content: any; _id: any; image: any; author: any; authorName: any }) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              image: post.image,
              author: post.author,
              authorName: post.authorName
            }
          }),
          postCount: postData.postCount

        }

      })

      )
      .subscribe(transformedPost => {
        this.posts = transformedPost.posts;
        this.postsUpdated.next({ posts: [...this.posts], postCount: transformedPost.postCount });
      });
  }
  getAuthorName() {
    this.http.get("http://localhost:3300/api/users/getAuthorName")
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

    this.http
      .post<{ message: string, createdPost: Post }>("http://localhost:3300/api/posts",
        postData)
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }
  deletePost(postId: String) {
    return this.http.delete("http://localhost:3300/api/posts/" + postId)

  }
  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: FormData | Post
    if (typeof (image) === 'object') {
      postData = new FormData()
      postData.append("id", id);
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
      const post = { id: id, title: title, content: content, image: image }
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdated.next({ posts: [...this.posts], postCount: null })
      this.router.navigate(["/"]);


    })
  }
}
