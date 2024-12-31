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




  productsDummyList1=[
    {
        "id": 91,
        "brand_id": 227,
        "created_by": 7,
        "folder": null,
        "name": "Watch Product quia",
        "title": "Autem aut qui dolores quia.",
        "description": "Distinctio quisquam eos possimus. Et eum inventore dignissimos corrupti nobis cumque aliquam. Eius asperiores ea ullam doloremque.",
        "main_image": "products\/testing\/dummy (30).png",
        "additional_images": "[\"products\/testing\/dummy (34).png\", \"products\/testing\/dummy (15).png\", \"products\/testing\/dummy (39).png\", \"products\/testing\/dummy (56).png\"]",
        "is_active": 1,
        "popular_item": "yes",
        "views_count": 538,
        "meta_title": "Qui a perspiciatis maxime soluta delectus omnis eum.",
        "meta_description": "Omnis aut perferendis earum iusto earum at. Quos nihil voluptatem hic ut dolorem.",
        "meta_keywords": "repellat aspernatur consectetur reprehenderit suscipit",
        "watch_type": "Wrist watch",
        "model": "Model-7421",
        "reference_number": "Ref-0878",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-02128",
        "condition": "Good (moderate signs of wear)",
        "sale_status": "for_sale",
        "incomplete_description": "Aut ut consequatur ipsa cupiditate. Iusto animi ullam sed quia id reprehenderit. Consequuntur quae et quasi eum similique dignissimos illo. Voluptas optio consequuntur et et magni a.",
        "gender": "Womens watch",
        "year_of_production": "1984",
        "approximate_year": 0,
        "case_diameter": "47.40",
        "case_material": "Aluminium",
        "bezel_material": "Steel",
        "thickness": "11.86",
        "crystal": "Glass",
        "water_resistance": "5 ATM",
        "movement": "Quartz",
        "caliber_movement": "ex",
        "base_caliber": "cum",
        "power_reserve": "56",
        "no_of_jewels": 5,
        "frequency": "impedit",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"corporis\", \"detail2\": \"qui\"}",
        "price": "6753.07",
        "commission_fee": "125.12",
        "revenue": "6135.83",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-20T09:04:15.000000Z",
        "deleted_at": null,
        "dial": "Green",
        "listing_code": "Listing-5488",
        "estimate_delivery": "1 to 8 days",
        "shipping_charges": "14.19",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 227,
            "name": "Haemmer",
            "slug": "haemmer",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 92,
        "brand_id": 490,
        "created_by": 10,
        "folder": null,
        "name": "Watch Product corrupti",
        "title": "Aspernatur veniam est cumque officia cum magni.",
        "description": "Ea vel molestiae quam rerum cumque fugit. Consequatur sed nisi beatae cupiditate et a ex earum. Et doloremque commodi quae doloribus et.",
        "main_image": "products\/testing\/dummy (62).png",
        "additional_images": "[\"products\/testing\/dummy (53).png\", \"products\/testing\/dummy (32).png\", \"products\/testing\/dummy (32).png\", \"products\/testing\/dummy (71).png\"]",
        "is_active": 1,
        "popular_item": "no",
        "views_count": 57,
        "meta_title": "Dolores nulla doloribus in.",
        "meta_description": "Et mollitia nihil ipsam corporis. Sapiente maxime non et quia quo. Et maiores architecto molestiae enim in asperiores dolorum.",
        "meta_keywords": "praesentium porro ipsa rerum et",
        "watch_type": "Pocket Watch",
        "model": "Model-3463",
        "reference_number": "Ref-2767",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-30327",
        "condition": "Good (moderate signs of wear)",
        "sale_status": "for_sale",
        "incomplete_description": "Minus beatae eaque provident officia dolor similique. Dolores adipisci officiis delectus aliquam eum. Officiis minima qui sit ipsa repellendus sit.",
        "gender": "Womens watch",
        "year_of_production": "1991",
        "approximate_year": 0,
        "case_diameter": "47.75",
        "case_material": "Gold",
        "bezel_material": "Gold",
        "thickness": "6.82",
        "crystal": "Sapphire Crystal",
        "water_resistance": "1 ATM",
        "movement": "Manual winding",
        "caliber_movement": "praesentium",
        "base_caliber": "et",
        "power_reserve": "87",
        "no_of_jewels": 41,
        "frequency": "non",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"dignissimos\", \"detail2\": \"at\"}",
        "price": "9745.88",
        "commission_fee": "377.73",
        "revenue": "8180.47",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-11-24T15:08:59.000000Z",
        "deleted_at": null,
        "dial": "Ivory",
        "listing_code": "Listing-2568",
        "estimate_delivery": "3 to 5 days",
        "shipping_charges": "60.72",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 490,
            "name": "Traser",
            "slug": "traser",
            "description": null,
            "cover_image": "brands\/traser\/main.jpg",
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 1,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 93,
        "brand_id": 514,
        "created_by": 10,
        "folder": null,
        "name": "Watch Product autem",
        "title": "Sit et aut molestias cum blanditiis nesciunt aut.",
        "description": "Excepturi officia possimus dolorum eaque. Iure reprehenderit qui nemo ut dolor dolore hic. Maiores qui ex corporis aut natus sint nihil. Et suscipit natus quo labore aperiam ab quos sint.",
        "main_image": "products\/testing\/dummy (15).png",
        "additional_images": "[\"products\/testing\/dummy (22).png\", \"products\/testing\/dummy (67).png\", \"products\/testing\/dummy (74).png\", \"products\/testing\/dummy (6).png\"]",
        "is_active": 1,
        "popular_item": "no",
        "views_count": 393,
        "meta_title": "Praesentium laudantium dolorem ex.",
        "meta_description": "Quia est sed aut eos amet. Qui omnis architecto reprehenderit explicabo hic. Totam harum fuga et et. Dignissimos sequi neque ad earum omnis commodi.",
        "meta_keywords": "nemo labore a id dolor",
        "watch_type": "Other watch\/clock",
        "model": "Model-9526",
        "reference_number": "Ref-1655",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-23339",
        "condition": "Incomplete",
        "sale_status": "for_sale",
        "incomplete_description": "Dolores quos cupiditate sint nobis necessitatibus ut. Qui dolor soluta itaque earum excepturi voluptatem molestiae. Eius et aliquid est dolor. Similique cum voluptas repudiandae enim ipsam sint.",
        "gender": "Unisex",
        "year_of_production": "1984",
        "approximate_year": 1,
        "case_diameter": "43.63",
        "case_material": "Carbon",
        "bezel_material": "Bronze",
        "thickness": "6.45",
        "crystal": "Sapphire Crystal",
        "water_resistance": "5 ATM",
        "movement": "Automatic",
        "caliber_movement": "rerum",
        "base_caliber": "unde",
        "power_reserve": "65",
        "no_of_jewels": 49,
        "frequency": "et",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"praesentium\", \"detail2\": \"voluptas\"}",
        "price": "6480.03",
        "commission_fee": "356.12",
        "revenue": "6389.18",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-12-16T14:25:36.000000Z",
        "deleted_at": null,
        "dial": "Rose Gold",
        "listing_code": "Listing-2079",
        "estimate_delivery": "2 to 5 days",
        "shipping_charges": "35.92",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 514,
            "name": "Vigoria Miletto",
            "slug": "vigoria-miletto",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": [
            {
                "id": 23,
                "name": "Diving Watches",
                "slug": "diving-watches",
                "description": null,
                "cover_image": null,
                "meta_title": null,
                "meta_description": null,
                "meta_keywords": null,
                "parent_id": null,
                "is_active": 1,
                "top_category": 1,
                "deleted_at": null,
                "created_at": "2024-10-22T16:43:14.000000Z",
                "updated_at": "2024-10-22T16:43:14.000000Z",
                "pivot": {
                    "product_id": 93,
                    "category_id": 23
                }
            }
        ]
    },
    {
        "id": 94,
        "brand_id": 26,
        "created_by": 7,
        "folder": null,
        "name": "Watch Product fugiat",
        "title": "Dolor est quod numquam nesciunt nihil.",
        "description": "Sunt et natus quis voluptate natus. Quis porro velit possimus est tempora laborum alias. A distinctio porro non quam explicabo facilis illo. Repudiandae accusamus sint quod provident veritatis ad. Qui temporibus qui ea qui.",
        "main_image": "products\/testing\/dummy (60).png",
        "additional_images": "[\"products\/testing\/dummy (13).png\", \"products\/testing\/dummy (36).png\", \"products\/testing\/dummy (25).png\", \"products\/testing\/dummy (33).png\"]",
        "is_active": 1,
        "popular_item": "yes",
        "views_count": 27,
        "meta_title": "Exercitationem quas commodi ut rerum voluptas excepturi molestiae.",
        "meta_description": "Voluptatem maxime voluptas aut facere. Facere est et cupiditate et eum ut. Et iusto praesentium ut distinctio voluptas voluptates aut.",
        "meta_keywords": "quaerat doloremque commodi tempore aut",
        "watch_type": "Other watch\/clock",
        "model": "Model-2958",
        "reference_number": "Ref-7525",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-96004",
        "condition": "New",
        "sale_status": "for_sale",
        "incomplete_description": "Molestias facilis sequi repellendus aut ut neque. Perferendis itaque et sint. Iure adipisci qui ut dignissimos nobis asperiores eos. Qui architecto labore et accusantium cum unde ea velit.",
        "gender": "Unisex",
        "year_of_production": "1974",
        "approximate_year": 1,
        "case_diameter": "34.59",
        "case_material": "Titanium",
        "bezel_material": "Aluminium",
        "thickness": "11.28",
        "crystal": "Glass",
        "water_resistance": "3 ATM",
        "movement": "Manual winding",
        "caliber_movement": "laborum",
        "base_caliber": "harum",
        "power_reserve": "55",
        "no_of_jewels": 1,
        "frequency": "rerum",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"ut\", \"detail2\": \"omnis\"}",
        "price": "6537.14",
        "commission_fee": "352.95",
        "revenue": "8879.06",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-19T00:14:57.000000Z",
        "deleted_at": null,
        "dial": "Ivory",
        "listing_code": "Listing-4488",
        "estimate_delivery": "3 to 6 days",
        "shipping_charges": "89.04",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 26,
            "name": "Artisanal",
            "slug": "artisanal",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 95,
        "brand_id": 456,
        "created_by": 3,
        "folder": null,
        "name": "Watch Product eos",
        "title": "Dolorem hic soluta et aliquid quae.",
        "description": "Odit nostrum aut cum rerum. Quia est suscipit quod. Dolorem non et nam. Iste illum reprehenderit eum perspiciatis minima libero aut enim.",
        "main_image": "products\/testing\/dummy (23).png",
        "additional_images": "[\"products\/testing\/dummy (47).png\", \"products\/testing\/dummy (20).png\", \"products\/testing\/dummy (52).png\", \"products\/testing\/dummy (14).png\"]",
        "is_active": 1,
        "popular_item": "yes",
        "views_count": 707,
        "meta_title": "Cumque quidem quaerat facere consequatur magnam excepturi.",
        "meta_description": "Ea suscipit corrupti dolor nostrum sit dolores. Ex corporis tenetur culpa quo. Delectus autem error libero rerum voluptas odio fugit. Iste aut eligendi commodi sunt rerum.",
        "meta_keywords": "doloremque modi et placeat voluptatem",
        "watch_type": "Other watch\/clock",
        "model": "Model-6683",
        "reference_number": "Ref-9110",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-22824",
        "condition": "New",
        "sale_status": "for_sale",
        "incomplete_description": "Neque culpa quia magnam et impedit reiciendis. Maiores nobis qui magni odio quis et ipsam. Sunt nesciunt architecto ab est vel accusamus. Quia et nemo omnis beatae natus saepe consequuntur.",
        "gender": "Unisex",
        "year_of_production": "1970",
        "approximate_year": 0,
        "case_diameter": "27.99",
        "case_material": "Titanium",
        "bezel_material": "Bronze",
        "thickness": "12.74",
        "crystal": "Glass",
        "water_resistance": "3 ATM",
        "movement": "Automatic",
        "caliber_movement": "ullam",
        "base_caliber": "aut",
        "power_reserve": "32",
        "no_of_jewels": 1,
        "frequency": "nam",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"repudiandae\", \"detail2\": \"consequatur\"}",
        "price": "5207.64",
        "commission_fee": "376.94",
        "revenue": "5989.65",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-18T23:49:38.000000Z",
        "deleted_at": null,
        "dial": "Rose Gold",
        "listing_code": "Listing-8232",
        "estimate_delivery": "4 to 7 days",
        "shipping_charges": "81.90",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 456,
            "name": "Speake-Marin",
            "slug": "speake-marin",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 96,
        "brand_id": 66,
        "created_by": 4,
        "folder": null,
        "name": "Watch Product nesciunt",
        "title": "Aut iste accusamus eaque harum molestiae tenetur.",
        "description": "Est nisi ullam adipisci nobis ratione voluptatem. Fugit exercitationem repudiandae molestias pariatur totam dolor labore. Quos commodi nihil deserunt dolorem ut voluptatem fugit reprehenderit.",
        "main_image": "products\/testing\/dummy (1).png",
        "additional_images": "[\"products\/testing\/dummy (18).png\", \"products\/testing\/dummy (3).png\", \"products\/testing\/dummy (50).png\", \"products\/testing\/dummy (38).png\"]",
        "is_active": 1,
        "popular_item": "no",
        "views_count": 824,
        "meta_title": "Molestias eos odit molestiae animi nam quis.",
        "meta_description": "Iure vitae ipsum voluptatem quia eius. Unde reiciendis reiciendis accusamus rem. Fugit neque aliquam beatae beatae accusamus ipsa.",
        "meta_keywords": "quis quia molestiae occaecati voluptatem",
        "watch_type": "Pocket Watch",
        "model": "Model-5600",
        "reference_number": "Ref-5968",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-10009",
        "condition": "Good (moderate signs of wear)",
        "sale_status": "for_sale",
        "incomplete_description": "Veritatis perferendis ipsa quia commodi. Labore eveniet sint fugit eos ut. Sapiente sunt dolores adipisci aspernatur.",
        "gender": "Unisex",
        "year_of_production": "1985",
        "approximate_year": 0,
        "case_diameter": "47.80",
        "case_material": "Ceramic",
        "bezel_material": "Steel",
        "thickness": "10.51",
        "crystal": "Sapphire Crystal",
        "water_resistance": "No water resistance",
        "movement": "Quartz",
        "caliber_movement": "illo",
        "base_caliber": "ullam",
        "power_reserve": "61",
        "no_of_jewels": 14,
        "frequency": "quia",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"eius\", \"detail2\": \"cumque\"}",
        "price": "7660.80",
        "commission_fee": "190.71",
        "revenue": "2312.22",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-19T00:14:58.000000Z",
        "deleted_at": null,
        "dial": "Gold",
        "listing_code": "Listing-4294",
        "estimate_delivery": "4 to 6 days",
        "shipping_charges": "14.58",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 66,
            "name": "Breitling",
            "slug": "breitling",
            "description": null,
            "cover_image": "brands\/breitling\/main.jpg",
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 1,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 97,
        "brand_id": 462,
        "created_by": 8,
        "folder": null,
        "name": "Watch Product accusantium",
        "title": "Similique sequi optio quia qui vel sed.",
        "description": "Qui amet et omnis dignissimos. Aliquid inventore sit iusto recusandae nulla. Explicabo reiciendis ad dolor iste et.",
        "main_image": "products\/testing\/dummy (47).png",
        "additional_images": "[\"products\/testing\/dummy (10).png\", \"products\/testing\/dummy (72).png\", \"products\/testing\/dummy (2).png\", \"products\/testing\/dummy (30).png\"]",
        "is_active": 1,
        "popular_item": "yes",
        "views_count": 612,
        "meta_title": "Modi placeat fuga qui vero enim.",
        "meta_description": "Reprehenderit dolorum occaecati perferendis eos similique inventore modi. Consequatur sit suscipit aliquam eum qui voluptatem. Et eligendi dolorum et odio et non qui. Sint itaque ipsa perferendis consequatur pariatur qui perferendis. Quia cupiditate nihil rem consectetur.",
        "meta_keywords": "qui eum consequatur nisi odit",
        "watch_type": "Pocket Watch",
        "model": "Model-4305",
        "reference_number": "Ref-2385",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-26127",
        "condition": "Good (moderate signs of wear)",
        "sale_status": "for_sale",
        "incomplete_description": "Ea laborum velit dolor ullam. Quam asperiores voluptatum explicabo doloremque ut facere. Sit asperiores maiores dolores fuga laudantium doloremque quisquam ut. Excepturi veniam perspiciatis rerum eos.",
        "gender": "Mens watch",
        "year_of_production": "1998",
        "approximate_year": 0,
        "case_diameter": "24.77",
        "case_material": "Titanium",
        "bezel_material": "Gold",
        "thickness": "7.41",
        "crystal": "Sapphire Crystal",
        "water_resistance": "5 ATM",
        "movement": "Manual winding",
        "caliber_movement": "facilis",
        "base_caliber": "distinctio",
        "power_reserve": "54",
        "no_of_jewels": 32,
        "frequency": "aut",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"nobis\", \"detail2\": \"accusantium\"}",
        "price": "5883.80",
        "commission_fee": "402.40",
        "revenue": "2673.72",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-18T23:49:37.000000Z",
        "deleted_at": null,
        "dial": "Brown",
        "listing_code": "Listing-3655",
        "estimate_delivery": "2 to 8 days",
        "shipping_charges": "96.08",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 462,
            "name": "Steinhart",
            "slug": "steinhart",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 98,
        "brand_id": 250,
        "created_by": 5,
        "folder": null,
        "name": "Watch Product voluptates",
        "title": "Ipsam accusamus inventore voluptas qui.",
        "description": "Unde labore ipsam illo explicabo corrupti voluptatem vel. Consequatur consequatur at nostrum minus facere dicta. Pariatur omnis consequatur vel sapiente incidunt voluptatem alias. Quod sit quo molestias voluptates.",
        "main_image": "products\/testing\/dummy (29).png",
        "additional_images": "[\"products\/testing\/dummy (6).png\", \"products\/testing\/dummy (45).png\", \"products\/testing\/dummy (8).png\", \"products\/testing\/dummy (67).png\"]",
        "is_active": 1,
        "popular_item": "no",
        "views_count": 527,
        "meta_title": "Qui exercitationem aliquam quos exercitationem praesentium illum.",
        "meta_description": "Necessitatibus qui eaque harum consequatur et. Magni officiis officiis voluptatibus et.",
        "meta_keywords": "assumenda et inventore similique maiores",
        "watch_type": "Wrist watch",
        "model": "Model-0841",
        "reference_number": "Ref-6553",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-04712",
        "condition": "Good (moderate signs of wear)",
        "sale_status": "for_sale",
        "incomplete_description": "Velit unde suscipit sit. Voluptates repellat id dolores esse quae quia ipsa. Perferendis dolores voluptates ab voluptas sit perspiciatis et.",
        "gender": "Womens watch",
        "year_of_production": "2006",
        "approximate_year": 0,
        "case_diameter": "31.64",
        "case_material": "Bronze",
        "bezel_material": "Steel",
        "thickness": "12.68",
        "crystal": "Glass",
        "water_resistance": "1 ATM",
        "movement": "Automatic",
        "caliber_movement": "tenetur",
        "base_caliber": "aspernatur",
        "power_reserve": "63",
        "no_of_jewels": 4,
        "frequency": "rerum",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"excepturi\", \"detail2\": \"rerum\"}",
        "price": "8269.84",
        "commission_fee": "61.98",
        "revenue": "3341.49",
        "feature_item": 1,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-22T11:14:29.000000Z",
        "deleted_at": null,
        "dial": "Champagne",
        "listing_code": "Listing-9911",
        "estimate_delivery": "1 to 5 days",
        "shipping_charges": "53.11",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 250,
            "name": "Iron Annie",
            "slug": "iron-annie",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 101,
        "brand_id": 292,
        "created_by": 4,
        "folder": null,
        "name": "Watch Product error",
        "title": "Eaque animi enim culpa culpa voluptatibus quae sequi.",
        "description": "Ratione cumque deserunt quis. Autem vero ut quia animi aut doloribus dolorum qui.",
        "main_image": "products\/testing\/dummy (31).png",
        "additional_images": "[\"products\/testing\/dummy (50).png\", \"products\/testing\/dummy (22).png\", \"products\/testing\/dummy (49).png\", \"products\/testing\/dummy (49).png\"]",
        "is_active": 1,
        "popular_item": "no",
        "views_count": 607,
        "meta_title": "Sunt inventore in expedita eaque.",
        "meta_description": "Id numquam sed nostrum omnis quaerat in. Animi iure qui ipsa molestias voluptatum dicta deserunt. Magnam cupiditate delectus occaecati perferendis cum eos.",
        "meta_keywords": "perspiciatis omnis a odit eos",
        "watch_type": "Other watch\/clock",
        "model": "Model-8694",
        "reference_number": "Ref-2629",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-99996",
        "condition": "Incomplete",
        "sale_status": "for_sale",
        "incomplete_description": "Fugiat illum dolores corporis ullam at. Porro laboriosam esse voluptas aut delectus eaque. Ipsum odio officia adipisci sint eum nostrum.",
        "gender": "Unisex",
        "year_of_production": "1974",
        "approximate_year": 0,
        "case_diameter": "37.62",
        "case_material": "Titanium",
        "bezel_material": "Brass",
        "thickness": "13.22",
        "crystal": "Glass",
        "water_resistance": "3 ATM",
        "movement": "Quartz",
        "caliber_movement": "ducimus",
        "base_caliber": "qui",
        "power_reserve": "33",
        "no_of_jewels": 32,
        "frequency": "ipsa",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"omnis\", \"detail2\": \"iure\"}",
        "price": "7051.46",
        "commission_fee": "223.25",
        "revenue": "530.44",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-18T23:49:37.000000Z",
        "deleted_at": null,
        "dial": "Black",
        "listing_code": "Listing-7893",
        "estimate_delivery": "2 to 7 days",
        "shipping_charges": "57.54",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 292,
            "name": "Leonidas",
            "slug": "leonidas",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": [
            {
                "id": 23,
                "name": "Diving Watches",
                "slug": "diving-watches",
                "description": null,
                "cover_image": null,
                "meta_title": null,
                "meta_description": null,
                "meta_keywords": null,
                "parent_id": null,
                "is_active": 1,
                "top_category": 1,
                "deleted_at": null,
                "created_at": "2024-10-22T16:43:14.000000Z",
                "updated_at": "2024-10-22T16:43:14.000000Z",
                "pivot": {
                    "product_id": 101,
                    "category_id": 23
                }
            }
        ]
    },
    {
        "id": 102,
        "brand_id": 233,
        "created_by": 8,
        "folder": null,
        "name": "Watch Product autem",
        "title": "Id ab qui eum et.",
        "description": "Repellendus rem voluptatem consequatur perferendis quia libero. Ab nobis rerum temporibus exercitationem. Laudantium quod nesciunt voluptatem. Quae suscipit voluptas quasi quia accusamus laborum.",
        "main_image": "products\/testing\/dummy (43).png",
        "additional_images": "[\"products\/testing\/dummy (28).png\", \"products\/testing\/dummy (44).png\", \"products\/testing\/dummy (63).png\", \"products\/testing\/dummy (37).png\"]",
        "is_active": 1,
        "popular_item": "no",
        "views_count": 68,
        "meta_title": "Iure consequatur dolores labore fuga odio consequatur.",
        "meta_description": "Voluptate est ut maxime nisi eos reprehenderit reprehenderit. Expedita tempore at qui in. Dolore doloremque ipsa dolor velit qui fugiat. Et velit libero nemo quia omnis.",
        "meta_keywords": "perspiciatis mollitia facilis itaque et",
        "watch_type": "Other watch\/clock",
        "model": "Model-3928",
        "reference_number": "Ref-8699",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-22829",
        "condition": "Incomplete",
        "sale_status": "for_sale",
        "incomplete_description": "Molestiae corrupti sit nam similique rerum cupiditate minus. At et tempore cumque velit nulla dicta doloremque ea. Corrupti perspiciatis quia facere alias laboriosam.",
        "gender": "Womens watch",
        "year_of_production": "2021",
        "approximate_year": 0,
        "case_diameter": "23.31",
        "case_material": "Steel",
        "bezel_material": "Aluminium",
        "thickness": "5.15",
        "crystal": "Sapphire Crystal",
        "water_resistance": "5 ATM",
        "movement": "Quartz",
        "caliber_movement": "aut",
        "base_caliber": "quia",
        "power_reserve": "32",
        "no_of_jewels": 33,
        "frequency": "recusandae",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"ab\", \"detail2\": \"ut\"}",
        "price": "1471.67",
        "commission_fee": "316.51",
        "revenue": "6234.36",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-11-03T03:44:58.000000Z",
        "deleted_at": null,
        "dial": "Gold",
        "listing_code": "Listing-2579",
        "estimate_delivery": "4 to 7 days",
        "shipping_charges": "97.29",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 233,
            "name": "HD3",
            "slug": "hd3",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    }
  ]
  productsDummyList2=[
    {
        "id": 103,
        "brand_id": 251,
        "created_by": 5,
        "folder": null,
        "name": "Watch Product et",
        "title": "Dolores possimus dolorum ut non rem laborum molestias.",
        "description": "Deleniti labore repellendus quos quia sunt maiores iste. Ipsa sed nemo nulla minima quia tenetur voluptate minima. Incidunt excepturi ducimus dolorum cumque delectus vel. Sint quis beatae temporibus et velit est. Earum maiores numquam corrupti in dolorem nam consectetur.",
        "main_image": "products\/testing\/dummy (53).png",
        "additional_images": "[\"products\/testing\/dummy (39).png\", \"products\/testing\/dummy (4).png\", \"products\/testing\/dummy (40).png\", \"products\/testing\/dummy (28).png\"]",
        "is_active": 1,
        "popular_item": "yes",
        "views_count": 574,
        "meta_title": "Officiis atque et ratione incidunt aut.",
        "meta_description": "Aut rerum officiis ea sed quam et pariatur. Reprehenderit molestias est est consectetur. Veniam a ut excepturi quod. Tempora velit recusandae voluptate expedita facere temporibus harum accusantium. Quasi ad fuga numquam maiores.",
        "meta_keywords": "nihil explicabo modi cumque autem",
        "watch_type": "Other watch\/clock",
        "model": "Model-7662",
        "reference_number": "Ref-4173",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-08588",
        "condition": "Like new and unworn",
        "sale_status": "for_sale",
        "incomplete_description": "Quas et dolores rerum quo beatae ut autem. Voluptatibus dolorem magnam tempore qui eveniet. Error perspiciatis eius et excepturi unde qui repellendus. Velit consequatur amet nostrum tempore omnis ea.",
        "gender": "Mens watch",
        "year_of_production": "1978",
        "approximate_year": 1,
        "case_diameter": "31.94",
        "case_material": "Steel",
        "bezel_material": "Aluminium",
        "thickness": "5.85",
        "crystal": "Glass",
        "water_resistance": "10 ATM",
        "movement": "Manual winding",
        "caliber_movement": "consequatur",
        "base_caliber": "ea",
        "power_reserve": "55",
        "no_of_jewels": 34,
        "frequency": "quasi",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"ut\", \"detail2\": \"molestiae\"}",
        "price": "2883.22",
        "commission_fee": "203.31",
        "revenue": "2714.81",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-18T23:49:38.000000Z",
        "deleted_at": null,
        "dial": "Gray",
        "listing_code": "Listing-2907",
        "estimate_delivery": "1 to 8 days",
        "shipping_charges": "94.67",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 251,
            "name": "Itay Noy",
            "slug": "itay-noy",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 104,
        "brand_id": 37,
        "created_by": 9,
        "folder": null,
        "name": "Watch Product dolorum",
        "title": "Provident sit est fugit reiciendis velit.",
        "description": "Enim exercitationem reprehenderit deleniti eos qui recusandae assumenda. Molestiae unde quibusdam dolor magni sed magnam cumque. Ipsam quod et maiores a sed. Saepe similique ad velit et est a quasi.",
        "main_image": "products\/testing\/dummy (20).png",
        "additional_images": "[\"products\/testing\/dummy (59).png\", \"products\/testing\/dummy (31).png\", \"products\/testing\/dummy (42).png\", \"products\/testing\/dummy (69).png\"]",
        "is_active": 1,
        "popular_item": "yes",
        "views_count": 682,
        "meta_title": "Doloremque et earum vel culpa.",
        "meta_description": "Vero vel debitis non. Consequatur officia sit doloremque quasi. Delectus repudiandae velit maxime doloribus modi cum. Tenetur accusamus voluptatem sed consequatur reiciendis cumque cupiditate dolor.",
        "meta_keywords": "aut sed occaecati numquam aspernatur",
        "watch_type": "Wrist watch",
        "model": "Model-3643",
        "reference_number": "Ref-0389",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-63692",
        "condition": "Like new and unworn",
        "sale_status": "for_sale",
        "incomplete_description": "Non laborum cum inventore dolore impedit molestias neque. Et voluptas sunt ex dolorem magni non eos.",
        "gender": "Mens watch",
        "year_of_production": "2011",
        "approximate_year": 0,
        "case_diameter": "20.23",
        "case_material": "Steel",
        "bezel_material": "Brass",
        "thickness": "8.09",
        "crystal": "Glass",
        "water_resistance": "No water resistance",
        "movement": "Quartz",
        "caliber_movement": "at",
        "base_caliber": "aut",
        "power_reserve": "45",
        "no_of_jewels": 42,
        "frequency": "adipisci",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"repudiandae\", \"detail2\": \"magnam\"}",
        "price": "6604.65",
        "commission_fee": "116.75",
        "revenue": "920.25",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-18T23:49:37.000000Z",
        "deleted_at": null,
        "dial": "Green",
        "listing_code": "Listing-1280",
        "estimate_delivery": "3 to 7 days",
        "shipping_charges": "89.58",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 37,
            "name": "B.R.M",
            "slug": "brm",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 106,
        "brand_id": 379,
        "created_by": 2,
        "folder": null,
        "name": "Watch Product rerum",
        "title": "Nulla debitis non et non fugiat.",
        "description": "Repudiandae tempore non odio libero dignissimos illo. Quos sequi sit consequatur numquam pariatur. Autem quo praesentium nihil dolorem ad animi soluta.",
        "main_image": "products\/testing\/dummy (18).png",
        "additional_images": "[\"products\/testing\/dummy (53).png\", \"products\/testing\/dummy (23).png\", \"products\/testing\/dummy (15).png\", \"products\/testing\/dummy (18).png\"]",
        "is_active": 1,
        "popular_item": "no",
        "views_count": 889,
        "meta_title": "Delectus fugit temporibus nobis aut aspernatur architecto.",
        "meta_description": "Cumque ut facilis sit molestias animi blanditiis laudantium. Laboriosam odit quas consequuntur assumenda adipisci ducimus similique occaecati. Eaque quo dolor accusamus id voluptas voluptas. Iure ex ut sed provident nulla voluptatem quisquam modi.",
        "meta_keywords": "est suscipit atque in aut",
        "watch_type": "Wrist watch",
        "model": "Model-8077",
        "reference_number": "Ref-9751",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-89684",
        "condition": "Good (moderate signs of wear)",
        "sale_status": "for_sale",
        "incomplete_description": "Cum laboriosam et animi dignissimos. Quia dicta quia dolor porro inventore. Esse laudantium at architecto est. Exercitationem ut est aut ducimus culpa.",
        "gender": "Unisex",
        "year_of_production": "2003",
        "approximate_year": 0,
        "case_diameter": "45.34",
        "case_material": "Steel",
        "bezel_material": "Bronze",
        "thickness": "13.87",
        "crystal": "Sapphire Crystal",
        "water_resistance": "10 ATM",
        "movement": "Automatic",
        "caliber_movement": "temporibus",
        "base_caliber": "fugiat",
        "power_reserve": "88",
        "no_of_jewels": 10,
        "frequency": "libero",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"non\", \"detail2\": \"quis\"}",
        "price": "9743.83",
        "commission_fee": "52.44",
        "revenue": "4830.93",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-19T00:14:58.000000Z",
        "deleted_at": null,
        "dial": "Green",
        "listing_code": "Listing-5988",
        "estimate_delivery": "4 to 5 days",
        "shipping_charges": "76.48",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 379,
            "name": "Out of Order",
            "slug": "out-of-order",
            "description": null,
            "cover_image": null,
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 0,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": []
    },
    {
        "id": 107,
        "brand_id": 252,
        "created_by": 9,
        "folder": null,
        "name": "Watch Product dolorum",
        "title": "Aspernatur aut porro quo doloremque minima.",
        "description": "Animi sunt nesciunt ex consequuntur neque sit. Adipisci minus quia et voluptate. Ut saepe maiores in ipsam eius.",
        "main_image": "products\/testing\/dummy (49).png",
        "additional_images": "[\"products\/testing\/dummy (47).png\", \"products\/testing\/dummy (15).png\", \"products\/testing\/dummy (70).png\", \"products\/testing\/dummy (38).png\"]",
        "is_active": 1,
        "popular_item": "yes",
        "views_count": 616,
        "meta_title": "Excepturi velit dolores dicta veniam.",
        "meta_description": "Perferendis sint vel quia qui aspernatur. Molestias non vel et laudantium mollitia cupiditate ut. Repellat quas rerum rerum sit. Ut dolores asperiores odit totam sunt et eum eos.",
        "meta_keywords": "in ipsa fugiat tempora excepturi",
        "watch_type": "Pocket Watch",
        "model": "Model-7420",
        "reference_number": "Ref-0783",
        "scope_of_delivery": "Watch Only",
        "serial_no": "Serial-00278",
        "condition": "Used",
        "sale_status": "for_sale",
        "incomplete_description": "Odio sed nihil sed. Voluptatem debitis dolorem doloribus ut qui quia ab.",
        "gender": "Unisex",
        "year_of_production": "2008",
        "approximate_year": 0,
        "case_diameter": "37.57",
        "case_material": "Brass",
        "bezel_material": "Gold",
        "thickness": "8.26",
        "crystal": "Sapphire Crystal",
        "water_resistance": "1 ATM",
        "movement": "Manual winding",
        "caliber_movement": "rerum",
        "base_caliber": "est",
        "power_reserve": "74",
        "no_of_jewels": 13,
        "frequency": "voluptatem",
        "currency": "USD",
        "additional_details": "{\"detail1\": \"ut\", \"detail2\": \"temporibus\"}",
        "price": "8478.64",
        "commission_fee": "201.60",
        "revenue": "2398.61",
        "feature_item": 0,
        "created_at": "2024-10-18T10:26:30.000000Z",
        "updated_at": "2024-10-22T11:18:57.000000Z",
        "deleted_at": null,
        "dial": "Rose Gold",
        "listing_code": "Listing-3008",
        "estimate_delivery": "2 to 6 days",
        "shipping_charges": "79.56",
        "is_promoted": 0,
        "listing_step": "listingDetails",
        "bracelet_material": null,
        "bracelet_color": null,
        "type_of_clasp": null,
        "clasp_material": null,
        "dial_numerals": null,
        "case_diameter_value_1": null,
        "case_diameter_value_2": null,
        "dial_color": null,
        "is_listing_completed": 0,
        "proof_folder": null,
        "proof_image_1": null,
        "proof_image_2": null,
        "proof_time_text_1": null,
        "proof_time_text_2": null,
        "generted_time_text_1": null,
        "generted_time_text_2": null,
        "shipping_type": null,
        "allow_to_make_offer": 0,
        "estimate_payout": null,
        "billing_address": null,
        "first_name": null,
        "last_name": null,
        "street": null,
        "street_line_2": null,
        "zip_code": null,
        "city": null,
        "brand": {
            "id": 252,
            "name": "IWC",
            "slug": "iwc",
            "description": null,
            "cover_image": "brands\/iwc\/main.jpg",
            "meta_title": null,
            "meta_description": null,
            "meta_keywords": null,
            "is_active": 1,
            "top_brand": 1,
            "deleted_at": null,
            "created_at": "2024-10-22T16:43:14.000000Z",
            "updated_at": "2024-10-22T16:43:14.000000Z"
        },
        "categories": [
            {
                "id": 2,
                "name": "Affordable Watches",
                "slug": "affordable-watches",
                "description": null,
                "cover_image": null,
                "meta_title": null,
                "meta_description": null,
                "meta_keywords": null,
                "parent_id": null,
                "is_active": 1,
                "top_category": 1,
                "deleted_at": null,
                "created_at": "2024-10-22T16:43:14.000000Z",
                "updated_at": "2024-10-22T16:43:14.000000Z",
                "pivot": {
                    "product_id": 107,
                    "category_id": 2
                }
            }
        ]
    }
  ]


 
  
}
