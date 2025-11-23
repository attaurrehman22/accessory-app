import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-buy-order',
  templateUrl: './buy-order.component.html',
  styleUrl: './buy-order.component.css'
})
export class BuyOrderComponent implements OnInit{
  apiUrl = environment.apipath + "/";
  listingID: any;
  buyOrdersListings: any[] = [];
  isLoading: boolean = true;
  private refreshInterval: any;

  // constructor(private http:HttpService,private router:Router){}

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(
    private http: HttpService,
    private router: Router,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private fb: FormBuilder
  ) {
    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang);
      }
    }
  }

  ngOnInit(): void {
    this.getBuyOrders()

    this.refreshInterval = setInterval(() => {
      this.getBuyOrders();
    }, 10000);
  }

  ngOnDestroy(): void {
    // Clear interval when component is destroyed to avoid memory leaks
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getBuyOrders() {
    this.isLoading = true;
    this.http.getBuyOrders().subscribe((res) => {
      this.buyOrdersListings = res.orders.map((detail: any) => {
        if (detail?.product?.main_image) {
          detail.product.main_image = detail.product.main_image.replace(
            /\\/g,
            ""
          );
        }
        return detail;
      });
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

  detailsBuyListing(listing: any) {
    this.router.navigate(['/myprofile/buy/order/details'], { queryParams: { id: listing.id } });
  }

}
