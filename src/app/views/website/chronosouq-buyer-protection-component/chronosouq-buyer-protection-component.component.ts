import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-chronosouq-buyer-protection-component",
  templateUrl: "./chronosouq-buyer-protection-component.component.html",
  styleUrls: ["./chronosouq-buyer-protection-component.component.css"],
})
export class ChronosouqBuyerProtectionComponentComponent implements OnInit {
  selectedCategory: string = "all";
  showList: any;
  commentsList: any;

  watches = [
    {
      brand: "Rolex",
      name: "Datejust",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-1.png",
      liked: true,
    },
    {
      brand: "Rolex",
      name: "Submariner",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-2.png",
      liked: false,
    },
    {
      brand: "Rolex",
      name: "Datejust",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-3.png",
      liked: true,
    },
    {
      brand: "Rolex",
      name: "Submariner",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-4.png",
      liked: false,
    },
    {
      brand: "Rolex",
      name: "Datejust",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-7.png",
      liked: false,
    },
    {
      brand: "Rolex",
      name: "Submariner",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-8.png",
      liked: false,
    },
  ];

  casualWatches = [
    {
      brand: "Casio",
      name: "G-Shock",
      price: "SAR 85.00",
      rating: "4.5",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-1.png",
      liked: true,
    },
    {
      brand: "Timex",
      name: "Weekender",
      price: "SAR 70.00",
      rating: "4.3",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-2.png",
      liked: false,
    },
    {
      brand: "Fossil",
      name: "Machine Chronograph",
      price: "SAR 120.00",
      rating: "4.4",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-3.png",
      liked: true,
    },
    {
      brand: "Seiko",
      name: "5 Sports",
      price: "SAR 90.00",
      rating: "4.2",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-4.png",
      liked: false,
    },
    {
      brand: "Citizen",
      name: "Eco-Drive",
      price: "SAR 110.00",
      rating: "4.6",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-5.png",
      liked: true,
    },
    {
      brand: "Nixon",
      name: "Time Teller",
      price: "SAR 95.00",
      rating: "4.3",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-6.png",
      liked: false,
    },
  ];

  divingWatches = [
    {
      brand: "Seiko",
      name: "Prospex Diver",
      price: "SAR 140.00",
      rating: "4.7",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-1.png",
      liked: true,
    },
    {
      brand: "Citizen",
      name: "Promaster Diver",
      price: "SAR 150.00",
      rating: "4.8",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-2.png",
      liked: false,
    },
    {
      brand: "Omega",
      name: "Seamaster",
      price: "SAR 300.00",
      rating: "4.9",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-3.png",
      liked: true,
    },
    {
      brand: "Rolex",
      name: "Sea-Dweller",
      price: "SAR 500.00",
      rating: "5.0",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-4.png",
      liked: false,
    },
    {
      brand: "Tissot",
      name: "Seastar 1000",
      price: "SAR 130.00",
      rating: "4.6",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-5.png",
      liked: true,
    },
    {
      brand: "TAG Heuer",
      name: "Aquaracer",
      price: "SAR 250.00",
      rating: "4.8",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-6.png",
      liked: false,
    },
  ];

  sportsWatches = [
    {
      brand: "Garmin",
      name: "Forerunner 945",
      price: "SAR 220.00",
      rating: "4.7",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-1.png",
      liked: true,
    },
    {
      brand: "Suunto",
      name: "9 Baro",
      price: "SAR 180.00",
      rating: "4.6",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-2.png",
      liked: false,
    },
    {
      brand: "Polar",
      name: "Vantage V2",
      price: "SAR 200.00",
      rating: "4.8",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-3.png",
      liked: true,
    },
    {
      brand: "Fitbit",
      name: "Charge 5",
      price: "SAR 150.00",
      rating: "4.5",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-4.png",
      liked: false,
    },
    {
      brand: "Apple",
      name: "Watch Series 7",
      price: "SAR 350.00",
      rating: "4.9",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-5.png",
      liked: true,
    },
    {
      brand: "Coros",
      name: "Pace 2",
      price: "SAR 140.00",
      rating: "4.6",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-6.png",
      liked: false,
    },
  ];

  cartierWatches = [
    {
      brand: "Cartier",
      name: "Santos de Cartier",
      price: "SAR 550.00",
      rating: "4.9",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-1.png",
      liked: true,
    },
    {
      brand: "Cartier",
      name: "Ballon Bleu",
      price: "SAR 600.00",
      rating: "4.8",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-2.png",
      liked: false,
    },
    {
      brand: "Cartier",
      name: "Tank Française",
      price: "SAR 520.00",
      rating: "4.7",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-3.png",
      liked: true,
    },
    {
      brand: "Cartier",
      name: "Panthère de Cartier",
      price: "SAR 650.00",
      rating: "4.9",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-4.png",
      liked: false,
    },
    {
      brand: "Cartier",
      name: "Tank Solo",
      price: "SAR 500.00",
      rating: "4.6",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-5.png",
      liked: true,
    },
    {
      brand: "Cartier",
      name: "Ronde Solo",
      price: "SAR 540.00",
      rating: "4.8",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-6.png",
      liked: false,
    },
  ];

  changeCategory(category: string) {
    if (category === "all") {
      this.showList = this.watches;
    } else if (category === "casual") {
      this.showList = this.casualWatches;
    } else if (category === "diving") {
      this.showList = this.divingWatches;
    } else if (category === "sports") {
      this.showList = this.sportsWatches;
    } else if (category === "cartier") {
      this.showList = this.cartierWatches;
    }
    this.selectedCategory = category;
  }

  ngOnInit(): void {
    if (this.selectedCategory === "all") {
      this.showList = this.watches;
    }
  }

  constructor(
    public translateService: TranslateService,
    private http: HttpService
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  toggleHeart(index: number): void {
    this.watches[index].liked = !this.watches[index].liked;
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }
}
