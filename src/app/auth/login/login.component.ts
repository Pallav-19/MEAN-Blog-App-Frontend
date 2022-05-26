import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { userService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit ,OnDestroy{
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
  onLogin(form: NgForm) {
    this.isLoading = true
    if (form.invalid) {
      return;
    }
    console.log(form.value)
    this.userService.login(form.value.email, form.value.password)
    form.resetForm()


  }



}
