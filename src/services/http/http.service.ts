import { HttpClient, HttpHeaders } from "@angular/common/http";
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
    let formdate = new FormData();
    formdate.append("name", FormControl.get("username").value);
    formdate.append("email", FormControl.get("email").value);
    formdate.append("password", FormControl.get("password").value);

    return this.http.post(`${this.apiUrl}/api/register`, formdate);
  }

  login(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      email: formData.email,
      password: formData.password,
    });

    return this.http.post(`${this.apiUrl}/api/login`, formData);
  }

  getAllBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/brands`);
  }

  getCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/categories`);
  }

  addProduct(formData: any): Observable<any> {
    const token = localStorage.getItem("user_token");
    const url = `${this.apiUrl}/api/products/save`;
    return this.http.post(url, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products`);
  }

  getPopularModels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/most-popular-models`);
  }

  getExploreChronoSouq(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/explore-chronosouq`);
  }

  getBuyerProtectionCommnts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/comments`);
  }

  getStatics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/getStatistics`);
  }
}
