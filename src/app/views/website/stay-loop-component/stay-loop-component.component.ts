import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import { HttpService } from "src/services/http/http.service";
@Component({
  selector: "app-stay-loop-component",
  templateUrl: "./stay-loop-component.component.html",
  styleUrls: ["./stay-loop-component.component.css"],
})
export class StayLoopComponentComponent implements OnInit {
   apiUrl = environment.apipath+ '/'
  watchDetails: any = [];
  activeProductIndex: number = 0;
  activeProductDetails: any;
  dummyRecord:boolean = false;

  ngOnInit(): void {
    this.getWatchOftheDay();

    if(this.watchDetails.length == 0){
      this.watchDetails = [
        {
          banner_img: "assets/images/dummy-watch-of-the-day.svg",
          background_color: "#1a1a1a",
          arabic_text: "هذه ساعة أنيقة مصممة خصيصًا لعشاق الأناقة. تأتي مع تصميم كلاسيكي وميزات حديثة.",
          english_text: "A stunning blend of precision and artistry with a 43mm case, 150m water resistance, and automatic movement. Its titanium world map dial features intricate textures and colors, with 24-hour and time zone indicators.",
          type: "Luxury Watch",
          product: {
            id: 101,
            name: "Omega Seamaster",
            price: 15499
          }
        }
      ];
      this.dummyRecord =true
      // Set first product as active
      this.activeProductDetails = this.watchDetails[0];
    }
  }

  getWatchOftheDay() {
    this.http.getWatchOfTheDay().subscribe(
      (res) => {
        if(res?.data){
          this.dummyRecord =false;
          this.watchDetails = res.data;
          this.watchDetails.map((item: any) => {
            if (item.banner_img) {
              item.banner_img = item.banner_img.replace(/\\/g, "/").replace(/^\/+/, "");
            }
            return item;
          });

          // Ensure at least one product exists in the watchDetails list
          if (this.watchDetails.length > 0) {
            this.activeProductDetails = this.watchDetails[0];
          }
        }
      },
      (err) => {
        console.error("Error fetching Watch of the Day:", err);
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

  goToProductDetailPage(product) {
    this.router.navigate(['/buy-product'], {
      queryParams: { id: product?.product?.id },
    });
  }

  onSlide(index: number) {
    this.activeProductIndex = index;
    this.activeProductDetails = this.watchDetails[this.activeProductIndex];
  }
}



