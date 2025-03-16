import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from "src/services/lang-service/language.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-new-arrivals',
  templateUrl: './new-arrivals.component.html',
  styleUrls: ['./new-arrivals.component.css']
})
export class NewArrivalsComponent {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  showList: any;
  isUserLogin: any;
  constructor(private http: HttpService, private router: Router,
     public translateService: TranslateService,  private languageService:LanguageService,
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages?.includes(browserLang)) {
      this.translateService.use(browserLang);
    }

    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages?.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages?.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang);
      }
    }
  }

  ngOnInit(): void {
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if (this.isUserLogin === "true") {
      this.getWishList();
    }
    this.getProductsofnewArrivals();
  }

  getProductsofnewArrivals() {
    let queryString = "";
    // queryString += &page=1;
    // queryString += &per_page=100;

    this.http.getProductsByCategory(queryString).subscribe((res) => {
      this.showList = res;
      // this.totalItems=this.showList?.data?.total;
      // this.fromItem=this.showList?.data?.from;
      // this.toItem=this.showList?.data?.to;

      // if(this.showList?.data?.next_page_url === null){
      //   this.isnextPage=false
      // }else{
      //   this.isnextPage=true
      // }
      this.showList = this.showList?.data?.data;
      this.showList?.data?.data?.map((product: any) => {
        if (product.main_image) {
          product.main_image = product.main_image
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        }

        if (product.folder) {
          product.folder = product.folder
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        }

        if (product.additional_images) {
          try {
            product.additional_images = JSON.parse(
              product.additional_images
            ).map((img: string) => img.replace(/\\/g, "/").replace(/^\/+/, ""));
          } catch (error) {
            console.error("Error parsing additional_images:", error);
          }
        }
        return product;
      });
    });
  }

  getTimeAgo(date: string): string {
    const createdDate = new Date(date);
    const now = new Date();
    
    const seconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (days < 30) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  }

  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res?.data;
    });
  }

  addWishList(watch) {
    const formData = {
      product_id: watch.id,
    };
    this.http.addWishList(formData).subscribe((res) => {
      this.wishList = res?.data;
      this.getWishList();
      // this.getProductsofnewArrivals();
    });
  }
}
