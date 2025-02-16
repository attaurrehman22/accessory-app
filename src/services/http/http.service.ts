import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class HttpService implements OnInit {
  private apiUrl = environment.apipath;
  token: any=localStorage.getItem("user_token");
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

  getDealerDetails(ID:any): Observable<any> {
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
      `https://api.chronosouq.com/api/products/${productId}/similar?page=${page}`
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
    return this.http.put(`${this.apiUrl}/api/admin/brands/${ID}`, formData, {
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

  getAdminUsers(pageIndex: number = 0, pageSize: number = 100): Observable<any> {
    let pageSize2=100;
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

  buyNowFromDetailsProduct(ID:any,bodyData:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/buy-product/${ID}`, bodyData,{
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
    return this.http.post(`${this.apiUrl}/api/chat/send`, formData,{
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  // -------------------------------------------- chat Section end --------------------------

// -------------------------------------------- Make Offer start --------------------------

sendOffer(formData): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/offers`, formData,{
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${this.token}`,
    },
  });
}

offerByFilter(productID:any,chatID:any): Observable<any> {
  return this.http.get(`${this.apiUrl}/api/offer-by-filter?product_id=${productID}&chat_id=${chatID}`,{
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${this.token}`,
    },
  });
}

editOffer(formData): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/update-offers`, formData,{
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${this.token}`,
    },
  });
}

editOfferStatus(formData): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/offers/status`, formData,{
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${this.token}`,
    },
  });
}


sendShipmenttoBuyer(formData): Observable<any> {
  return this.http.post(`${this.apiUrl}/api/offers/shipment-offer/store`, formData,{
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
  return this.http.post(`${this.apiUrl}/api/order/create-shipment`,formData, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${this.token}`,
    },
  });
}
// -------------------------------------------- My Listing Module APIs end --------------------------


}
