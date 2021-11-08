import { Component, OnInit } from '@angular/core';
import { User } from '@models/user';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  user!: User;

  constructor(private auth: AuthService, public router: Router) {
    this.auth.user$.subscribe((user: User) => (this.user = user));
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }

  ngOnInit(): void {}
}
