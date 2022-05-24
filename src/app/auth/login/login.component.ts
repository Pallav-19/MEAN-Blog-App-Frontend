import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { userService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isLoading: boolean = false
  constructor(public userService: userService) { }
  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value)
    this.isLoading = true
    this.userService.login(form.value.email, form.value.password)
    form.resetForm()
    this.isLoading =false

  }

  ngOnInit(): void {

  }

}
