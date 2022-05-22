import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { user } from "./user.model"
@Injectable({ providedIn: 'root' })
export class userService {
  constructor(private http: HttpClient) { }
  signup(email: string, password: string) {
    const user:user = {
      email: email,
      password: password,
    }
    this.http.post("http://localhost:3300/api/users/signup", user).subscribe(gotData => {
              console.log(gotData)
    })

  }

}
