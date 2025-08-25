import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';


export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
   const loaderService = inject(LoaderService);

  // Define endpoints to skip loader
  const skipLoaderEndpoints = [
    '/check-user-existence',
    '/check-email-existence',
    '/list',
    '/messages',
    '/buyList',
    '/profile',
    '/order-history',
    '/details',
    '/sold-orders',
    '/offer-history'
  ];

  // Check if the request URL matches any of the skipLoaderEndpoints
  const shouldSkipLoader = skipLoaderEndpoints.some(endpoint => req.url.includes(endpoint));

  // Show loader only if not skipping
  if (!shouldSkipLoader) {
    loaderService.show();
  }

  return next(req).pipe(
    finalize(() => {
      // Hide loader only if not skipping
      if (!shouldSkipLoader || shouldSkipLoader) {
        loaderService.hide();
      }
    })
  );
};
