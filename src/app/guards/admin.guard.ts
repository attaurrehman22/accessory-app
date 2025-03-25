import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const token = localStorage.getItem('user_token');
  const isAdmin = localStorage.getItem('isAdmin') == 'true';

  if (token && isAdmin) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/login']); // Redirect to login if not authorized
    return false;
  }
};
