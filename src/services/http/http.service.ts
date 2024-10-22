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
  token = localStorage.getItem("user_token");

  getuserEmail(email: string) {
    
    const formData = new FormData();
    formData.append('email', email);
  
    return this.http.post(`${this.apiUrl}/api/check-email-existence`, formData);
  }

  getusername(username: string) {
    
    const formData = new FormData();
    formData.append('username', username);
  
    return this.http.post(`${this.apiUrl}/api/check-user-existence`, formData);
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
      'Content-Type': 'application/x-www-form-urlencoded',
    });
  
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

  getBrandsDropDownFilter(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/brandDropDownForFilters`);
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

  getAllTopNewArrivalCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/new-arrival-with-top-catagory`);
  }

  addProduct(formData: any): Observable<any> {
    
    const url = `${this.apiUrl}/api/products/save`;
    return this.http.post(url, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products`);
  }

  getProductsByID(ID:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products/${ID}`);
  }

  getRevieweruserByID(ID:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/dealer/${ID}/details`);
  }

  getSimilarProductsByID(ID:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products/${ID}/similar`);
  }

  getSimilarProductsByIDwithPage(productId: number, page: number = 1): Observable<any> {
    return this.http.get(`https://api.chronosouq.com/api/products/${productId}/similar?page=${page}`);
  }

  getDealerReviewsByID(ID:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/dealer/${ID}/reviews`);
  }

  getPopularproductsWithID(ID:any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/brands/${ID}`);
  }

  getWatchOfTheDay(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/get-watch-of-the-day`);
  }

  getAllStaticstestimonial(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/testimonials`);
  }

  getFeaturedList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/getActivePromotions`);
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

  getAdminBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/brands`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  addAdminBrand(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/brands`,formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  editAdminBrand(formData,ID): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/admin/brands/${ID}`,formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  deleteAdminBrand(ID): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/brands/${ID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  activateDeactivateAdminBrand(ID): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/brands/${ID}/toggle-active`,{}, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  topAdminBrand(ID): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/brands/${ID}/toggle-top`,{}, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getAdminCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/categories`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  addAdminCategory(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/categories`,formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  editAdminCategory(formData,ID): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/admin/categories/${ID}`,formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  deleteAdminCategory(ID): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/categories/${ID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  activateDeactivateAdminCategory(ID): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/categories/${ID}/toggle-active`,{}, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  getAdminProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/products`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  deleteAdminProducts(ID): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/products/${ID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  topAdminPopularProducts(ID): Observable<any> {
    return this.http.patch(`${this.apiUrl}/api/admin/products/${ID}/toggle-popular`,{}, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  activateAdminProducts(ID): Observable<any> {
    return this.http.patch(`${this.apiUrl}/api/admin/products/${ID}/toggle-active`,{}, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getAdminDashBoardDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/dashboard/stats`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

}
