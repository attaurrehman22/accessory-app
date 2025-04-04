import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NgImageSliderComponent } from "ng-image-slider";
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
        breakpoint: "1460px", // large screens
        numVisible: 3,
        numScroll: 1,
      },
      {
        breakpoint: "1320px", // large screens
        numVisible: 2,
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


  @ViewChild('imageSlider', { static: false }) imageSlider: NgImageSliderComponent;

  currentIndex: number = 0;
  sliderImages: any[] = [];
  // responsiveOptions: any[] = [];

  // onSlideChange(event: any) {
  //   console.log("Arrow Click Event Data:", event);
  //   this.updateFirstVisibleImage();
  // }

  onSlideChange(event: any): void {
    // Using internal image index tracking
    const allImgElements = document.querySelectorAll('.img-div');
    allImgElements.forEach((el, index) => {
      el.classList.remove('highlight-first'); // remove all
    });

    // Wait for DOM update
    setTimeout(() => {
      const selectedImages = document.querySelectorAll('.img-div.image-popup');
      if (selectedImages.length > 0) {
        selectedImages[0+1].classList.add('highlight-first');
      }
    }, 100);
  }

  updateFirstVisibleImage() {
    if (this.imageSlider) {
      // ✅ Get first visible image index (assuming the first one in list is visible)
      this.currentIndex = (this.currentIndex + 1) % this.sliderImages.length;
      console.log("First visible image:", this.sliderImages[this.currentIndex]);
    }
  }
  
  getAllFeaturedProducts() {
    this.http.getFeaturedList().subscribe(
      (res) => {
        this.sliderImages = res.data
          .filter((product: any) => product?.promotion_banner) // Filter products with promotion_banner
          .map((product: any) => ({
            image: 'https://api.chronosouq.com/' + product.promotion_banner.replace(/\\/g, ''),
            thumbImage: 'https://api.chronosouq.com/' + product.promotion_banner.replace(/\\/g, ''),
            title: product.promotion_type,
            alt: product.name
          }));
      },
      (err) => {
        console.error("Error fetching featured products:", err);
      }
    );
  }

  ngAfterViewInit(): void {
    const allImgElements = document.querySelectorAll('.img-div');
    allImgElements.forEach((el, index) => {
      el.classList.remove('highlight-first'); // remove all
    });

    // Wait for DOM update
    setTimeout(() => {
      const selectedImages = document.querySelectorAll('.img-div.image-popup');
      if (selectedImages.length > 0) {
        selectedImages[0+1].classList.add('highlight-first');
      }
    }, 100); 
  }
  
  


  onCarouselMove(event: any) {
    this.firstVisibleIndex = event.page;
  
    // Ensure first item is visible when looping back
    if (this.firstVisibleIndex >= this.products.length - this.responsiveOptions[0].numVisible) {
      setTimeout(() => {
        this.firstVisibleIndex = 0;
      }, 500); // Delay for a smooth transition
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
