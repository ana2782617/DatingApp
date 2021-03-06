import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
            if(err.status === 401){
                return throwError(err.statusText);
            }
          const applicationError = err.headers.get('Application-Error');
          if (applicationError) {
            console.log(applicationError);
            return throwError(applicationError);
          }
          const serverError = err.error;
          let modalStateErrors = '';
          if (serverError && typeof serverError === 'object') {
            for (const key in serverError) {
              //console.log(serverError[key] + ' -> ' + key);
              if (serverError[key]) {
                if (typeof serverError[key] === 'object') {
                  for (const e in serverError[key]) {
                    //console.log(serverError[key][e] + ' -> ' + e);
                    if (serverError[key][e]) {
                      modalStateErrors += serverError[key][e] + '\n';
                    }
                  }
                } else modalStateErrors += serverError[key] + '\n';
              }
            }
          }
          return throwError(modalStateErrors || serverError || 'Server Error');
        }
        return throwError(err);
      })
    );
  }
}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
