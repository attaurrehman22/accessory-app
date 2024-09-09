import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private apiUrl = environment.apipath;
  constructor(private http: HttpClient) {}


  getuserEmail(email: string) {
    console.log("email in http Service", email);
    
    const formData = new FormData();
    formData.append('email', email);
  
    return this.http.post(`${this.apiUrl}/api/check-email-existence`, formData);
  }

  getusername(username: string) {
    console.log("username in http Service", username);
    
    const formData = new FormData();
    formData.append('email', username);
  
    return this.http.post(`${this.apiUrl}/api/check-user-existence`, formData);
  }
  

  // getusername(username: string) {
  //   console.log("Username in http Service",username)
  //   return this.http.get(`${this.apiUrl}/api/usernames?name=${username}`);
  // }
  register(FormControl: any): Observable<any> {
    let formdate = new FormData();
    formdate.append("name", FormControl.get("username").value);
    formdate.append("email", FormControl.get("email").value);
    formdate.append("password", FormControl.get("password").value);

    return this.http.post(`${this.apiUrl}/api/register`, formdate);
  }

  login(formData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  
    // Encoding the form data
    const body = new HttpParams()
      .set('email', formData.email)
      .set('password', formData.password);
  
    return this.http.post(`${this.apiUrl}/api/login`, body.toString(), { headers });
  }

  getTopBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/topBrands`);
  }

  getProductsByCategory(catID:any){
    return this.http.get(`${this.apiUrl}/api/search-product-by?${catID}`);
  }

  searchedProducts(name:any){
    return this.http.get(`${this.apiUrl}/api/global-search?query=${name}`);
  }

  getAllBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/allBrands`);
  }

  getCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/categories`);
  }

  getPrductFormDropDnCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/product-form-dropdown`);
  }

  getCategoryDropDown(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/categories-dropdown`);
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

  getPopularproductsWithID(ID:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/brands/${ID}`);
  }

  getAllBrandsDropdDown(ID:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/brands`);
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

  getHomeData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/home-data`);
  }

  getHowItWorksData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/how-it-works`);
  }
}
