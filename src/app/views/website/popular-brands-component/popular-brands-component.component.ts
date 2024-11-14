import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-popular-brands-component",
  templateUrl: "./popular-brands-component.component.html",
  styleUrls: ["./popular-brands-component.component.css"],
})
export class PopularBrandsComponentComponent implements OnInit {
  products: any[] = [];
  responsiveOptions: any[] = [];
  targetDate: Date;
  firstVisibleIndex: number;
  days: string = "00";
  hours: string = "00";
  minutes: string = "00";
  seconds: string = "00";

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

    this.responsiveOptions = [
      {
        breakpoint: "1024px", // large screens
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: "768px", // medium screens
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: "560px", // small screens
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  ngOnInit(): void {
    this.getAllFeaturedProducts();
    // if (this.hours === "00" && this.minutes === "00") {
    //   this.updateRemainingTime(
    //     this.products[0].start_date,
    //     this.products[0].end_date
    //   );
    // }
    this.logFirstProduct();
  }

  getAllFeaturedProducts() {
    this.http.getFeaturedList().subscribe(
      (res) => {
        this.products = res.data.map((product: any) => {
          product.promotion_banner = product.promotion_banner.replace(/\\/g, "");
          return product;
        });
          if (this.products.length > 0 && this.products[0].start_date && this.products[0].end_date) {
          this.updateRemainingTime(this.products[0].start_date, this.products[0].end_date);
        }
      },
      (err) => {
        console.error("Error fetching featured products:", err);
      }
    );
  }

  onCarouselMove(event: any) {
    this.firstVisibleIndex = event.page;

    if (
      this.firstVisibleIndex >= 0 &&
      this.firstVisibleIndex < this.products.length
    ) {
      const activeProduct = this.products[this.firstVisibleIndex];

      this.logFirstProduct();
      this.updateRemainingTime(
        activeProduct.start_date,
        activeProduct.end_date
      );
    } else {
      console.error("Invalid firstVisibleIndex:", this.firstVisibleIndex);
    }
  }

  updateRemainingTime(startDate: string, endDate: string) {
    const currentTime = new Date().getTime();
    const end = new Date(endDate).getTime();

    // Time difference between now and end date
    const timeRemaining = end - currentTime;

    if (timeRemaining > 0) {
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      // Update the countdown values
      this.days = this.pad(days);
      this.hours = this.pad(hours);
      this.minutes = this.pad(minutes);
      this.seconds = this.pad(seconds);
    } else {
      // If the promotion has expired
      this.days = "00";
      this.hours = "00";
      this.minutes = "00";
      this.seconds = "00";
    }
  }

  logProductName(productName: string) {
    this.router.navigate(["/buy-product"], {
      state: { data: productName },
    });
  }

  logFirstProduct() {
    if (this.products.length > 0) {
      const productName = this.products[this.firstVisibleIndex]?.name;
      if (productName) {
      } else {
      }
    }
  }

  pad(value: number) {
    return value < 10 ? "0" + value : value.toString();
  }

  goToDetailPage(product) {
    this.router.navigate(["/buy-product"], {
      state: { data: product },
    });
  }
}
