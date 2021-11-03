import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit {
  @Output() closeTopbar = new EventEmitter<boolean>();

  close() {
    this.closeTopbar.emit(true);
  }

  constructor() {}

  ngOnInit(): void {}
}
