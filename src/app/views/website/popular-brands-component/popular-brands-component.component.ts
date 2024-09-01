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
  constructor(
    private translateService: TranslateService,
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

  useLang(lang: string) {
    this.translateService.use(lang);
  }

  ngOnInit(): void {
    this.getAllBrands();
  }

  productDetails(brand: any) {
    this.router.navigate(["/product-detail"], {
      state: { data: brand },
    });
  }

  brandsList: any;

  getAllBrands() {
    this.http.getAllBrands().subscribe(
      (response) => {
        this.brandsList = response.data;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
