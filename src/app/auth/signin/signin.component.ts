import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { userService } from '../user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(public userService: userService) { }

  ngOnInit(): void {
  }
  onSignup(form: NgForm) {
    if (form.invalid) {
      return
    }
    this.userService.signup(form.value.email, form.value.password)
    form.resetForm();

  }
}
