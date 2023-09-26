import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private route: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const sessionData = JSON.parse(sessionStorage.getItem('user') || '{}');
    if (sessionData) {
      if (route.data && route.data['role'] === 'Admin') {
        // Check if the route requires 'admin' role
        if (sessionData.data && sessionData.data.role === 'Admin') {
          return true; // Allow access to the route for 'admin' users
        } else {
          // Redirect to unauthorized route for non-'admin' users
          this.router.navigate(['/']);
          return false; // Block access to the route
        }
      } else {
        // For routes that don't specify a role, allow access for authenticated users
        return true;
      }
    } else {
      // If not authenticated, redirect to '/index' or a specific unauthorized route
      this.router.navigate(['/']);
      return false; // Block access to the route
    }
  }
}
