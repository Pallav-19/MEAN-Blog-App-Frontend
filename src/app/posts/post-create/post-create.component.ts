import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";

import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  public mode: string = 'create';
  public postId: any;
  public postGotten: any;
  isLoading = false;
  post: Post;



  constructor(public postsService: PostsService, public route: ActivatedRoute) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((responseData) => {
          this.isLoading = false;
          this.post = { id: responseData._id, title: responseData.title, content: responseData.content }
          this.postGotten = this.post
        })

      } else {
        this.mode = 'create'
      }

    })
  }


  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content);
      form.resetForm();
    } else if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content)
      form.resetForm();
    }

  }
}
