import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";
@Component({
  selector: "app-stay-loop-component",
  templateUrl: "./stay-loop-component.component.html",
  styleUrls: ["./stay-loop-component.component.css"],
})
export class StayLoopComponentComponent implements OnInit {
  watchDetails: any;
  activeProductIndex: number = 0;
  ngOnInit(): void {
    this.getWatchOftheDay();
  }

  getWatchOftheDay() {
    this.http.getWatchOfTheDay().subscribe(
      (res) => {
        this.watchDetails=res.data;
        this.watchDetails.map((item:any)=>{
            if(item.banner_img){
              item.banner_img=item.banner_img.replace(/\\/g,"/").replace(/^\/+/,"");
            }
            return item;
        })
        this.watchDetails = [this.watchDetails[0]];

        this.activeProductDetails=this.watchDetails[0]
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
      queryParams: { id: product.product.id },
    });
  }

  activeProductDetails:any;

  onSlide(index: number) {
    this.activeProductIndex = index;
    this.activeProductDetails=this.watchDetails[this.activeProductIndex]
    console.log("Active Product: ", this.watchDetails[this.activeProductIndex]);
  }
}



