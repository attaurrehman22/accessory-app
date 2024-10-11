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
        image: "bamboo-watch.jpg",
        inventoryStatus: "INSTOCK",
      },
      {
        name: "Product 2",
        price: 240,
        image: "blue-band.jpg",
        inventoryStatus: "LOWSTOCK",
      },
      {
        name: "Product 3",
        price: 300,
        image: "blue-t-shirt.jpg",
        inventoryStatus: "OUTOFSTOCK",
      },
      {
        name: "Product 4",
        price: 120,
        image: "bamboo-watch.jpg",
        inventoryStatus: "INSTOCK",
      },
      {
        name: "Product 5",
        price: 240,
        image: "blue-band.jpg",
        inventoryStatus: "LOWSTOCK",
      },
      {
        name: "Product 6",
        price: 300,
        image: "blue-t-shirt.jpg",
        inventoryStatus: "OUTOFSTOCK",
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

    this.firstVisibleIndex=this.products[2].index;

    this.logFirstProduct();
  }

   // Function to be called when carousel moves
   onCarouselMove(event: any) {
    console.log("event page",event.page)
    this.firstVisibleIndex = event.page; // Index of the first visible product
    // Validate that the index is within bounds
    if (this.firstVisibleIndex >= 0 && this.firstVisibleIndex < this.products.length) {
      this.logFirstProduct();
    } else {
      console.error("Invalid firstVisibleIndex:", this.firstVisibleIndex);
    }
  }

  // Log the first product's name to the console
  logFirstProduct() {
    // Validate products array before accessing
    if (this.products.length > 0) {
      const productName = this.products[this.firstVisibleIndex]?.name; // Optional chaining to avoid undefined error
      if (productName) {
        console.log("First visible product:", productName);
      } else {
        console.warn("No product found at index:", this.firstVisibleIndex);
      }
    }
  }

  logProductName(productName: string) {
    console.log(productName);
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

  images = [
    {
      src: "assets/images/interested-watches-1.png",
      alt: "Watch 1 - Mint Condition",
    },
    {
      src: "assets/images/interested-watches-2.png",
      alt: "Watch 2 - Rare Edition",
    },
    {
      src: "assets/images/interested-watches-3.png",
      alt: "Watch 3 - Classic Leather",
    },
    {
      src: "assets/images/interested-watches-4.png",
      alt: "Watch 4 - Vintage Gold",
    },
    {
      src: "assets/images/interested-watches-5.png",
      alt: "Watch 5 - Modern Design",
    },
    {
      src: "assets/images/interested-watches-6.png",
      alt: "Watch 6 - Collector’s Choice",
    },
    {
      src: "assets/images/interested-watches-7.png",
      alt: "Watch 7 - Limited Edition",
    },
    {
      src: "assets/images/interested-watches-8.png",
      alt: "Watch 8 - Luxury Silver",
    },
  ];


  // Function to get the severity for tag
  getSeverity(status: string) {
    console.log("status,",status)
    switch (status) {
      case "INSTOCK":
        return "success";
      case "LOWSTOCK":
        return "warning";
      case "OUTOFSTOCK":
        return "danger";
    }
  }
}
