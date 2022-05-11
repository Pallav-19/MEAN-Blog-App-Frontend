import {Post} from './posts/post.model'
import { Injectable } from '@angular/core';
@Injectable({providedIn: 'root'})
export class PostService
 {
   private posts:Post[]=[]
   getPosts(){
     return[...this.posts];
   }
   addPosts(title:String,content:String){
     const post = [{title:title,content:content}]
   }
 }
