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

  getAllBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/brands-dropdown`);
  }

  addProduct(formData: any): Observable<any> {

    let formdate = new FormData();
    formdate.append("name", formData.get("name").value);
    formdate.append("slug", formData.get("slug").value);

   
    if (formData.get("image").value) {
      formdate.append("image", formData.get("image").value);
    }

    const url = `${this.apiUrl}/api/brands/save/?name=${formData.get("name").value}&slug=${formData.get("slug").value}`;
    return this.http.post(url, formdate, {
      headers: {
      },
    });
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products`);
  }
}
