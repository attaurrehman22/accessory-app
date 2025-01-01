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
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  productsList: any;
  title = "chronowatch";
  currentPage: number = 1;
  totalItems: number = 50; // Total number of items
  itemsPerPage: number = 20;
  totalPageNumbers: number[] = [];
  itemsPerPageOptions: number[] = [20, 50, 80];
  brandsDataList: any;
  category_sel_frm_popular_models: any;

  dataFrompopularbrands: any;
  searchQuery: string = "";
  isCollapsed = false;
  isCollapsed2 = false;
  isUserLogin: any;

  checkedBrands: any[] = [];
  checkedCategories: any[] = [];



  initializePagination() {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.totalPageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
    // Call your API or data-fetching logic here to fetch items for the current page
    console.log(`Page changed to: ${page}`);
  }

  onItemsPerPageChange() {
    this.currentPage = 1; // Reset to the first page
    this.initializePagination(); // Recalculate pagination
    console.log(`Items per page changed to: ${this.itemsPerPage}`);
  }





  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleCollapse2(){
    this.isCollapsed2 = !this.isCollapsed2;
  }

  onCheckboxChange(event: Event, item: any, type: string) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (type === 'brand') {
      if (isChecked) {
        this.checkedBrands.push(item);  
      } else {
        this.checkedBrands = this.checkedBrands.filter(brand => brand.id !== item.id);  // Remove from checked list
      }
      console.log('Checked Brands:', this.checkedBrands);
    } else if (type === 'category') {
      if (isChecked) {
        this.checkedCategories.push(item);  // Add to checked list
      } else {
        this.checkedCategories = this.checkedCategories.filter(category => category.id !== item.id);  // Remove from checked list
      }
      console.log('Checked Categories:', this.checkedCategories);
    }

   

    this.buildQueryString();
  }


  buildQueryString() {
    let queryString = '';

    // Add categories to the query string
    if (this.checkedCategories.length > 0) {
      this.checkedCategories.forEach((id, index) => {
        queryString += `category_ids[]=${id.id}`;
        if (index < this.checkedCategories.length - 1) {
          queryString += '&'; // Add an "&" if it's not the last element
        }
      });
    }

    // Add brands to the query string
    if (this.checkedBrands.length > 0) {
      if (queryString) {
        queryString += '&';  // Add '&' if categories already exist
      }
      this.checkedBrands.forEach((id, index) => {
        queryString += `brand_ids[]=${id.id}`;  // Use brand_ids[] to store as an array
        if (index < this.checkedBrands.length - 1) {
          queryString += '&'; // Add '&' between values, not at the end
        }
      });
    }
    

    // Call the API with the constructed query string
    if (queryString) {
      this.getProductsByCategory(queryString);
    }
  }

  // Method to call the API with the generated query string
  getProductsByCategory(queryString: string) {
    this.http.getProductsByCategory(queryString).subscribe(
      (res)=>{
        this.productsList = res;
        this.productsList.data.map((product: any) => {
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
              ).map((img: string) =>
                img.replace(/\\/g, "/").replace(/^\/+/, "")
              );
            } catch (error) {
              console.error("Error parsing additional_images:", error);
            }
          }

          return product;
        });

        this.productsList.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    );
  }

  ngOnInit(): void {
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if (this.isUserLogin === "true") {
      this.getWishList();
    }
    this.dataFrompopularbrands = history.state.brandData;
    this.brandsDataList = history.state.data;
    if (this.dataFrompopularbrands) {
      this.getPopularBrandswithBrndsID();
    } else {
      this.getAllProducts();
    }
    this.getAllCategories();
    this.getAllBrands();
    this.initializePagination();
    this.searchService.currentSearchQuery.subscribe((query) => {
      this.searchQuery = query;
      this.searchProducts();
    });
  }

  searchProducts() {
    console.log("i am calling searchProducts() ")
    if (this.searchQuery) {
      this.http.searchedProducts(this.searchQuery).subscribe(
        (res) => {
          this.productsList = res;
          if (this.productsList) {
            this.productsList = this.productsList.products.map(
              (product: any) => {
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
                    ).map((img: string) =>
                      img.replace(/\\/g, "/").replace(/^\/+/, "")
                    );
                  } catch (error) {
                    console.error("Error parsing additional_images:", error);
                  }
                }

                return product;
              }
            );

            this.productsList.sort(
              (a: any, b: any) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            );
          }
        },
        (err) => {}
      );
    } else {
    }
  }

  brandsDropDownList: any;

  getAllBrands() {
    this.http.getBrandsDropDownFilter().subscribe(
      (res) => {
        this.brandsDataList = res.data;
        this.filterdProducts = res.data;
      },
      (err) => {}
    );
  }

  showAll: boolean = false;

  toggleSeeAll() {
    this.showAll = !this.showAll;
  }

  showAll2: boolean = false;

  toggleSeeAll2() {
    this.showAll2 = !this.showAll2;
  }

  getPopularBrandswithBrndsID() {
    this.http.getPopularproductsWithID(this.dataFrompopularbrands.id).subscribe(
      (res) => {
        this.productsList = res.data.products.map((product: any) => {
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
              ).map((img: string) =>
                img.replace(/\\/g, "/").replace(/^\/+/, "")
              );
            } catch (error) {
              console.error("Error parsing additional_images:", error);
            }
          }

          return product;
        });

        this.productsList.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      },
      (err) => {}
    );
  }

  getAllCategories() {
    this.http.getCategoryDropDown().subscribe(
      (res) => {
        this.category_sel_frm_popular_models = res.data;
      },
      (err) => {}
    );
  }

  constructor(
    private http: HttpService,
    private router: Router,
    public translateService: TranslateService,
    private searchService: SearchServiceService,
    private languageService: LanguageService
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
        this.languageService.setLanguage(browserLang); // Save browser language if valid
      }
    }
  }



 
  currentIndex1: number = 0;
  itemsPerPage1: number = 4;
  filterdProducts: any[] = [];

  getAllProducts() {
    this.http.getProducts().subscribe(
      (res) => {
        this.productsList = res.data.map((product: any) => {
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
              ).map((img: string) =>
                img.replace(/\\/g, "/").replace(/^\/+/, "")
              );
            } catch (error) {
              console.error("Error parsing additional_images:", error);
            }
          }

          return product;
        });

        this.productsList.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      },
      (err) => {}
    );
  }

  selectedCategories: any[] = [];
  slidercheck = false;
  selectedBrands: any = "";

  getCategory(brandName: string, categoryType: string) {
    let params;
    let lastArray;

    if (categoryType === "brand") {
      this.selectedBrands = brandName; 
    }
    if (
      (!lastArray || lastArray.length === 0) &&
      (!this.selectedBrands || this.selectedBrands === "")
    ) {
      if (this.dataFrompopularbrands) {
        this.getPopularBrandswithBrndsID();
        this.slidercheck = true;
        return;
      } else {
        this.getAllProducts();
        this.slidercheck = true;
        return;
      }
    }

    params = new URLSearchParams();

    if (this.selectedBrands) {
      params.append("name", this.selectedBrands); // Send brand name as a string
    }

    // this.selectedCategories.forEach((id: number) =>
    //   params.append("category_ids[]", id.toString())
    // );

    const queryString = params.toString();

    this.http.getProductsByCategory(queryString).subscribe(
      (res) => {
        this.productsList = res;
        if (this.productsList.data) {
          this.productsList = this.productsList.data;
          this.productsList.map((product: any) => {
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
                ).map((img: string) =>
                  img.replace(/\\/g, "/").replace(/^\/+/, "")
                );
              } catch (error) {
                console.error("Error parsing additional_images:", error);
              }
            }

            return product;
          });
          this.productsList.sort(
            (a: any, b: any) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
        }
      },
      (err) => {
        console.error("Error fetching products:", err);
      }
    );
  }

  routeTo(slide) {
    this.router.navigate(["/buy-product"], {
      state: { data: slide },
    });
  }


  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res.data;
    });
  }

  addWishList(watch: any, event: MouseEvent) {
    event.stopPropagation(); 
    event.preventDefault(); 
    const formData = {
      product_id: watch.id,
    };
    this.http.addWishList(formData).subscribe((res) => {
      this.wishList = res.data;
      this.getWishList();
      this.searchProducts();
    });
  }


 
  
}
