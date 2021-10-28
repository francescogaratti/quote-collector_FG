import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent implements OnInit {
  user!: User;

  constructor(private auth: AuthService) {
    this.auth.user$.subscribe((user: User) => (this.user = user));
  }

  ngOnInit(): void {}

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }
  logOut() {
    this.auth.logOut();
  }
}
