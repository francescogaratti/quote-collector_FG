import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {} from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { Quote } from '@models/quotes';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { AuthService } from '../services/auth.service';
import { Clipboard } from '@angular/cdk/clipboard';

// const data = null;

// const xhr = new XMLHttpRequest();
// xhr.withCredentials = true;

// xhr.addEventListener('readystatechange', function () {
//   if (this.readyState === this.DONE) {
//     console.log(this.responseText);
//   }
// });

// xhr.open(
//   'GET',
//   'https://yusufnb-quotes-v1.p.rapidapi.com/widget/~einstein.json'
// );
// xhr.setRequestHeader('x-rapidapi-key', 'SIGN-UP-FOR-KEY');
// xhr.setRequestHeader('x-rapidapi-host', 'yusufnb-quotes-v1.p.rapidapi.com');

// xhr.send(data);
let randomA = '';
let randomQ = '';

fetch('https://type.fit/api/quotes')
  .then((response) => response.json())
  .then((data) => {
    var randomIndex = Math.floor(Math.random() * data.length);
    //document.getElementById("set").innerHTML = data[randomIndex].text;
    randomQ = data[randomIndex].text;
  });

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  quotes: Quote[] = [];
  clipboardCopy: string = '';
  nowDate: Date = new Date();
  quoteOfTheDay!: Quote;
  formattedQuote: string = '';
  visible = true;

  authorFormControl: FormControl = new FormControl('', [Validators.required]);
  quoteTextFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);

  dataSource = new MatTableDataSource(this.quotes);

  displayedColumns = ['author', 'text', 'action'];
  constructor(private auth: AuthService, private clipboard: Clipboard) {}

  ngOnInit(): void {
    this.getQuotes();
    console.info(this.nowDate);

    fetch('https://type.fit/api/quotes')
      .then((response) => response.json())
      .then((data) => {
        let randomIndex = Math.floor(Math.random() * data.length);
        //document.getElementById("set").innerHTML = data[randomIndex].text;
        this.quoteOfTheDay = {
          author: data[randomIndex].author,
          text: data[randomIndex].text,
          dateOfCreation: this.nowDate,
        };
        this.formatQuote(this.quoteOfTheDay);
        console.info(this.quoteOfTheDay);
      });
  }

  copyQuote(quote: Quote) {
    let craftQuote = `${quote.text}   
(${quote.author})`;

    this.clipboardCopy = craftQuote;
    this.clipboard.copy(this.clipboardCopy);
    console.info(this.clipboardCopy);
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
      } else {
        console.error('an error occurred');
      }
    });
    this.getQuotes();
    this.authorFormControl.setValue(null);
    this.quoteTextFormControl.setValue(null);
  }

  saveQuoteOfTheDay() {
    let quote = this.quoteOfTheDay;
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

  formatQuote(quote: Quote) {
    if (!quote.author) {
      quote.author = 'Anonymous';
    }
    this.formattedQuote = `${quote.text}   
(${quote.author})`;
  }
}

async function getAllQuotes(db: any) {
  const quotesCol = collection(db, 'quotes');
  const quoteSnapshot = await getDocs(quotesCol);
  const quotesList = quoteSnapshot.docs.map((doc) => doc.data());
  return quotesList;
}
