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
    // const headers = new HttpHeaders({
    //   'email': formData.email,
    //   'password': formData.password
    // });
    
    return this.http.post(`${this.apiUrl}/api/login`,formData);
  }

  getAllBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/brands`);
  }

  addProduct(formData: any): Observable<any> {
   
    let formdate = new FormData();
    formdate.append("name", formData.get("name").value);
    formdate.append("slug", formData.get("slug").value);

    console.log("formData.value",formData.value)
    const images = formData.get("image").value as File[];
    
    console.log("images",images)
    if (images && images.length > 0) {
      images.forEach((file: File) => {
        formdate.append("images", file, file.name);
      });
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

  getPopularModels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/most-popular-models`);
  }

  getExploreChronoSouq(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/explore-chronosouq`);
  }

  getBuyerProtectionCommnts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/comments`);
  }
}
