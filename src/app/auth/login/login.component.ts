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
    let emailInput = form.value.emailInput
    let passwordInput = form.value.passwordInput
    this.userService.signup(emailInput, passwordInput)

  }

  ngOnInit(): void {

  }

}
