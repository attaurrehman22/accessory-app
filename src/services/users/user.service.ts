import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpService } from "../http/http.service";
import { catchError, map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpService) {}


  checkUserEmailExists(email: string): Observable<boolean> {

    return this.http.getuserEmail(email).pipe(
      map((response: any) => {
        return response.exists;  
      }),
      catchError((error) => {
        console.error("Error checking email:", error);
        return of(false);
      })
    );
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.getusername(username).pipe(
      map((response: any) => {
        return response.exists;  
      }),
      catchError((error) => {
        console.error("Error checking username:", error);
        return of(false);
      })
    );
  }
}
