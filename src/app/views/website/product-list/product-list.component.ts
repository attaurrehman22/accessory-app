import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  watches = [
    {
      name: "Rolex",
      model: "GMT-Master II",
      price: 9741,
      image: "../assets/images/recommonded-1.png",
    },
    {
      name: "Rolex",
      model: "Daytona",
      price: 14650,
      image: "../assets/images/recommonded-1.png",
    },
    {
      name: "Rolex",
      model: "Submariner",
      price: 7636,
      image: "../assets/images/recommonded-1.png",
    },
    {
      name: "Rolex",
      model: "Datejust",
      price: 2314,
      image: "../assets/images/recommonded-1.png",
    },
    {
      name: "Rolex",
      model: "Day-Date",
      price: 8596,
      image: "../assets/images/recommonded-1.png",
    },
  ];

  productsList: any;
  title = "chronowatch";

  brandsDataList: any;
  category_sel_frm_popular_models: any;

  ngOnInit(): void {
    this.brandsDataList = history.state.data;
    this.category_sel_frm_popular_models = history.state.singleBrand;
    console.log(
      "this.category_sel_frm_popular_models",
      this.category_sel_frm_popular_models
    );
    this.getAllProducts();
  }

  constructor(private http: HttpService, private router: Router) {}

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
            product.main_image = product.main_image.replace(/\\/g, "/").replace(/^\/+/, "");
          }
  
          // Clean up folder
          if (product.folder) {
            // Replace backslashes with forward slashes and ensure no leading slash
            product.folder = product.folder.replace(/\\/g, "/").replace(/^\/+/, "");
          }
  
          // Clean up additional_images (assuming it's a JSON string that needs parsing)
          if (product.additional_images) {
            try {
              product.additional_images = JSON.parse(product.additional_images).map((img: string) =>
                img.replace(/\\/g, "/").replace(/^\/+/, "")
              );
            } catch (error) {
              console.error('Error parsing additional_images:', error);
            }
          }
  
          return product;
        });
  
        // Sort the productsList in descending order by the desired field, e.g., createdAt
        this.productsList.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());


        // Initialize filteredProducts if not already initialized
        if (!this.filterdProducts) {
          this.filterdProducts = this.productsList;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  
  
  
  selectedCategory: any;

  getCategory(cat: any) {
    this.selectedCategory = cat;
    console.log(cat);
    this.filterdProducts = this.productsList.filter(
      (prd) => prd.category_id === cat.category_id
    );
    console.log(this.filterdProducts);
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
