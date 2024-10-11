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
    liked: true
    },
    {
      brand: "Rolex",
      name: "Submariner",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-2.png",
    liked: false
    },
    {
      brand: "Rolex",
      name: "Datejust",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-3.png",
    liked: true
    },
    {
      brand: "Rolex",
      name: "Submariner",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-4.png",
    liked: false
    },
    {
      brand: "Rolex",
      name: "Datejust",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: true,
      soldOutText: "Almost Sold Out",
      image: "assets/images/interested-watches-7.png",
    liked: false
    },
    {
      brand: "Rolex",
      name: "Submariner",
      price: "SAR 125.50",
      rating: "4.1",
      isAlmostSoldOut: false,
      image: "assets/images/interested-watches-8.png",
    liked: false
    },
  ];

  changeCategory(category: string) {
    this.selectedCategory = category;
  }

  ngOnInit(): void {}

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
