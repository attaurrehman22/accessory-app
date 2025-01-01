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

  goToProductDetailPage() {
    this.router.navigate(["/buy-product"], {
      state: { data: this.watchDetails.product },
    });
  }
}



