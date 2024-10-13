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
  }

  ngOnInit(): void {
    this.targetDate = new Date("2024-12-31T00:00:00");
    this.startCountdown();
    this.products = [
      {
        name: "Product 1",
        price: 120,
        image: "assets/images/featured-watch-list.png",
        inventoryStatus: "INSTOCK",
        remainingTime:[
          {
            days:2,
            housrs:12,
            minutes:13,
            secods:45
          }
        ]
      },
      {
        name: "Product 2",
        price: 240,
        image: "assets/images/featured-watch-list.png",
        inventoryStatus: "LOWSTOCK",
        remainingTime:[
          {
            days:5,
            housrs:16,
            minutes:24,
            secods:45
          }
        ]
      },
      {
        name: "Product 3",
        price: 300,
        image: "assets/images/featured-watch-list.png",
        inventoryStatus: "OUTOFSTOCK",
        remainingTime:[
          {
            days:12,
            housrs:22,
            minutes:43,
            secods:45
          }
        ]
      },
      {
        name: "Product 4",
        price: 120,
        image: "assets/images/featured-watch-list.png",
        inventoryStatus: "INSTOCK",
        remainingTime:[
          {
            days:1,
            housrs:12,
            minutes:13,
            secods:45
          }
        ]
      },
      {
        name: "Product 5",
        price: 240,
        image: "assets/images/featured-watch-list.png",
        inventoryStatus: "LOWSTOCK",
        remainingTime:[
          {
            days:2,
            housrs:52,
            minutes:13,
            secods:45
          }
        ]
      },
      {
        name: "Product 6",
        price: "assets/images/featured-watch-list.png",
        inventoryStatus: "OUTOFSTOCK",
        remainingTime:[
          {
            days:12,
            housrs:22,
            minutes:33,
            secods:55
          }
        ]
      },
    ];

    this.responsiveOptions = [
      {
        breakpoint: "1024px",
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: "768px",
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: "560px",
        numVisible: 1,
        numScroll: 1,
      },
    ];
    this.logFirstProduct();
  }

  onCarouselMove(event: any) {
    this.firstVisibleIndex = event.page; 
  
    if (this.firstVisibleIndex >= 0 && this.firstVisibleIndex < this.products.length) {
      this.logFirstProduct();
        const activeProduct = this.products[this.firstVisibleIndex];
      this.updateRemainingTime(activeProduct.remainingTime[0]);
    } else {
      console.error("Invalid firstVisibleIndex:", this.firstVisibleIndex);
    }
  }
  
  updateRemainingTime(remainingTime: any) {
    this.days = this.pad(remainingTime.days);
    this.hours = this.pad(remainingTime.housrs); 
    this.minutes = this.pad(remainingTime.minutes);
    this.seconds = this.pad(remainingTime.secods); 


  }
  

  logFirstProduct() {
    if (this.products.length > 0) {
      const productName = this.products[this.firstVisibleIndex]?.name;
      if (productName) {
      } else {
        console.warn("No product found at index:", this.firstVisibleIndex);
      }
    }
  }

  logProductName(productName: string) {
  }

  startCountdown() {
    setInterval(() => {
      const currentTime = new Date().getTime();
      const timeRemaining = this.targetDate.getTime() - currentTime;

      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      this.days = this.pad(days);
      this.hours = this.pad(hours);
      this.minutes = this.pad(minutes);
      this.seconds = this.pad(seconds);
    }, 1000);
  }

  pad(value: number) {
    return value < 10 ? "0" + value : value.toString();
  }

}