import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-sell-order',
  templateUrl: './sell-order.component.html',
  styleUrl: './sell-order.component.css'
})
export class SellOrderComponent implements OnInit{
  apiUrl = environment.apipath + "/";
  sellOrders: any[] = [];
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(
    private http: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
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

  private intervalId: any;

  ngOnInit(): void {
    this.getSellOrders()

    this.intervalId = setInterval(() => {
      this.getSellOrders();
    }, 10000);
  }

  ngOnDestroy(): void {
    // Clear interval when component destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getSellOrders() {
    this.http.getSellOrders().subscribe((res) => {
      this.sellOrders = res.orders.map((detail: any) => {
        if (detail?.product.main_image) {
          detail.product.main_image = detail.product.main_image.replace(
            /\\/g,
            ""
          );
        }
        return detail;
      });
    });
  }

  getOrderStatus(orderID: number): Observable<any> {
    return this.http.OrderHistory(orderID);
  }

  detailListing(listing: any) {
    console.log("listing", listing);
    console.log("listing ID", listing.id);
    this.router.navigate(['/myListing/sell/order/details'], { queryParams: { id: listing.id } });
  }
  
}
