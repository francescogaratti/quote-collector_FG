import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {} from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { Quote } from '@models/quotes';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  quotes: Quote[] = [
    { author: 'fra', text: 'sono bellissimo' },
    { author: 'cicca', text: 'non si scivola sulle bucce di patate' },
    { author: 'la nonna', text: 'gheto magnà?' },
  ];

  authorFormControl: FormControl = new FormControl('', [Validators.required]);
  quoteTextFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);

  dataSource = new MatTableDataSource(this.quotes);

  displayedColumns = ['author', 'text', 'action'];
  constructor() {}

  ngOnInit(): void {}

  copyQuote(quote: Quote) {
    console.info(quote);
  }
  saveQuote() {
    let a = this.authorFormControl.value;
    let t = this.quoteTextFormControl.value;
    let qqq: Quote = { author: a, text: t };
    this.quotes.push(qqq);

    this.dataSource = new MatTableDataSource(this.quotes);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
