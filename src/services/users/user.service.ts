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
    console.log("email in User Service", email);

    return this.http.getuserEmail(email).pipe(
      map((response: any) => {
        console.log("API Response:", response);
        return response.exists;  
      }),
      catchError((error) => {
        console.error("Error checking email:", error);
        return of(false);
      })
    );
  }

  checkUsernameExists(username: string): Observable<boolean> {
    console.log("Username in User Service",username)
    return this.http.getusername(username).pipe(
      map((response: any) => {
        console.log("API Response:", response);
        return response.exists;  
      }),
      catchError((error) => {
        console.error("Error checking username:", error);
        return of(false);
      })
    );
  }
}
