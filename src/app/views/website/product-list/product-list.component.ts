import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";
import { SearchServiceService } from "src/services/search-service/search-service.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {

  showList: any;
  isUserLogin: any;
  watchTypes:any[]=[];
  categories:any[]=[];

  ngOnInit(): void {
    this.getAllCategories()
    this.getAllBrands()
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if (this.isUserLogin === "true") {
      this.getWishList();
    }
    this.applyFilters();
    // this.getAllModels();
  }

  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res.data;
    });
  }

  addWishList(watch) {
    const formData = {
      product_id: watch.id,
    };
    this.http.addWishList(formData).subscribe((res) => {
      this.wishList = res.data;
      this.getWishList();
      this.applyFilters();
      // this.getAllModels();
    });
  }

  getAllCategories() {
    this.http.getCategoryDropDown().subscribe(
      (res) => {
        this.categories = res.data;
      },
      (err) => {}
    );
  }

  clearFilters(){
    this.categories.forEach(category => (category.selected = false));
    this.watchTypes.forEach(type => (type.selected = false));
    this.priceRange = { from: 200, to: 50000 };
    this.applyFilters();
  }


  applyFilters() {
    console.log('Selected Categories:', this.categories.filter(c => c.selected));
    console.log('Selected Watch Types:', this.watchTypes.filter(w => w.selected));
    console.log('Price Range:', this.priceRange);
    let queryString = "";
    // // Add categories to the query string
    if (this.categories.length > 0) {
      this.categories.forEach((id, index) => {
        console.log("Category ID ------ ",id)
        if(id.selected){
          queryString += `category_ids[]=${id.id}`;
          if (index < this.categories.length - 1) {
            queryString += "&"; // Add an "&" if it's not the last element
          }
        }
      });
    }
    // // Add brands to the query string
    if (this.watchTypes.length > 0) {
      if (queryString) {
        queryString += "&"; // Add '&' if categories already exist
      }
      this.watchTypes.forEach((id, index) => {
        console.log("Brand ID ------ ",id)
        if(id.selected){
          queryString += `brand_ids[]=${id.id}`; // Use brand_ids[] to store as an array
          if (index < this.watchTypes.length - 1) {
            queryString += "&"; // Add '&' between values, not at the end
          }
        }
      });
    }
    let currentPage=1;
    let itemsPerPage=100;
    queryString += `&page=${currentPage}`;
    queryString += `&per_page=${itemsPerPage}`;

    // // Call the API with the constructed query string
    if (queryString) {
      this.getProductsByCategory(queryString);
    }
  }

  getProductsByCategory(queryString: any) {
    this.http.getProductsByCategory(queryString).subscribe((res) => {
      this.showList = res;
      // this.totalItems = this.productsList.data.last_page;
      // this.currentPage = this.productsList.data.current_page;
      this.showList = this.showList.data.data;
      this.showList.data.data.map((product: any) => {
        if (product.main_image) {
          product.main_image = product.main_image
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        }

        if (product.folder) {
          product.folder = product.folder
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        }

        if (product.additional_images) {
          try {
            product.additional_images = JSON.parse(
              product.additional_images
            ).map((img: string) => img.replace(/\\/g, "/").replace(/^\/+/, ""));
          } catch (error) {
            console.error("Error parsing additional_images:", error);
          }
        }
        return product;
      });

      console.log("this.showList",this.showList)
    });
  }


  // buildQueryString() {
  //   let queryString = "";

  //   // Add categories to the query string
  //   if (this.checkedCategories.length > 0) {
  //     this.checkedCategories.forEach((id, index) => {
  //       queryString += `category_ids[]=${id.id}`;
  //       if (index < this.checkedCategories.length - 1) {
  //         queryString += "&"; // Add an "&" if it's not the last element
  //       }
  //     });
  //   }

  //   // Add brands to the query string
  //   if (this.checkedBrands.length > 0) {
  //     if (queryString) {
  //       queryString += "&"; // Add '&' if categories already exist
  //     }
  //     this.checkedBrands.forEach((id, index) => {
  //       queryString += `brand_ids[]=${id.id}`; // Use brand_ids[] to store as an array
  //       if (index < this.checkedBrands.length - 1) {
  //         queryString += "&"; // Add '&' between values, not at the end
  //       }
  //     });
  //   }

  //   queryString += `&page=${this.currentPage}`;
  //   queryString += `&per_page=${this.itemsPerPage}`;

  //   // Call the API with the constructed query string
  //   if (queryString) {
  //     this.getProductsByCategory(queryString);
  //   }
  // }

  getAllBrands() {
    this.http.getBrandsDropDownFilter().subscribe(
      (res) => {
        this.watchTypes = res.data;
      },
      (err) => {}
    );
  }

  // getAllModels() {
  //   this.http.getAllPopularModels().subscribe(
  //     (res) => {
  //       this.showList = res.data.map((model) => {
  //         return {
  //           ...model,
  //           main_image: model.main_image
  //             ? model.main_image.replace(/\\/g, "")
  //             : null,
  //         };
  //       });
  //     },
  //     (err) => {
  //       console.error(err);
  //     }
  //   );
  // }

  constructor(
    public translateService: TranslateService,
    private http: HttpService,
    private router: Router
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }

  routeToDetailPage(watch) {
    this.router.navigate(["/buy-product"], {
      state: { data: watch },
    });
  }

  priceRange = { from: 200, to: 50000 };

 

  isShowFilters:boolean=false;

  openFilters(){
   this.isShowFilters=!this.isShowFilters
  }

}
