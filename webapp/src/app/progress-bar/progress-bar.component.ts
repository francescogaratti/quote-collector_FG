import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css'],
})
export class ProgressBarComponent implements OnInit {
  visible: boolean = true;
  constructor(private auth: AuthService) {
    this.auth.asyncOperation.subscribe(
      (value: boolean) => (this.visible = value)
    );
  }

  ngOnInit(): void {}
}
