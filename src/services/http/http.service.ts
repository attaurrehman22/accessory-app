import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService implements OnInit {
  private apiUrl = environment.apipath;
  token: any = localStorage.getItem("user_token");
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem("user_token");
  }
  ngOnInit(): void {
    this.token = localStorage.getItem("user_token");
  }

  getuserEmail(email: string) {
    const formData = new FormData();
    formData.append("email", email);

    return this.http.post(`${this.apiUrl}/api/check-email-existence`, formData);
  }

  getusername(username: string) {
    const formData = new FormData();
    formData.append("username", username);

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
      "Content-Type": "application/x-www-form-urlencoded",
    });

    const body = new HttpParams()
      .set("email", formData.email)
      .set("password", formData.password);

    return this.http.post(`${this.apiUrl}/api/login`, body.toString(), {
      headers,
    });
  }


  sendEmail(formData: any): Observable<any> {
    const url = `${this.apiUrl}/api/forgot-password`;
    return this.http.post(url, formData);
  }

  resetPassword(formData: any): Observable<any> {
    const url = `${this.apiUrl}/api/reset-password`;
    return this.http.post(url, formData);
  }


  changePassword(formData): Observable<any> {
    const url = `${this.apiUrl}/api/profile/change-password`;
    return this.http.post(url, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getTopBrands(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/topBrands`);
  }

  getallDropDownformData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/product-form-dropdown`);
  }

  getProductsByCategory(queryString: any) {
    return this.http.get(`${this.apiUrl}/api/search-product-by/?${queryString}`);
  }

  searchedProducts(name: any) {
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

  getAllPopularModels(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/most-popular-models`);
  }

  getDealerDetails(ID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/dealer/${ID}/details`);
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

  removeProduct(ID: any): Observable<any> {
    const url = `${this.apiUrl}/api/listing/delete/${ID}`;
    return this.http.delete(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  gtUserDetails(): Observable<any> {
    const url = `${this.apiUrl}/api/me`;
    return this.http.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getCountryLists(): Observable<any> {
    const url = `${this.apiUrl}/api/get-countries`;
    return this.http.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getCityLists(formData): Observable<any> {
    const url = `${this.apiUrl}/api/get-cities`;
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

  getProductsByID(ID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products/${ID}`);
  }

  getProductsofUnverifiedByID(ID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/product-perview/${ID}`);
  }

  getRevieweruserByID(ID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/dealer/${ID}/details`);
  }

  getSimilarProductsByID(ID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/products/${ID}/similar`);
  }

  getSimilarProductsByIDwithPage(
    productId: number,
    page: number = 1
  ): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/products/${productId}/similar?page=${page}`
    );
  }

  getDealerReviewsByID(ID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/dealer/${ID}/reviews`);
  }

  getPopularproductsWithID(ID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/brands/${ID}`);
  }

  getWatchOfTheDay(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/get-watch-of-the-day`);
  }

  getFilteredData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/get-filters-data`);
  }

  getTopBrandsData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/get-top-brands-data`);
  }

  getAllStaticstestimonial(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/testimonials`);
  }

  getFeaturedList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/getActivePromotions`);
  }

  getAllBrandsDropdDown(): Observable<any> {
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
    return this.http.post(`${this.apiUrl}/api/admin/brands`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  editAdminBrand(formData, ID): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/brands/${ID}`, formData, {
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
    return this.http.post(
      `${this.apiUrl}/api/admin/brands/${ID}/toggle-active`,
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  topAdminBrand(ID): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/admin/brands/${ID}/toggle-top`,
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  saveWatchOfTheDay(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/watch-of-the-day/set`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  updateWatchOfTheDay(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/watch-of-the-day/update`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  removeWatchOfTheDay(ID:any): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/watch-of-the-day/delete/${ID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  actandDeacWatchOfTheDay(ID:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/watch-of-the-day/set-active/${ID}`,{}, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getAdminUsers(pageIndex: number = 0, pageSize: number = 100): Observable<any> {
    let pageSize2 = 100;
    return this.http.get(`${this.apiUrl}/api/admin/user/list?page=${pageIndex + 1}&per_page=${pageSize2}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  changeUserType(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/admin/user/update-user-type`, formData, {
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
    return this.http.post(`${this.apiUrl}/api/admin/categories`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  editAdminCategory(formData, ID): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/api/admin/categories/${ID}`,
      formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
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
    return this.http.post(
      `${this.apiUrl}/api/admin/categories/${ID}/toggle-active`,
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  // getAdminProducts(): Observable<any> {
  getAdminProducts( name,pageIndex: number, pageSize: number, sortField: string, sortDirection: string,category_ids:any[] ,brand_ids:any[] , watch_gender ,sort_by?: string,
    sort_order?: string): Observable<any> {
      let params = new HttpParams()
      .set('page', pageIndex.toString())
      .set('per_page', pageSize.toString())
      .set('sortField', sortField)
    
      
      .set('sortDirection', sortDirection);
  
    if (name) {
      params = params.set('name', name);
    }

    if (sort_by) {
      params = params.set('sort_by', sort_by);
    }

    if (sort_order) {
      params = params.set('sort_order', sort_order);
    }

    if(watch_gender){
      params = params.set('watch_gender', watch_gender)
    }

    if(watch_gender){
      params = params.set('watch_gender', watch_gender)
    }
  
  if (category_ids && category_ids.length) {
    category_ids.forEach(category => {
      params = params.append('category_ids[]', category);
    });
  }

  if (brand_ids && brand_ids.length) {
    brand_ids.forEach(brand => {
      params = params.append('brand_ids[]', brand);
    });
  }
    return this.http.get(`${this.apiUrl}/api/admin/products`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
      params: params
    });
   
  }

  getPromotionProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/promotions`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  AddPromotionProducts(formData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/admin/promotions`,formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }


  rejectProduct(ID,formData): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/admin/products/${ID}/reject`,formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  EditPromotionProducts(formData,ID): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/admin/promotions/${ID}`,formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  DeletePromotionProducts(ID): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/admin/promotions/${ID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getAdminProductsofQuery(queryString): Observable<any> {
    const queryParams = new URLSearchParams(queryString).toString();
    return this.http.get(`${this.apiUrl}/api/admin/products/?${queryParams}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  watchOfTheDay(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/watch-of-the-day/list/get`, {
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
    return this.http.patch(
      `${this.apiUrl}/api/admin/products/${ID}/toggle-popular`,
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    
  }

  topFeatureProducts(ID): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/api/admin/products/${ID}/toggle-feature`,
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
    
  }

  activateAdminProducts(ID): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/api/admin/products/${ID}/toggle-active`,
      {},
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }



  getAdminDashBoardDetails(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/admin/dashboard/stats`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  getAdminAccessroiesCategory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/accessory-categories`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   addAdminAccessroyCategory(bodyData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/accessory-categories`,bodyData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   editAdminAccessroyCategory(bodyData,ID): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/accessory-categories/${ID}`,bodyData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

    deleteAdminAccessroyCategory(ID): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/accessory-categories/${ID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getAdminAccessroiesCategoryGroups(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/accessory-category-groups`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   addAdminAccessroiesCategoryGroups(bodyData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/accessory-category-groups`,bodyData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   editAdminAccessroiesCategoryGroups(bodyData,ID): Observable<any> {
      return this.http.put(`${this.apiUrl}/api/accessory-category-groups/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

     deleteAdminAccessroiesCategoryGroups(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/accessory-category-groups/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }



    getAdminAccessroiesSubCategoryGroups(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/accessory-category-sub-groups`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   addAdminAccessroiesSubCategoryGroups(bodyData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/accessory-category-sub-groups`,bodyData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   editAdminAccessroiesSubCategoryGroups(bodyData,ID): Observable<any> {
      return this.http.put(`${this.apiUrl}/api/accessory-category-sub-groups/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

     deleteAdminAccessroiesSubCategoryGroups(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/accessory-category-sub-groups/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }


    getAttributesType(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/attribute-types`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

   addAttributesType(bodyData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/attribute-types`,bodyData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   editAttributesType(bodyData,ID): Observable<any> {
      return this.http.put(`${this.apiUrl}/api/attribute-types/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

     deleteAttributesType(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/attribute-types/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }


    getAttributesValue(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/attribute-values`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

   addAttributesValue(bodyData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/attribute-values`,bodyData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   editAttributesValue(bodyData,ID): Observable<any> {
      return this.http.put(`${this.apiUrl}/api/attribute-values/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

     deleteAttributesValue(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/attribute-values/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }


     getInventory(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/inventories`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

   addInventory(bodyData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/inventories`,bodyData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   editInventory(bodyData,ID): Observable<any> {
      return this.http.put(`${this.apiUrl}/api/inventories/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

     deleteInventory(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/inventories/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

     getAccessory(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/accessories`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    getAttributes(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/attributes`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    addAttributes(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/attributes`,formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

     editAttributes(bodyData,ID): Observable<any> {
      return this.http.put(`${this.apiUrl}/api/attributes/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

     deleteAttributes(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/attributes/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    getAllAccessoryImages(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/admin/accessory-images`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }


    addAccessoryImage(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/admin/accessory-images`,formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    editAccessoryImage(bodyData,ID): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/admin/accessory-images/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    deleteAccessoryImage(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/admin/accessory-images/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    getAllAccessories(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/accessories`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    getAccessoriesById(ID): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/accessories/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    addAccessory(bodyData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    editAccessory(bodyData,ID): Observable<any> {
      return this.http.put(`${this.apiUrl}/api/accessories/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    deleteAccessoriesById(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/accessories/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    attachImagesToAccessory(bodyData,ID): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/images-attach-to-accessory/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    getAdminAttributesInventory(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/attribute-inventory`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    addAdminAttributesInventory(bodyData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/attribute-inventory`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    editAdminAttributesInventory(bodyData,ID): Observable<any> {
      return this.http.put(`${this.apiUrl}/api/attribute-inventory/${ID}`,bodyData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    deleteAdminAttributesInventory(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/attribute-inventory/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }


  // ----------------------------------  Admin Pannel Apis End Here ------------------------------


  // ----------------------------------  create Listing start ------------------------------



  addListingDetails(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/listing/create`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  updateListingDetails(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/listing/update`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  addWatchDetails(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/listing/watchDetails`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  addUploadImages(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/listing/uploadImages`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  addCondition(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/listing/watchCondition`,
      formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  addScopeOfDelivery(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/listing/scopeOfDelivery`,
      formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  addProffofOwnerShip(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/listing/proofOfOwnership`,
      formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  addpriceAndShipment(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/listing/priceAndShipment`,
      formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  addbillingInformation(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/listing/billingInformation`,
      formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  addbpublishListing(formData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/listing/publishListing`,
      formData,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  getSteper(productID: any): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/api/listing/getStep?product_id=${productID}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      }
    );
  }

  // ----------------------------------  create Listing end ------------------------------

  getWishList(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/wishlist/get`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  addWishList(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/wishlist/add`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }



  // -------------------------------------------- chat Section start --------------------------

  buyNowFromDetailsProduct(ID: any, bodyData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/buy-product/${ID}`, bodyData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getChatsWithLatestMessage(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/chat/list`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }



  getChatsDetails(chatID): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/messages/${chatID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  sendMessage(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/chat/send`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  // -------------------------------------------- chat Section end --------------------------

  // -------------------------------------------- Make Offer start --------------------------

  sendOffer(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/offers`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  offerByFilter(productID: any, chatID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/offer-by-filter?product_id=${productID}&chat_id=${chatID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  editOffer(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/update-offers`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  editOfferStatus(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/offers/status`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  sendShipmenttoBuyer(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/offers/shipment-offer/store`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  getOrderandChatIDDetails(productID: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/order/get-product-chat-info?product_id=${productID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  // -------------------------------------------- Make Offer End --------------------------


  // -------------------------------------------- My Listing Module APIs Start --------------------------


  getMyProductsListing(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/listing/user-listings`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getProductDetailsByID(ProductID): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/listing/getStep?product_id=${ProductID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getBuyOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/order/buyList`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getSellOrders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/order/sold-orders`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getOrderStatus(orderID): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/order/status/${orderID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  getOrderDetails(orderID): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/order/details/${orderID}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  createShipment(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/order/create-shipment`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }


  getBillingInformation(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/billing-information`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  saveBillingInformation(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/save-billing-information`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   getProfilingInformation(): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/profile`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

   saveProfilingInformation(formData): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/profile`, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
  // -------------------------------------------- My Listing Module APIs end --------------------------




    // ----------------------------------  create Accesries start ------------------------------

    getAccesriesStepper(ID): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/accessories/listing/getStep?product_id=${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    getAllAccesriesInformation(): Observable<any> {
      return this.http.get(`${this.apiUrl}/api/accessories/listing/user-listings`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }


    saveAccesriesInformation(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/create`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    editAccesriesInformation(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/update`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    toogleActiveAccesriesInformation(ID): Observable<any> {
      return this.http.patch(`${this.apiUrl}/api/admin/accessories/${ID}/toggle-active`, {},{
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    addPopularAccesriesInformation(ID): Observable<any> {
      return this.http.patch(`${this.apiUrl}/api/admin/accessories/${ID}/toggle-popular`, {},{
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    addFeatureAccesriesInformation(ID): Observable<any> {
      return this.http.patch(`${this.apiUrl}/api/admin/accessories/${ID}/toggle-feature`, {},{
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }


    deleteAccesriesStepper(ID): Observable<any> {
      return this.http.delete(`${this.apiUrl}/api/admin/accessories/${ID}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    saveAccesriesWatchDetails(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/watchDetails`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    saveAccesriesUploadImages(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/uploadImages`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    saveAccesrieswatchCondition(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/watchCondition`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    saveAccesriesscopeOfDelivery(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/scopeOfDelivery`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    saveAccesriespriceAndShipment(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/priceAndShipment`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    saveAccesriesbillingInformation(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/billingInformation`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

    saveAccesriesSummary(formData): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/accessories/listing/publishListing`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });
    }

        // ----------------------------------  create Accesries end ------------------------------


}



  