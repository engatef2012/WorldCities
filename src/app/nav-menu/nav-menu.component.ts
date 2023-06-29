import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent implements OnInit,OnDestroy {

  constructor(private authService: AuthService, private router: Router) {
    this.authService.authStatus
      .pipe(takeUntil(this.destorysubject)).subscribe(result => {
        this.isLoggedIn = result;
      })
  }
  private destorysubject = new Subject();
    isLoggedIn:boolean = false;
    ngOnDestroy(): void {
      this.destorysubject.next(true);
      this.destorysubject.complete();
    }

  ngOnInit(): void {
  }
  onLogOut() {
    this.authService.logOut();
    this.isLoggedIn = false;
  }
}
