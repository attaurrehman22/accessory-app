import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpService } from '../http/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpService) {}

  checkUsernameExists(username: string): Observable<boolean> {
    let data:any=this.http.getusername(username);
    console.log(data)
    if(data.data.length >= 0){
      return of(true); // return an Observable that emits true
    } else {
      return of(false); // return an Observable that emits false
    }
  }

}
