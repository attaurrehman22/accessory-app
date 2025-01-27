import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-chronosouq-buyer-protection-component",
  templateUrl: "./chronosouq-buyer-protection-component.component.html",
  styleUrls: ["./chronosouq-buyer-protection-component.component.css"],
})
export class ChronosouqBuyerProtectionComponentComponent implements OnInit {
  selectedCategory: any;
  showList: any[] = [];
  categoryNames: any[] = [];
  commentsList: any;
  allProducts: any[] = [];

  changeCategory(category: any) {
    this.selectedCategory = category;

    // If the "All Products" category is selected, show both category products and all products
    if (category.name === 'All Products') {
      this.showList = [
        ...this.allProducts.map((product: any) => {
          return {
            ...product,
            main_image: product.main_image ? product.main_image.replace(/\\/g, '') : null
          };
        })
      ];
    } else {
      // If a regular category is selected, show only its products
      this.showList = [
        ...category.products.map((product: any) => {
          return {
            ...product,
            main_image: product.main_image ? product.main_image.replace(/\\/g, '') : null
          };
        })
      ];
    }
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
    this.http.addWishList(formData).subscribe(
      (res) => {
      this.wishList = res.data;
      this.getWishList();
      this.getAllTopNewArrivals()
    });
  }
  isUserLogin:any;
  ngOnInit(): void {
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if(this.isUserLogin ==='true'){
    this.getWishList();
  }
    this.getAllTopNewArrivals();
  }

  getAllTopNewArrivals() {
    this.http.getAllTopNewArrivalCategory().subscribe(
      (res) => {
        this.categoryNames = res.data; 
        this.allProducts = res.allProducts || []; // Store all products
        // Add 'All Products' category to the category list
        this.categoryNames.push({ name: 'All Products', products: this.allProducts });
        this.selectedCategory = this.categoryNames[0]; // Default to the first category
        this.showList = this.selectedCategory.products || [];
      },
      (err) => {
        // Handle error
        console.error(err);
      }
    );
  }

  

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

  goToList() {
    this.router.navigate(["/product-list"]);
  }
}
