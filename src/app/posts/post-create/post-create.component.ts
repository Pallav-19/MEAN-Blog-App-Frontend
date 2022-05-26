import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { mimeType } from "../post-create/mime-type.validator"

import { PostsService } from "../posts.service";
import { userService } from "src/app/auth/user.service";
import { Subscription } from "rxjs";
import { ThisReceiver } from "@angular/compiler";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  public mode: string = 'create';
  public postId: any;
  public postGotten: any;
  isLoading = false;
  post: Post;
  form: FormGroup;
  imgPreview: any;
  private authSub: Subscription
  constructor(public postsService: PostsService, public route: ActivatedRoute, private AuthService: userService) { }
  ngOnDestroy(): void {
    this.authSub.unsubscribe()
  }
  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId')
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((responseData) => {
          this.isLoading = false;
          this.post = { id: responseData._id, title: responseData.title, content: responseData.content, image: responseData.image }
          this.form.setValue({ 'title': this.post.title, 'content': this.post.content, 'image': this.post.image })
        })

      } else {
        this.mode = 'create'
      }

    })
    this.authSub = this.AuthService.getAuthStatusListener().subscribe(() => {
      this.isLoading = false;

    })
  }

  onImagePicked(event: Event) {
    const file: any = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({ image: file });
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imgPreview = reader.result;
    }
    reader.readAsDataURL(file)
  }
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.postsService.addPost(this.form.value.title, this.form.value.content, this.form.value.image);
      this.form.reset();
    } else if (this.mode === 'edit') {
      this.postsService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
      this.form.reset();
    }

  }
}
