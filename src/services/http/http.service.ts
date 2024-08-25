import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private apiUrl = environment.apipath;
  constructor(private http: HttpClient) {}
  getusername(username: string) {
    return this.http.get(`${this.apiUrl}/api/usernames?name=${username}`);
  }
  register(FormControl: any): Observable<any> {
    console.log("hello", this.apiUrl);
    let formdate = new FormData();
    formdate.append("name", FormControl.get("username").value);
    formdate.append("email", FormControl.get("email").value);
    formdate.append("password", FormControl.get("password").value);

    return this.http.post(`${this.apiUrl}/api/register`, formdate);
  }

  login(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/login`, formData);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products`);
  }
}
