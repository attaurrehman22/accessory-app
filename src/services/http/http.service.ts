import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private apiUrl = environment.apipath;
  constructor(private http: HttpClient) { }
  getusername(username: string){
    return this.http.get(this.apiUrl+'/api/usernames?name='+username);
  }
}
