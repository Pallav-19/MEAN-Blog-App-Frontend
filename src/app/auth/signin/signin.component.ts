import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { userService } from '../user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit,OnDestroy {
  public isLoading: boolean = false
  private authSub: Subscription

  constructor(public userService: userService) { }

  ngOnInit(): void {
    this.authSub = this.userService.getAuthStatusListener().subscribe((authStatus) => {
      this.isLoading = false;

    })
  }
  ngOnDestroy(): void {
    this.authSub.unsubscribe()
  }
  onSignup(form: NgForm) {
    this.isLoading = true
    if (form.invalid) {
      return
    }
    this.userService.signup(form.value.email, form.value.password, form.value.username)

    form.resetForm();

  }
}
