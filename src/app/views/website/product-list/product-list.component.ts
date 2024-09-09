import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/services/http/http.service";
import { SearchServiceService } from "src/services/search-service/search-service.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  productsList: any;
  title = "chronowatch";

  brandsDataList: any;
  category_sel_frm_popular_models: any;

  dataFrompopularbrands: any;
  searchQuery: string = "";

  ngOnInit(): void {
    this.dataFrompopularbrands = history.state.brandData;
    this.brandsDataList = history.state.data;
    console.log("this.dataFrompopularbrands", this.dataFrompopularbrands);
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
            this.productsList = this.productsList.data.map((product: any) => {
              // Clean up main_image
              if (product.main_image) {
                // Replace backslashes with forward slashes and ensure no leading slash
                product.main_image = product.main_image
                  .replace(/\\/g, "/")
                  .replace(/^\/+/, "");
              }

              // Clean up folder
              if (product.folder) {
                // Replace backslashes with forward slashes and ensure no leading slash
                product.folder = product.folder
                  .replace(/\\/g, "/")
                  .replace(/^\/+/, "");
              }

              // Clean up additional_images (assuming it's a JSON string that needs parsing)
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
            this.filterdProducts = this.productsList;
            this.getCarouselSlides()
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
    this.http.getAllBrands().subscribe(
      (res) => {
        this.brandsDataList = res.data;
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
          // Clean up main_image
          if (product.main_image) {
            // Replace backslashes with forward slashes and ensure no leading slash
            product.main_image = product.main_image
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }

          // Clean up folder
          if (product.folder) {
            // Replace backslashes with forward slashes and ensure no leading slash
            product.folder = product.folder
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }

          // Clean up additional_images (assuming it's a JSON string that needs parsing)
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

        // Initialize filteredProducts if not already initialized
        if (!this.filterdProducts) {
          this.filterdProducts = this.productsList;
        } else if (this.slidercheck) {
          this.filterdProducts = this.productsList;
        }
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
    private searchService: SearchServiceService
  ) {}

  getCarouselSlides() {
    const slides = [];
    for (let i = 0; i < this.filterdProducts.length; i += 4) {
      slides.push(this.filterdProducts.slice(i, i + 4));
    }
    return slides;
  }

  filterdProducts: any;

  getAllProducts() {
    this.http.getProducts().subscribe(
      (res) => {
        this.productsList = res.data.map((product: any) => {
          // Clean up main_image
          if (product.main_image) {
            // Replace backslashes with forward slashes and ensure no leading slash
            product.main_image = product.main_image
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }

          // Clean up folder
          if (product.folder) {
            // Replace backslashes with forward slashes and ensure no leading slash
            product.folder = product.folder
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }

          // Clean up additional_images (assuming it's a JSON string that needs parsing)
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

        // Initialize filteredProducts if not already initialized
        if (!this.filterdProducts) {
          this.filterdProducts = this.productsList;
        } else if (this.slidercheck) {
          this.filterdProducts = this.productsList;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  selectedCategories: any[] = [];
  slidercheck = false;
  selectedBrands: any = "";
  getCategory(selectedCatId: any, option: string) {
    let params;
    let lastArray;
    this.slidercheck = false;
    if (option === "category") {
      if (!this.selectedCategories) {
        this.selectedCategories = [];
      }

      if (this.selectedCategories.includes(selectedCatId)) {
        this.selectedCategories = this.selectedCategories.filter(
          (id) => id !== selectedCatId
        );
      } else {
        this.selectedCategories.push(selectedCatId);
      }
      lastArray = this.selectedCategories[this.selectedCategories.length - 1];
    }

    if (option === "brand") {
      this.selectedBrands = selectedCatId; // Store the single selected brand (assuming it's the name)
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

    this.selectedCategories.forEach((id: number) =>
      params.append("category_ids[]", id.toString())
    );

    console.log("Selected Brands:", this.selectedBrands);
    console.log("Selected Categories:", this.selectedCategories);

    const queryString = params.toString();

    this.http.getProductsByCategory(queryString).subscribe(
      (res) => {
        this.productsList = res;
        if (this.productsList) {
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

          if (this.filterdProducts) {
            this.filterdProducts = this.productsList;
          }
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

  // List of questions and answers
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

  // Method to toggle the display of the answer
  toggleAnswer(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }
}
