import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoaderService } from './loader.service';
import { finalize } from 'rxjs/operators';


export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Loader show karein
  loaderService.show();

  return next(req).pipe(
    finalize(() => {
      // Response/error aane ke baad loader hide karein
      loaderService.hide();
    })
  );
};
