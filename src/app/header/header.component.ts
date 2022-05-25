import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { userService } from "../auth/user.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isUserAuthenticated: boolean = false
  authListenerSubs: Subscription
  constructor(public userService: userService) { }
  ngOnInit(): void {
    this.isUserAuthenticated = this.userService.getIsAuth();
    this.authListenerSubs = this.userService.getAuthStatusListener().subscribe((isAuthenticated) => {
      this.isUserAuthenticated = isAuthenticated;
    })


  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe()
  }
  onLogout() {
    this.userService.logout();
  }

}
