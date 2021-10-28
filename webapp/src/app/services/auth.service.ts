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

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  host: string = 'http://localhost:4200/'; // localhost for development

  user!: User;
  auth: Auth = getAuth();
  db = getFirestore(this.auth.app);

  user$: Subject<User> = new Subject<User>();
  asyncOperation: Subject<boolean> = new Subject<boolean>(); // signal to the progress bar
  logged: boolean | null = null;

  constructor(private router: Router) {
    this.auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        // ? convertion from FirebaseUser to User
        const user: User = convertUser(firebaseUser);
        // ? check if the user is already present in the DB
        // this.checkUserOnDB(this.user);
      } else this.logged = false;
    });
  }

  /** LOGIN */

  async grantAccess(): Promise<boolean> {
    if (this.logged == null) {
      await sleep(100);
      return this.grantAccess();
    } else return !!this.logged;
  }

  // async checkUserOnDB(user: User) {
  //   this.asyncOperation.next(true);
  //   const usersCol = collection(this.db, 'users');
  //   const usersSnapshot = await getDocs(usersCol);
  //   let res = usersSnapshot.docs.find((doc) => doc.id == user.uid);
  //   if (!res) {
  //     console.info(user.name, 'not present in the DB');
  //     console.info('saving now...');
  //     setDoc(doc(this.db, 'users', user.uid), user);
  //     this.user = user;
  //   } else this.user = res ? (res.data() as User) : this.user;
  //   this.logged = true;
  //   // ? spread the user to listeners
  //   this.asyncOperation.next(false);
  //   this.user$.next(this.user);
  // }

  loginWithGoogle() {
    this.asyncOperation.next(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(() => {
        this.asyncOperation.next(false);
        this.router.navigateByUrl('/');
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

  /** LOCATIONS */

  // async getLocations(): Promise<SleepLocation[]> {
  //   this.asyncOperation.next(true);
  //   const locaitonCollection = collection(this.db, 'locations');
  //   const snapshot = await getDocs(locaitonCollection);
  //   let locations: SleepLocation[] = [];
  //   snapshot.docs.forEach((doc) => locations.push(doc.data() as SleepLocation));
  //   this.asyncOperation.next(false);
  //   return locations;
  // }

  async getQuotes(): Promise<Quote[]> {
    this.asyncOperation.next(true);
    const quoteCollection = collection(this.db, 'quotes');
    const snapshot = await getDocs(quoteCollection);
    let quotes: Quote[] = [];
    snapshot.docs.forEach((doc) => quotes.push(doc.data() as Quote));
    this.asyncOperation.next(false);
    return quotes;
  }

  // async getUserLocations(): Promise<SleepLocation[]> {
  //   this.asyncOperation.next(true);
  //   const locations: SleepLocation[] = await this.getLocations();
  //   let user_locations: SleepLocation[] = [];
  //   this.user.locations.forEach((id) => {
  //     let location = locations.find((l) => l.id == id);
  //     if (location) user_locations.push(location);
  //   });
  //   this.asyncOperation.next(false);
  //   return user_locations;
  // }

  /** RESERVATIONS */

  // async newReservation(reservation: Reservation): Promise<string | null> {
  //   this.asyncOperation.next(true);
  //   try {
  //     // ? creates the location on the primary collection
  //     const docRef = await addDoc(
  //       collection(this.db, 'reservations'),
  //       reservation
  //     );
  //     reservation.id = docRef.id;
  //     // ? update reservation with its own id
  //     await setDoc(doc(this.db, 'reservations', reservation.id), reservation, {
  //       merge: true,
  //     });
  //     this.sendReservation(reservation);
  //   } catch (err) {
  //     console.error(err);
  //     return null;
  //   }
  //   this.asyncOperation.next(false);
  //   return reservation.id;
  // }

  // async getUserReservations(): Promise<Reservation[]> {
  //   this.asyncOperation.next(true);
  //   const q = query(
  //     collection(this.db, 'reservations'),
  //     where('userId', '==', this.user.uid)
  //   );

  //   const querySnapshot = await getDocs(q);
  //   let reservations: Reservation[] = [];
  //   querySnapshot.forEach((doc) => {
  //     reservations.push(doc.data() as Reservation);
  //   });
  //   this.asyncOperation.next(false);
  //   return reservations;
  // }

  // async getUserServices(): Promise<LocationService[]> {
  //   this.asyncOperation.next(true);
  //   const q = query(
  //     collection(this.db, 'services'),
  //     where('authorId', '==', this.user.uid)
  //   );

  //   const querySnapshot = await getDocs(q);
  //   let services: LocationService[] = [];
  //   querySnapshot.forEach((doc) => {
  //     services.push(doc.data() as LocationService);
  //   });
  //   this.asyncOperation.next(false);
  //   return services;
  // }

  // async getDefaultServices(): Promise<LocationService[]> {
  //   this.asyncOperation.next(true);
  //   const q = query(
  //     collection(this.db, 'services'),
  //     where('authorId', '==', 'default')
  //   );

  //   const querySnapshot = await getDocs(q);
  //   let services: LocationService[] = [];
  //   querySnapshot.forEach((doc) => {
  //     services.push(doc.data() as LocationService);
  //   });
  //   this.asyncOperation.next(false);
  //   return services;
  // }

  // //no buono
  // async getLocationServices(
  //   location: SleepLocation
  // ): Promise<LocationService[]> {
  //   this.asyncOperation.next(true);
  //   const q = query(
  //     collection(this.db, 'services'),
  //     where('id', 'in', location.services)
  //   );

  //   const querySnapshot = await getDocs(q);
  //   let services: LocationService[] = [];
  //   querySnapshot.forEach((doc) => {
  //     services.push(doc.data() as LocationService);
  //   });
  //   this.asyncOperation.next(false);
  //   return services;
  // }

  // async getUserLocationsReservations(): Promise<Reservation[]> {
  //   this.asyncOperation.next(true);
  //   const q = query(
  //     collection(this.db, 'reservations'),
  //     where('locationId', 'in', this.user.locations)
  //   );
  //   const querySnapshot = await getDocs(q);
  //   let reservations: Reservation[] = [];
  //   querySnapshot.forEach((doc) => {
  //     reservations.push(doc.data() as Reservation);
  //   });
  //   this.asyncOperation.next(false);
  //   return reservations;
  // }

  // async getLocationReservations(
  //   location: SleepLocation
  // ): Promise<Reservation[]> {
  //   this.asyncOperation.next(true);
  //   const q = query(
  //     collection(this.db, 'reservations'),
  //     where('locationId', '==', location.id)
  //   );
  //   const querySnapshot = await getDocs(q);
  //   let reservations: Reservation[] = [];
  //   querySnapshot.forEach((doc) => {
  //     reservations.push(doc.data() as Reservation);
  //   });
  //   this.asyncOperation.next(false);
  //   return reservations;
  // }

  // async getLocationReservationsByDate(
  //   locationId: string,
  //   date: string
  // ): Promise<Reservation[]> {
  //   this.asyncOperation.next(true);
  //   const q = query(
  //     collection(this.db, 'reservations'),
  //     where('locationId', '==', locationId),
  //     where('date', '==', date),
  //     where('status', '!=', 'cancelled')
  //   );

  //   const querySnapshot = await getDocs(q);
  //   let reservations: Reservation[] = [];
  //   querySnapshot.forEach((doc) => {
  //     // doc.data() is never undefined for query doc snapshots
  //     // console.log(doc.id, " => ", doc.data());
  //     reservations.push(doc.data() as Reservation);
  //   });
  //   this.asyncOperation.next(false);
  //   return reservations;
  // }

  // async sendReservation(reservation: Reservation): Promise<boolean> {
  //   this.asyncOperation.next(true);

  //   let location = await this.getLocations()
  //     .then((locations) =>
  //       locations.find((l) => l.id == reservation.locationId)
  //     )
  //     .catch((err) => null);

  //   const body: Object = {
  //     params: {
  //       user: JSON.stringify(this.user),
  //       reservation: JSON.stringify(reservation),
  //       location: JSON.stringify(location),
  //     },
  //     responseType: 'arrayBuffer',
  //   };

  //   let res: boolean = await this.http
  //     .post<any>(this.host + 'reservation/new', body)
  //     .toPromise()
  //     .then((res: { sent: boolean; message: string }) => {
  //       console.info(res.message);
  //       return res.sent;
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       return false;
  //     });
  //   this.asyncOperation.next(false);
  //   return res;
  // }

  // async cancelReservation(reservation: Reservation): Promise<boolean> {
  //   this.asyncOperation.next(true);
  //   reservation.status = 'Cancelled';
  //   try {
  //     await setDoc(doc(this.db, 'reservations', reservation.id), reservation, {
  //       merge: true,
  //     });
  //     this.asyncOperation.next(false);
  //     return true;
  //   } catch (err) {
  //     console.error(err);
  //     this.asyncOperation.next(false);
  //     return false;
  //   }
  // }

  // async getReservationQRCODE(reservation: Reservation): Promise<string> {
  //   this.asyncOperation.next(true);
  //   const body: Object = {
  //     params: {
  //       reservation: JSON.stringify(reservation),
  //     },
  //     responseType: 'arrayBuffer',
  //   };

  //   let res: string = await this.http
  //     .post<any>(this.host + 'reservation/qrcode', body)
  //     .toPromise()
  //     .then((res: any) => (res && res.qrcode ? res.qrcode : res.error))
  //     .catch((err) => {
  //       console.error(err);
  //       return err;
  //     });
  //   this.asyncOperation.next(false);
  //   return res;
  // }

  // /** SERVICE */

  // async newService(service: LocationService): Promise<string | null> {
  //   this.asyncOperation.next(true);
  //   try {
  //     // ? creates the service on the primary collection
  //     const docRef = await addDoc(collection(this.db, 'services'), service);
  //     service.id = docRef.id;
  //     // ? update service with its own id
  //     await setDoc(doc(this.db, 'services', service.id), service, {
  //       merge: true,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     return null;
  //   }
  //   this.asyncOperation.next(false);
  //   return service.id;
  // }
}
