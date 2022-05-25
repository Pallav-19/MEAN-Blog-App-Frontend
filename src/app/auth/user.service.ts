import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { user } from "./user.model"
import { Subject } from "rxjs";
import { PostsService } from "../posts/posts.service";
import { Router } from "@angular/router";
import { Date } from "mongoose";
import { DateAdapter } from "@angular/material/core";
@Injectable({ providedIn: 'root' })
export class userService {
  private token: string | null;
  private authStatusListener = new Subject<boolean>()
  public isUserAuthenticated: boolean = false;
  private logoutTimer: any
  constructor(private http: HttpClient, private postService: PostsService, public router: Router) { }

  signup(email: string, password: string) {
    const user: user = {
      email: email,
      password: password,
    }
    this.http.post("http://localhost:3300/api/users/signup", user).subscribe(gotData => {
    })

  }
  login(email: string, password: string) {
    const user: user = {
      email: email,
      password: password,
    }
    this.http.post<{ message: string, token: string, expiresIn: number }>("http://localhost:3300/api/users/login", user)
      .subscribe((responseData) => {
        this.token = responseData.token
        if (this.token) {
          const expiresIn = responseData.expiresIn
          this.setAuthTimer(expiresIn);
          this.isUserAuthenticated = true
          this.authStatusListener.next(true)

          const now = new Date()

          const expirationDate = now.getHours() + (responseData.expiresIn / 3600)
          const expirationTime = new Date()
          expirationTime.setHours(expirationDate)

          this.saveAuthData(responseData.token, expirationTime)
          this.router.navigate(["/"])
        }


      });
  }
  logout() {
    this.token = null;
    this.isUserAuthenticated = false
    this.authStatusListener.next(false)
    clearTimeout(this.logoutTimer)
    this.clearAuthData()
    this.router.navigate((["/login"]))

  }
  private setAuthTimer(duration: number) {
    // console.log("Setting timer: " + duration);
    // this.logoutTimer = setTimeout(() => {
    //   this.logout()
    // }, duration * 1000)
  }
  getToken() {
    return this.token
  }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getIsAuth() {
    return this.isUserAuthenticated
  }
  autoAuth() {
    const authInformation = this.getAuthData()
    if (!authInformation) { return; }
    const now = new Date()
    let isInfuture = authInformation.expirationDate.getTime() - now.getTime();
    if (isInfuture > 0) {
      this.token = authInformation.token
      this.isUserAuthenticated = true
      this.setAuthTimer(isInfuture / 1000)
      this.authStatusListener.next(true)
    }


  }
  private saveAuthData(token: string, expirationdate: any) {
    const expiresIn: any = new Date(expirationdate)
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expiresIn)

  }
  private clearAuthData() {
    localStorage.removeItem("token")
    localStorage.removeItem("expirationDate")
  }
  private getAuthData() {
    const token = localStorage.getItem("token")
    const expirationDate = localStorage.getItem("exprationDate")
    if (!token || !expirationDate) {
      return;
    } return {
      token: token,
      expirationDate: new Date(expirationDate)
    }

  }
}
