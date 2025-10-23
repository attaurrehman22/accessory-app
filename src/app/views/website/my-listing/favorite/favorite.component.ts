import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationModelComponent } from 'src/app/views/modal/confirmation-model/confirmation-model.component';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';
import { WatchInfoComponent } from '../watch-info/watch-info.component';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent implements OnInit{
  apiUrl = environment.apipath + "/";
  selectedFilter: string = "product";
  favoritesProductDetails: any[] = [];
  filteredFavoritesProductDetails: any[] = [];
  accessoriesWishList: any[] = [];
  isLoading: boolean = true;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(
    private http: HttpService,
    private router: Router,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private dialog: MatDialog,
  ) {
    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang);
      }
    }
  }

  watchTypes:any[]=[
    {id:1,name:'Promoted'},
    {id:2,name:'Featured'},
    {id:3,name:'Popular'},
    {id:4,name:'Free Shipping'}
  ];

  ngOnInit(): void {
    // this.getAccessoriesWishList();
    this.getAllBrands()
    this.applyFilters()
  }


  // applyFilters() {
  //   this.isShowFilters=false;
  //   let queryString = "";
  //   // // Add categories to the query string
  //   if (this.brands?.length > 0) {
  //     this.brands?.forEach((id, index) => {
  //       if(id?.selected){
  //         console.log("brand selected",id)
  //         queryString += `brand_id[]=${id.id}`;
  //         if (index < this.brands?.length - 1) {
  //           queryString += "&"; // Add an "&" if it's not the last element
  //         }
  //       }
  //     });
  //   }
  //   console.log("QUERSTRIG",queryString)
  //   // // Add brands to the query string
  //   if (this.watchTypes?.length > 0) {
  //     if (queryString) {
  //       queryString += "&"; // Add '&' if categories already exist
  //     }
  //     this.watchTypes.forEach((id, index) => {
  //       if(id.selected){
  //         let isPROMO=1
  //         if(id.id === 1){
  //           queryString += `&is_promoted=${isPROMO}`
  //         }
  //         if(id.id === 2){
  //           queryString += `&feature_item=${isPROMO}`
  //         }
  //         if(id.id === 3){
  //           queryString += `&popular_item=${isPROMO}`
  //         }
  //         // queryString += `brand_ids[]=${id.id}`; // Use brand_ids[] to store as an array
  //         if (index < this.watchTypes?.length - 1) {
  //           queryString += "&"; // Add '&' between values, not at the end
  //         }
  //       }
  //     });
  //   }

  //   if(this.selectedBrands?.length > 0 || this.selectedWatchTypes?.length > 0){
  //     this.isFiltereredOptionIsShow=true;
  //   }

  //   console.log("querString",queryString)
  //   // // Call the API with the constructed query string
  //   if (queryString) {
  //     this.getWishList(queryString);
  //   }else{
  //     this.getWishList(queryString);
  //   }
  // }

  applyFilters() {
    this.isShowFilters = false;
  
    const params: string[] = []; // use an array to collect params safely
  
    // ✅ Add selected brands
    this.brands?.forEach((brand) => {
      if (brand?.selected) {
        params.push(`brand_id[]=${brand.id}`);
      }
    });
  
    // ✅ Add selected watch types
    this.watchTypes?.forEach((type) => {
      if (type?.selected) {
        if (type.id === 1) params.push(`is_promoted=1`);
        else if (type.id === 2) params.push(`feature_item=1`);
        else if (type.id === 3) params.push(`popular_item=1`);
      }
    });
  
    // ✅ Detect if filters were applied
    this.isFiltereredOptionIsShow = params.length > 0;
  
    // ✅ Join all params safely with "&"
    const queryString = params.join("&");
  
    console.log("Final Query String:", queryString);
  
    // ✅ Call API
    this.getWishList(queryString);
  }
  

  get selectedWatchTypes() {
    return this.watchTypes?.filter(type => type.selected);
  }

  get selectedBrands() {
    return this.brands?.filter(category => category.selected);
  }

  isShowFilters:boolean=false;
  brands:any;

  openFilters(){
   this.isShowFilters=!this.isShowFilters;
  }

  isFiltereredOptionIsShow:boolean=false;

  clearFilters(){
    this.isFiltereredOptionIsShow=false
    this.brands?.forEach(category => (category.selected = false));
    this.watchTypes.forEach(type => (type.selected = false));
    this.filteredFavoritesProductDetails = []
    this.applyFilters()
  }

  getAllBrands() {
    this.http.getAllBrandsDropdDown().subscribe(
      (res) => {
        this.brands = res?.data;
      },
      (err) => {}
    );
  }

  wishList: any;
  getWishList(queryString) {
    this.isLoading = true;
    this.http.getWishListByFilter(queryString).subscribe((res) => {
      this.wishList = res?.data;
      this.fetchProductDetails();
    }, (err) => {
      this.isLoading = false;
    });
  }
  
  filters: any[] = [];
  async fetchProductDetails() {
    this.filteredFavoritesProductDetails = []
    try {
      for (const productId of this.wishList) {
        try {
          const res = await this.http.getProductsByID(productId).toPromise();
          const productDetail = res.data;
          if (productDetail.additional_images) {
            productDetail.additional_images = JSON.parse(productDetail.additional_images);
          }
          if (productDetail.main_image) {
            productDetail.main_image = productDetail.main_image.replace(/\\/g, "");
          }
          if (!this.filters?.some(filter => filter?.gender === productDetail?.gender)) {
            this.filters?.push({ id: productDetail.id, gender: productDetail.gender });
          }
          this.favoritesProductDetails.push(productDetail);
          this.filteredFavoritesProductDetails.push(productDetail);
          console.log("filteredFavoritesProductDetails",this.filteredFavoritesProductDetails)
        } catch (err) {
          console.error("Error fetching product details for ID " + productId, err);
        }
      }
    } finally {
      this.isLoading = false;
    }
  }

  selectedProductFilter: string = "all";

  onFilterChange(event) {
    this.selectedProductFilter = event;
    console.log("event", event);
    if (event === "all") {
      this.filteredFavoritesProductDetails = this.favoritesProductDetails;
    } else {
      this.filteredFavoritesProductDetails = this.favoritesProductDetails?.filter(product => product.gender == event);
    }
  }

  getAccessoriesWishList() {
    this.http.getAccessoryWishList().subscribe((res) => {
      this.accessoriesWishList = res.data.map((item: any) => {
        item.image = item.image.replace(/\\/g, "");
        return item;
      })  ;
    });
  }

  startChat(product) {
    this.router.navigate(["/chat"], {
      state: { data: product },
    });
  }

  goToAccessoryDetails(accessory) {
    this.router.navigate(["/accessories/details"], {
      queryParams: { id: accessory.id },
    });
  }

  removeFromFavorites(listing) {
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "600px",
      data: { 
        label:"Confirmation Needed",
        message: "Are you sure you want to remove this watch from favorites ?",
        btnNames:"Yes, Remove"
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        const formData = {
          product_id: listing.id,
        };
        this.http.addWishList(formData).subscribe((res) => {
          this.applyFilters()
          window.location.reload();
        });
      }
    });
  }

  viewProductDetails(listing) {
    // http://localhost:4300/buy-product?id=393
    // this.router.navigate(["/buy-product"], {
    //   queryParams: { id: listing.id },
    // });

    const dialogRef = this.dialog.open(WatchInfoComponent, {
      width: "600px",
      data: { 
        productDetail: listing,
        label: "Watch info",
        message: "View information about your favorite watch",
        btnNames: "contactremove"
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if (result == 'contactSell') {
        const productDetails = {
          chats:{
            product:listing
          }
        }
        this.router.navigate(["/chat"], {
          state:{firstMessage: true, product_ID: listing.id, created_by: listing.created_by.id ,product_Details:productDetails},
        });
      }else if(result == 'removeFav'){
        const formData = {
          product_id: listing.id,
        };
        this.http.addWishList(formData).subscribe((res) => {
          this.applyFilters()
          window.location.reload();
        });
      }else if(result == 'goToListing'){
        this.router.navigate(['/product-list'])
      }
    });
  }
}
