import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { NgImageSliderComponent } from "ng-image-slider";
import { environment } from "src/environments/environment";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-popular-brands-component",
  templateUrl: "./popular-brands-component.component.html",
  styleUrls: ["./popular-brands-component.component.css"],
})
export class PopularBrandsComponentComponent implements OnInit {
   apiUrl = environment.apipath+ '/'
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
  apipath= environment.apipath;

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

  @ViewChild("imageSlider", { static: false })
  imageSlider: NgImageSliderComponent;

  currentIndex: number = 0;
  sliderImages: any[] = [];

  activeDateTiemeSecforShowIndex:number=0;
  firstCalling:boolean=false;

  ngOnDestroy() {
    Object.values(this.countdownIntervals).forEach(interval => clearInterval(interval));
  }

  onSlideChange(event: any): void {

    if(event.action == 'next'){
      if(this.activeDateTiemeSecforShowIndex == 0 && !this.firstCalling){
        console.log("First Calling Enter")
           this.activeDateTiemeSecforShowIndex = 1;
           this.firstCalling = true;
            if(this.sliderImages[this.activeDateTiemeSecforShowIndex]){
            this.startCountdown(
              this.sliderImages[this.activeDateTiemeSecforShowIndex].start_date,
              this.sliderImages[this.activeDateTiemeSecforShowIndex].end_date,
              1
            );
        }
      }
      else if(this.sliderImages.length == this.activeDateTiemeSecforShowIndex){
        this.activeDateTiemeSecforShowIndex = 0;
      }else{
        this.activeDateTiemeSecforShowIndex ++;
      }

    }else{
      if(this.activeDateTiemeSecforShowIndex == 0){
        this.activeDateTiemeSecforShowIndex = this.sliderImages.length - 1;
      }else{
        this.activeDateTiemeSecforShowIndex --;
      }
    }

    console.log("Slider Images",this.sliderImages)

    this.currentIndex = event.currentSlide;

    // Remove previously highlighted class
    const allImgElements = document.querySelectorAll(".img-div");
    allImgElements.forEach((el) => {
      el.classList.remove("highlight-first");
    });

    // Wait for DOM to update before selecting again
    // setTimeout(() => {
      const selectedImages = document.querySelectorAll(".img-div.image-popup");
      // console.log("selectedImages",selectedImages)
      if (selectedImages.length > 1) {
        const highlightIndex = 1; // because you're using selectedImages[0+1]
        const elementToHighlight = selectedImages[highlightIndex];
        elementToHighlight.classList.add("highlight-first");

        console.log("activeDateTiemeSecforShowIndex",this.activeDateTiemeSecforShowIndex)

        // Start the countdown for the new product
        if(this.sliderImages[this.activeDateTiemeSecforShowIndex]){
            this.startCountdown(
              this.sliderImages[this.activeDateTiemeSecforShowIndex].start_date,
              this.sliderImages[this.activeDateTiemeSecforShowIndex].end_date,
              highlightIndex
            );
        }
        // Update current index to the active product
        this.currentIndex = highlightIndex;
      }
  }

  updateFirstVisibleImage() {
    if (this.imageSlider) {
      // ✅ Get first visible image index (assuming the first one in list is visible)
      this.currentIndex = (this.currentIndex + 1) % this.sliderImages.length;
    }
  }

  getAllFeaturedProducts() {
    this.http.getFeaturedList().subscribe(
      (res) => {
        this.sliderImages = res.data
          .filter((product: any) => product?.promotion_banner) // Filter products with promotion_banner
          .map((product: any) => ({
            image:
              this.apiUrl +
              product.promotion_banner.replace(/\\/g, ""),
            thumbImage:
              this.apiUrl +
              product.promotion_banner.replace(/\\/g, ""),
            title: product.promotion_type,
            alt: product.name,
            start_date: product.start_date,
            end_date: product.end_date,
            product_id:product.product_id
          }));

          // this.startCountdown(this.sliderImages[0].start_date,this.sliderImages[0].end_date,0)
          // this.activeDateTiemeSecforShowIndex = 0;
          this.onSlideChange({ action: 'next' });

          setTimeout(() => this.highlightFirstImage(), 300);
      },
      (err) => {
        console.error("Error fetching featured products:", err);
      }
    );
  }

  highlightFirstImage() {
    const selectedImages = document.querySelectorAll(".img-div.image-popup");
    selectedImages.forEach((el) => el.classList.remove("highlight-first"));

    if (selectedImages.length > 1) {
      const highlightIndex = 1;
      selectedImages[highlightIndex].classList.add("highlight-first");
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

    // console.log("Time Remaining",timeRemaining)
    if(timeRemaining < 0){
      this.days = "00";
      this.hours = "00";
      this.minutes = "00";
      this.seconds = "00";
      // this.clearCountdown(index);
      return;
    }
    let days = "00";
    let hours = "00";
    let minutes = "00";
    let seconds = "00";

    // If time remaining is greater than 0, calculate the countdown
    if (timeRemaining > 0) {
      days = this.pad(Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
      hours = this.pad(
        Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      );
      minutes = this.pad(
        Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
      );
      seconds = this.pad(Math.floor((timeRemaining % (1000 * 60)) / 1000));
    }

    this.days = days;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;

    // Update countdownTimers array with remaining time for the promotion
    // this.countdownTimers[index] = { days, hours, minutes, seconds };
  }

  countdownIntervals: { [key: number]: any } = {};


  startCountdown(startDate: string, endDate: string, index: number) {
  const end = new Date(endDate);
  const now = new Date();

  // Clear any existing interval for this index
  if (this.countdownIntervals[index]) {
    clearInterval(this.countdownIntervals[index]);
    delete this.countdownIntervals[index];
  }

  // If countdown already expired
  if (now >= end) {
    console.log("Expired Time -----------------------------------")
    this.days = "00";
    this.hours = "00";
    this.minutes = "00";
    this.seconds = "00";
    return;
  }

  // Start a new interval
  this.countdownIntervals[index] = setInterval(() => {
    const now = new Date();

    if (now >= end) {
      console.log("continue Time +++++++++++++++++++++++++++++++++")
      clearInterval(this.countdownIntervals[index]);
      delete this.countdownIntervals[index];
      this.days = "00";
      this.hours = "00";
      this.minutes = "00";
      this.seconds = "00";
      return;
    }

    this.updateRemainingTime(startDate, endDate, index);
  }, 1000);
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


    onImageClick(imageData: any): void {
      const clickedImage = this.sliderImages.find(img => img.index == imageData);
      if (clickedImage) {
        this.router.navigate(['/buy-product'], {
          queryParams: { id: clickedImage.product_id }
      });
    }
  }
}
