import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Quote } from '@models/quotes';
import { User, convertUser } from '@models/user';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  Auth,
} from 'firebase/auth';

import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
  query,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  host: string = 'http://localhost:4200/';

  user!: User;
  auth: Auth = getAuth();
  db = getFirestore(this.auth.app);

  user$: Subject<User> = new Subject<User>();
  asyncOperation: Subject<boolean> = new Subject<boolean>();
  logged: boolean | null = null;

  constructor(private router: Router) {
    this.auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user: User = convertUser(firebaseUser);
        this.checkUserOnDB(user);
      } else this.logged = false;
    });
  }

  // LOGIN

  async grantAccess(): Promise<boolean> {
    if (this.logged == null) {
      return this.grantAccess();
    } else return !!this.logged;
  }

  async checkUserOnDB(user: User) {
    this.asyncOperation.next(true);
    const usersCol = collection(this.db, 'users');
    const usersSnapshot = await getDocs(usersCol);
    let res = usersSnapshot.docs.find((doc) => doc.id == user.uid);
    if (!res) {
      console.info(user.name, 'not present in the DB');
      console.info('saving now...');
      setDoc(doc(this.db, 'users', user.uid), user);
      this.user = user;
    } else this.user = res ? (res.data() as User) : this.user;
    this.logged = true;

    this.asyncOperation.next(false);
    this.user$.next(this.user);
  }

  loginWithGoogle() {
    this.asyncOperation.next(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(() => {
        this.asyncOperation.next(false);
        this.router.navigateByUrl('/home');
      })
      .catch((error) => {
        this.asyncOperation.next(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(
          'Login error',
          errorCode,
          errorMessage,
          email,
          credential
        );
      });
  }

  logOut() {
    this.asyncOperation.next(true);
    signOut(this.auth)
      .then(() => {
        console.info('logout success');
        this.asyncOperation.next(false);
        this.router.navigateByUrl('/');
        this.user$.next(undefined);
      })
      .catch((error) => {
        this.asyncOperation.next(false);
        console.error('logout error');
      });
  }

  // QUOTES

  async getQuotes(): Promise<Quote[]> {
    this.asyncOperation.next(true);
    const quoteCollection = collection(this.db, 'quotes');
    const snapshot = await getDocs(quoteCollection);
    let quotes: Quote[] = [];
    snapshot.docs.forEach((doc) => quotes.push(doc.data() as Quote));
    this.asyncOperation.next(false);
    return quotes;
  }

  async newQuote(quote: Quote): Promise<boolean> {
    this.asyncOperation.next(true);
    try {
      const docRef = await addDoc(collection(this.db, 'quotes'), quote);
    } catch (err) {
      console.error(err);
      this.asyncOperation.next(false);
      return false;
    }
    this.asyncOperation.next(false);
    return true;
  }
}
