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
    this.isLoading = true
    if (form.invalid) {
      return;
    }
    console.log(form.value)
    this.userService.login(form.value.email, form.value.password)
    form.resetForm()


  }

  ngOnInit(): void {

  }

}
