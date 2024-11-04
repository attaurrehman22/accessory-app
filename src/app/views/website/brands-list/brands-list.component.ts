import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: 'app-brands-list',
  templateUrl: './brands-list.component.html',
  styleUrls: ['./brands-list.component.css']
})
export class BrandsListComponent implements OnInit {
  showList: any[] = [];

  ngOnInit(): void {
    this.getAllModels();
  }

  getAllModels() {
    this.http.getAllPopularModels().subscribe(
      (res) => {
        this.showList = res.data.map(model => {
          return {
            ...model,
            main_image: model.main_image.replace(/\\/g, '')
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

  toggleHeart(watch): void {
    // this.watches[index].liked = !this.watches[index].liked;
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }

  routeToDetailPage(watch) {
    this.router.navigate(["/buy-product"], {
      state: { data: watch },
    });
  }

  goToList(){
    this.router.navigate(['/product-list'])
  }
}

