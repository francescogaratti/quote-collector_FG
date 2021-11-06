import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Quote } from '@models/quotes';
import { AuthService } from '../services/auth.service';

export let qod = {};
@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit {
  @Output() closeTopbar = new EventEmitter<boolean>();
  @Output() refreshQuotes = new EventEmitter<void>();

  quoteOfTheDay!: Quote;

  nowDate: Date = new Date();
  formattedQuote: string = '';

  close() {
    this.closeTopbar.emit(true);
  }

  refreshQ() {
    this.refreshQuotes.emit();
  }

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    fetch('https://type.fit/api/quotes')
      .then((response) => response.json())
      .then((data) => {
        let randomIndex = Math.floor(Math.random() * data.length);
        this.quoteOfTheDay = {
          author: data[randomIndex].author,
          text: data[randomIndex].text,
          dateOfCreation: this.nowDate,
        };
        qod = this.quoteOfTheDay;

        this.formatQuote(this.quoteOfTheDay);
      });
  }

  saveQuoteOfTheDay() {
    let quote = this.quoteOfTheDay;
    console.info(quote);
    this.auth.newQuote(quote).then((q) => {
      if (q) {
        console.info('quote saved');
      } else {
        console.error('an error occurred');
      }
    });
    this.refreshQ();
  }

  formatQuote(quote: Quote) {
    if (!quote.author) {
      quote.author = 'Anonymous';
    }
    this.formattedQuote = `${quote.text}   
(${quote.author})`;
  }
}
