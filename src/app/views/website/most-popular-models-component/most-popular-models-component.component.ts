import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-most-popular-models-component",
  templateUrl: "./most-popular-models-component.component.html",
  styleUrls: ["./most-popular-models-component.component.css"],
})
export class MostPopularModelsComponentComponent implements OnInit {
  popularModels: any[] = [];

  imageObject = []

  ngOnInit(): void {
    this.getAllPopularModels();
  }

  getAllPopularModels() {
    this.http.getTopBrandsData().subscribe(
      (res) => {
        if (res && res.top_brands) {
          this.popularModels = res.top_brands.map((product: any) => {
            if (product.cover_image) {
              product.cover_image =
                "https://api.chronosouq.com/" +
                product.cover_image.replace(/\\/g, "/").replace(/^\/+/, "");
            } else {
              console.warn("Product missing cover image:", product);
            }
            return product;
          });

          this.imageObject=this.getSliderImages()
        }
      },
      (err) => {
        console.error("Error loading popular models:", err);
      }
    );
  }

  getSliderImages() {
    return this.popularModels.map((product) => {
      return {
        thumbImage: product.cover_image || "default-image-url.jpg",
        image: product.cover_image || "default-image-url.jpg", // Fallback image if cover_image is missing
        
      };
    });
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

  useLang(lang: string) {
    this.translateService.use(lang);
  }
}
