import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, Observable, throwError } from "rxjs";
import { ErrorComponent } from "./error/error.component";
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(req).pipe(
      catchError((err): any => {
        let message = "An Unknown Error Occured!!"
        if (err.error.error.message) {
          message = err.error.error.message
        }
        this.dialog.open(ErrorComponent, { data: { message: message } },)
        const error = new Error(err)
        throwError(() => {
          error
        })

      })
    )

  }
}
