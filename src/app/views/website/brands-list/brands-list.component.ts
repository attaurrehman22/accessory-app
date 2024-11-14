import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-brands-list",
  templateUrl: "./brands-list.component.html",
  styleUrls: ["./brands-list.component.css"],
})
export class BrandsListComponent implements OnInit {
  showList: any[] = [];
  isUserLogin: any;
  ngOnInit(): void {
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if (this.isUserLogin === "true") {
      this.getWishList();
    }
    this.getAllModels();
  }

  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res.data;
    });
  }

  addWishList(watch) {
    const formData = {
      product_id: watch.id,
    };
    this.http.addWishList(formData).subscribe((res) => {
      this.wishList = res.data;
      this.getWishList();
      this.getAllModels();
    });
  }

  getAllModels() {
    this.http.getAllPopularModels().subscribe(
      (res) => {
        this.showList = res.data.map((model) => {
          return {
            ...model,
            main_image: model.main_image
              ? model.main_image.replace(/\\/g, "")
              : null,
          };
        });
      },
      (err) => {
        console.error(err);
      }
    );
  }

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

  useLang(lang: string) {
    this.translateService.use(lang);
  }

  routeToDetailPage(watch) {
    this.router.navigate(["/buy-product"], {
      state: { data: watch },
    });
  }

  goToList() {
    this.router.navigate(["/product-list"]);
  }
}
