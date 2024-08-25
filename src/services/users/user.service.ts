import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpService } from "../http/http.service";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpService) {}

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.getusername(username).pipe(
      map((response: any) => {
        if (response && response.data && response.data.length > 0) {
          return true;
        } else {
          return false;
        }
      })
    );
  }
}
