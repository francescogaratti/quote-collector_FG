import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {} from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { Quote } from '@models/quotes';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { AuthService } from '../services/auth.service';

// const analytics = getAnalytics(app);

// const db = getFirestore(app);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  mockQuotes: Quote[] = [
    { author: 'fra', text: 'sono bellissimo' },
    { author: 'cicca', text: 'non si scivola sulle bucce di patate' },
    { author: 'la nonna', text: 'gheto magnà?' },
  ];

  quotes: Quote[] = [];

  authorFormControl: FormControl = new FormControl('', [Validators.required]);
  quoteTextFormControl: FormControl = new FormControl('', [
    Validators.required,
  ]);

  dataSource = new MatTableDataSource(this.quotes);

  displayedColumns = ['author', 'text', 'action'];
  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.getQuotes();
  }

  copyQuote(quote: Quote) {
    console.info(quote);
  }
  saveQuote() {
    let a = this.authorFormControl.value;
    let t = this.quoteTextFormControl.value;
    let qqq: Quote = { author: a, text: t };
    this.mockQuotes.push(qqq);
    this.dataSource = new MatTableDataSource(this.quotes);
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

// getUserServices() {
//   this.auth.getUserServices().then((services) => {
//     let allServices: LocationService[] = [];
//     services.forEach((service) => allServices.push(service));
//     this.allCustomServices = allServices;
//     console.info(this.allCustomServices);
//   });
// }
