import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { user } from "./user.model"
import { Subject } from "rxjs";
import { PostsService } from "../posts/posts.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


const BACKEND_ROOT_URL_USERS: any = environment.apiUrl + "/users/"

@Injectable({ providedIn: 'root' })
export class userService {
  private token: string | null;
  private authStatusListener = new Subject<boolean>()
  public isUserAuthenticated: boolean = false;
  private logoutTimer: any
  userId: any;
  constructor(private http: HttpClient, private postService: PostsService, public router: Router) { }

  signup(email: string, password: string, username: string) {
    const user: user = {
      email: email,
      password: password,
      username: username,
    }
    this.http.post(BACKEND_ROOT_URL_USERS + "/signup", user).subscribe(gotData => {
      this.router.navigate(["/login"])

    }, error => {
      console.log(error)
      this.router.navigate(["/signin"])
      this.authStatusListener.next(false)
    })

  }
  login(email: string, password: string) {
    const user = {
      email: email,
      password: password,
    }
    this.http.post<{ message: string, token: string, expiresIn: number, userId: string }>(BACKEND_ROOT_URL_USERS + "/login", user)
      .subscribe((responseData) => {
        this.token = responseData.token
        if (this.token) {
          this.isUserAuthenticated = true
          this.authStatusListener.next(true)

          const now = new Date()

          const expirationDate = now.getHours() + (responseData.expiresIn / 3600)
          const expirationTime = new Date()
          expirationTime.setHours(expirationDate)

          this.saveAuthData(responseData.token, expirationTime, responseData.userId)
          this.router.navigate(["/"])
        }


      }, err => {
        console.log(err)
        this.isUserAuthenticated = false
        this.authStatusListener.next(false)
        this.router.navigate(["/login"])
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
    let isInfuture = -authInformation.expirationDate.getTime() + now.getTime();
    let newone: any = new Date(isInfuture).getMinutes
    console.log(isInfuture / 3600000)
    if (isInfuture > 0) {
      this.token = authInformation.token
      this.isUserAuthenticated = true
      this.authStatusListener.next(true)
      this.userId = authInformation.userId
    }
    else {
      this.logout()
    }


  }
  private saveAuthData(token: string, expirationdate: any, userId: any) {
    const expiresIn: any = new Date(expirationdate)
    localStorage.setItem("token", token);
    localStorage.setItem("expirationDate", expiresIn)
    localStorage.setItem("userId", userId)

  }
  private clearAuthData() {
    localStorage.removeItem("token")
    localStorage.removeItem("expirationDate")
    localStorage.removeItem("userId")


  }
  private getAuthData() {
    let token = localStorage.getItem("token")
    let expirationDate: any = localStorage.getItem("exprationDate")
    expirationDate = new Date(expirationDate)

    if (!token || !expirationDate) {
      return;
    } return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: localStorage.getItem("userId")
    }

  }
}
