import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-most-popular-models-component",
  templateUrl: "./most-popular-models-component.component.html",
  styleUrls: ["./most-popular-models-component.component.css"],
})
export class MostPopularModelsComponentComponent implements OnInit {
  popularModels: any;

  ngOnInit(): void {
    this.getAllPopularModels();
  }
  getAllPopularModels() {
    this.http.getTopBrandsData().subscribe(
      (res) => {
        this.popularModels = res.top_brands;
        this.popularModels?.map((product: any) => {
          if (product.cover_image) {
            product.cover_image = product.cover_image
              .replace(/\\/g, "/")
              .replace(/^\/+/, "");
          }
          return product;
        });

      },
      (err) => {
      }
    );
  }

  constructor(
    public translateService: TranslateService,
    private http: HttpService
  ) {
    const supportedLanguages = ["en", "ar"]; // Add other languages if necessary
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
