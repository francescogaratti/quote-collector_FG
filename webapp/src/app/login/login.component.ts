import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user!: User;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.auth.user$.subscribe((user: User) => (this.user = user));
    console.info(this.user);
  }

  loginWithGoogle() {
    this.auth.loginWithGoogle();
  }
  logOut() {
    this.auth.logOut();
  }

  goHome() {
    this.router.navigateByUrl('home');
  }
}
