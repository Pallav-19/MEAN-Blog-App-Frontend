import {  HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { userService } from "./user.service";
@Injectable()
export class authInterceptor implements HttpInterceptor {
  constructor(private userService: userService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const authToken = this.userService.getToken();
    console.log("auth token " + authToken)

    const authRequest = req.clone({
      headers: req.headers.set('Authorization', "Bearer " + authToken)
    })
    return next.handle(authRequest)
  }
}
