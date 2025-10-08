import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrl: './listing.component.css'
})
export class ListingComponent implements OnInit{
  apiUrl = environment.apipath + "/";
  listings: any[] = [];
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  isLoading: boolean = true;

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

  ngOnInit(): void {
    this.fetchListings();
  }

  fetchListings(): void {
    this.isLoading = true;
    this.http.getMyProductsListing().subscribe((res) => {
      this.listings = res.data.map((detail: any) => {
        if (detail.main_image) {
          detail.main_image = detail.main_image.replace(/\\/g, "");
        }
        return detail;
      });
      console.log("listings",this.listings)
      this.isLoading = false;
    }, (err) => {
      this.isLoading = false;
    });
  }

  deleteListing(listing) {
    this.http.removeProduct(listing.id).subscribe(
      (res) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Product Delete Successfully");
        } else {
          this.alertService.showAlert("success", "تم حذف المنتج بنجاح");
        }

        this.fetchListings();
      },
      (err) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error in Deleting Product");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء حذف المنتج");
        }
      }
    );
  }

  editListing(listing) {
    this.router.navigate(["/new-product"], {
      state: { productID: listing.id },
    });
  }

}
