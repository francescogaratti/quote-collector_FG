import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Quote } from '@models/quotes';
import { AuthService } from '../services/auth.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Router } from '@angular/router';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  quotes: Quote[] = [];
  clipboardCopy: string = '';
  nowDate: Date = new Date();
  formattedQuote: string = '';

  visible = true;

  authorFormControl: FormControl = new FormControl('', [Validators.required]);
  quoteTextFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);

  dataSource = new MatTableDataSource(this.quotes);

  displayedColumns = ['author', 'text', 'action'];
  constructor(
    private auth: AuthService,
    private clipboard: Clipboard,
    private router: Router,
    private utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.getQuotes();
  }

  copyQuote(quote: Quote) {
    let craftQuote = `${quote.text}   
(${quote.author})`;

    this.clipboardCopy = craftQuote;
    this.clipboard.copy(this.clipboardCopy);
    console.info(this.clipboardCopy);
    this.utils.openSnackBar('Quote copied.');
  }
  saveQuote() {
    let a = '';
    if (this.authorFormControl.value) {
      a = this.authorFormControl.value;
    } else {
      a = 'Anonymous';
    }
    let t = this.quoteTextFormControl.value;
    if (t.charAt(0) == '"' || t.charAt(0) == '“' || t.charAt(0) == `'`) {
      t = t.slice(1);
    }
    if (
      t.charAt(t.length - 1) == '"' ||
      t.charAt(t.length - 1) == '”' ||
      t.charAt(t.length - 1) == `'`
    ) {
      t = t.slice(0, -1);
    }

    let quote: Quote = { author: a, text: t, dateOfCreation: this.nowDate };
    this.auth.newQuote(quote).then((q) => {
      if (q) {
        console.info('quote saved');
        this.utils.openSnackBar('Quote saved correctly!');
      } else {
        console.error('an error occurred');
        this.utils.openSnackBar('Something went wrong.');
      }
    });
    this.getQuotes();
    this.authorFormControl.setValue(null);
    this.quoteTextFormControl.setValue(null);
  }

  applyFilter(event: Event) {
    this.dataSource.filter = (event.target as HTMLInputElement).value;
  }

  sortQuotes() {
    this.quotes.sort(function (a, b) {
      if (a.dateOfCreation > b.dateOfCreation) return -1;
      if (a.dateOfCreation < b.dateOfCreation) return 1;
      return 0;
    });
  }

  async getQuotes() {
    await this.auth.getQuotes().then((quotes) => {
      this.quotes = quotes;
      this.sortQuotes();
      this.dataSource = new MatTableDataSource(this.quotes);
      console.info(this.quotes);
    });
    this.setCustomFilterPredicate();
  }

  setCustomFilterPredicate() {
    this.dataSource.filterPredicate = (data: Quote, filter: string) => {
      let keywords = filter.trim().toLowerCase().split(' ');
      let content = JSON.stringify(data).toLowerCase();
      let found = false;
      keywords.forEach((keyword) => {
        if (content.indexOf(keyword) != -1) found = true;
      });
      return found;
    };
  }
}
