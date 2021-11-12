// import { Injectable } from '@angular/core';
// import {
//   ActivatedRouteSnapshot,
//   CanActivate,
//   Router,
//   RouterStateSnapshot,
// } from '@angular/router';
// import { AuthService } from 'src/app/services/auth.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class LoggedGuard implements CanActivate {
//   constructor(private auth: AuthService, private router: Router) {}
//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): Promise<boolean> {
//     return this.auth.grantAccess().then((res) => {
//       if (res) {
//         this.router.navigateByUrl('/welcome');
//         return false;
//       }
//       return true;
//     });
//   }
// }
