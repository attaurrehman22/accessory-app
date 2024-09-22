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

  brandsDataList: any;
  category_sel_frm_popular_models: any;

  dataFrompopularbrands: any;
  searchQuery: string = "";

  ngOnInit(): void {


    window.addEventListener('resize', () => {
      this.updateSlides();
    });

    this.dataFrompopularbrands = history.state.brandData;
    this.brandsDataList = history.state.data;
    if (this.dataFrompopularbrands) {
      this.getPopularBrandswithBrndsID();
    } else {
      this.getAllProducts();
    }
    this.getAllCategories();
    this.getAllBrands();

    this.searchService.currentSearchQuery.subscribe((query) => {
      this.searchQuery = query;
      this.searchProducts();
    });
  }

  searchProducts() {
    console.log("Search Query", this.searchQuery);
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
        (err) => {
          console.log(err);
        }
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
      (err) => {
        console.log(err);
      }
    );
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
      (err) => {
        console.log(err);
      }
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

slides:any;
  updateSlides() {
    this.slides = this.getCarouselSlides();
  }

  getCarouselSlides() {
    const screenWidth = window.innerWidth;
    let cardsPerSlide;

    // Adjust the number of cards per slide based on screen width
    if (screenWidth >= 1200) {
      cardsPerSlide = 4; // 4 cards for large screens
    } else if (screenWidth >= 992) {
      cardsPerSlide = 3; // 3 cards for medium screens
    } else if (screenWidth >= 768) {
      cardsPerSlide = 2; // 2 cards for small screens
    } else {
      cardsPerSlide = 1; // 1 card for extra small screens
    }

    const slides = [];
    for (let i = 0; i < this.filterdProducts.length; i += cardsPerSlide) {
      slides.push(this.filterdProducts.slice(i, i + cardsPerSlide));
    }
    return slides;
}


  nextSlide1() {
    if (this.currentIndex1 < this.getCarouselSlides().length - 1) {
      this.currentIndex1++;
    } else {
      this.currentIndex1 = 0; // Loop back to the first slide
    }
  }

  previousSlide1() {
    if (this.currentIndex1 > 0) {
      this.currentIndex1--;
    } else {
      this.currentIndex1 = this.getCarouselSlides().length - 1; // Loop back to the last slide
    }
  }
  goToSlide(index: number) {
    this.currentIndex1 = index;
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
      (err) => {
        console.log(err);
      }
    );
  }

  selectedCategories: any[] = [];
  slidercheck = false;
  selectedBrands: any = "";

  getCategory(brandName: string, categoryType: string) {
    console.log('Brand name:', brandName);
    console.log('Category type:', categoryType);
    // console.log("selectedCatId", selectedCatId);
    let params;
    let lastArray;
    // this.slidercheck = false;
    // if (option === "category") {
    //   if (!this.selectedCategories) {
    //     this.selectedCategories = [];
    //   }

    //   if (this.selectedCategories.includes(selectedCatId)) {
    //     this.selectedCategories = this.selectedCategories.filter(
    //       (id) => id !== selectedCatId
    //     );
    //   } else {
    //     this.selectedCategories.push(selectedCatId);
    //   }
    //   lastArray = this.selectedCategories[this.selectedCategories.length - 1];
    // }

    if (categoryType === "brand") {
      this.selectedBrands = brandName; // Store the single selected brand (assuming it's the name)
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

    console.log("Selected Brands:", this.selectedBrands);
    console.log("Selected Categories:", this.selectedCategories);

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

  expandedIndex: number | null = null;
  questions = [
    {
      question: "Why are Rolex watches so expensive?",
      answer:
        "Rolex watches are made from premium materials and crafted with precision and expertise.",
    },
    {
      question: "What is the most expensive Rolex watch of all time?",
      answer:
        "The most expensive Rolex ever sold is the Paul Newman Daytona, which fetched over $17 million.",
    },
    {
      question: "How much does a Rolex watch cost?",
      answer:
        "Prices for Rolex watches start at around $2,000 USD, but can exceed $1 million USD for rare models.",
    },
  ];

  toggleAnswer(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
