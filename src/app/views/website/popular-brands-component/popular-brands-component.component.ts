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
  days: any = "00";
  hours: any = "00";
  minutes: any = "00";
  seconds: any = "00";

  activePromotions: any[] = []; // Array to store active promotions
  countdownTimers: any[] = []; // Array for storing countdown intervals

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
        numScroll: 1,
      },
      {
        breakpoint: "768px", // medium screens
        numVisible: 2,
        numScroll: 1,
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
    this.logFirstProduct();
  }

  getAllFeaturedProducts() {
    this.http.getFeaturedList().subscribe(
      (res) => {
        this.products = res.data.map((product: any) => {
          product.promotion_banner = product.promotion_banner.replace(/\\/g, "");
          return product;
        });

        // Filter out active promotions
        this.activePromotions = this.products.filter(
          (product) => product.start_date && product.end_date && product.is_active
        );

        // Start countdowns for active promotions
        this.activePromotions.forEach((promotion, index) => {
          this.updateRemainingTime(promotion.start_date, promotion.end_date, index);
          this.startCountdown(promotion.start_date, promotion.end_date, index); // Start the countdown for each promotion
        });
      },
      (err) => {
        console.error("Error fetching featured products:", err);
      }
    );
  }

  onCarouselMove(event: any) {
    // console.log("event", event);
    this.firstVisibleIndex = event.page;
    // console.log("firstVisibleIndex", this.firstVisibleIndex);
    if (
      this.firstVisibleIndex >= 0 &&
      this.firstVisibleIndex < this.products.length
    ) {
      const activeProduct = this.products[this.firstVisibleIndex];
      // console.log("Active product", activeProduct);
      this.activePromotions.forEach((promotion, index) => {
        this.updateRemainingTime(promotion.start_date, promotion.end_date, index);
        this.startCountdown(promotion.start_date, promotion.end_date, index); // Start the countdown for each promotion
      });
      this.logFirstProduct();
    } else {
      console.error("Invalid firstVisibleIndex:", this.firstVisibleIndex);
    }
  }

  updateRemainingTime(startDate: string, endDate: string, index: number) {
    // Ensure the start and end dates are in ISO 8601 format (properly replace the space with 'T')
    const formattedStartDate = startDate.replace(" ", "T");
    const formattedEndDate = endDate.replace(" ", "T");

    // Log the formatted dates to verify they are correct
    

    // Parsing the dates to ensure they're valid
    const end = new Date(formattedEndDate).getTime();
    const currentTime = new Date().getTime();

    // Check if the end date is valid
    if (isNaN(end)) {
      console.error("Invalid end date format:", formattedEndDate);
      return;
    }

    const timeRemaining = end - currentTime;

    let days = "00";
    let hours = "00";
    let minutes = "00";
    let seconds = "00";

    // If time remaining is greater than 0, calculate the countdown
    if (timeRemaining > 0) {
      days = this.pad(Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
      hours = this.pad(Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      minutes = this.pad(Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));
      seconds = this.pad(Math.floor((timeRemaining % (1000 * 60)) / 1000));
    }

    this.days=days;
    this.hours=hours;
    this.minutes=minutes;
    this.seconds=seconds;

    // Update countdownTimers array with remaining time for the promotion
    this.countdownTimers[index] = { days, hours, minutes, seconds };
  }


  startCountdown(startDate: string, endDate: string, index: number) {
    const interval = setInterval(() => {
      this.updateRemainingTime(startDate, endDate, index);
    }, 1000); // Update every second

    // Store the interval so we can clear it later if necessary
    this.countdownTimers[index] = interval;
  }

  clearCountdown(index: number) {
    clearInterval(this.countdownTimers[index]);
  }

  // Helper function to pad the countdown time (e.g., "1" to "01")
  pad(value: number) {
    return value < 10 ? "0" + value : value.toString();
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

  goToDetailPage(product) {
    this.router.navigate(["/buy-product"], {
      state: { data: product },
    });
  }
}

