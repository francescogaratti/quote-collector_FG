import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  user!: User;

  constructor(private auth: AuthService, public router: Router) {
    this.auth.user$.subscribe((user: User) => (this.user = user));
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  logout() {
    this.auth.logOut();
  }

  ngOnInit(): void {}
}
