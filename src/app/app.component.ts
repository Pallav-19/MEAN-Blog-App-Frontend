import { Component, OnInit } from '@angular/core';
import { userService } from './auth/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private userService: userService) {
    this.userService.autoAuth()

  }
  ngOnInit(): void {

  }

}
