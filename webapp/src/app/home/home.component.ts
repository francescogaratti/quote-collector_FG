import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {} from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { Quote } from '@models/quotes';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { AuthService } from '../services/auth.service';
import { Clipboard } from '@angular/cdk/clipboard';

// const analytics = getAnalytics(app);

// const db = getFirestore(app);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  quotes: Quote[] = [];
  clipboardCopy: string = '';

  authorFormControl: FormControl = new FormControl('', [Validators.required]);
  quoteTextFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);

  dataSource = new MatTableDataSource(this.quotes);

  displayedColumns = ['author', 'text', 'action'];
  constructor(private auth: AuthService, private clipboard: Clipboard) {}

  ngOnInit(): void {
    this.getQuotes();
  }

  copyQuote(quote: Quote) {
    let craftQuote = `“${quote.text}”

${quote.author}`;

    this.clipboardCopy = craftQuote;
    this.clipboard.copy(this.clipboardCopy);
    console.info(this.clipboardCopy);
  }
  saveQuote() {
    let a = this.authorFormControl.value;
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

    let quote: Quote = { author: a, text: t };
    this.auth.newQuote(quote).then((q) => {
      if (q) {
        console.info('quote saved');
      } else {
        console.error('an error occurred');
      }
    });
    this.getQuotes();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getQuotes() {
    this.auth.getQuotes().then((quotes) => {
      this.quotes = quotes;
      console.info(this.quotes);
      this.dataSource = new MatTableDataSource(this.quotes);
    });
  }
}

async function getAllQuotes(db: any) {
  const quotesCol = collection(db, 'quotes');
  const quoteSnapshot = await getDocs(quotesCol);
  const quotesList = quoteSnapshot.docs.map((doc) => doc.data());
  return quotesList;
}
