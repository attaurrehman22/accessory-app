import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css'
})
export class FavoriteComponent implements OnInit{
  apiUrl = environment.apipath + "/";
  selectedFilter: string = "product";
  favoritesProductDetails: any[] = [];
  accessoriesWishList: any[] = [];
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(
    private http: HttpService,
    private router: Router,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService
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
    // this.getAccessoriesWishList();
    this.getWishList()
  }

  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res?.data;
      this.fetchProductDetails();
    });
  }
  
  async fetchProductDetails() {
    for (const productId of this.wishList) {
      try {
        const res = await this.http.getProductsByID(productId).toPromise(); // Call the API with each product ID

        const productDetail = res.data; // Store the fetched details for this product

        if (productDetail.additional_images) {
          productDetail.additional_images = JSON.parse(
            productDetail.additional_images
          );
        }

        if (productDetail.main_image) {
          productDetail.main_image = productDetail.main_image.replace(
            /\\/g,
            ""
          );
        }

        this.favoritesProductDetails.push(productDetail); // Add the product details to the array
      } catch (err) {
        console.error(
          "Error fetching product details for ID " + productId,
          err
        );
      }
    }
  }

  getAccessoriesWishList() {
    this.http.getAccessoryWishList().subscribe((res) => {
      this.accessoriesWishList = res.data.map((item: any) => {
        item.image = item.image.replace(/\\/g, "");
        return item;
      })  ;
    });
  }

  startChat(product) {
    this.router.navigate(["/chat"], {
      state: { data: product },
    });
  }

  goToAccessoryDetails(accessory) {
    this.router.navigate(["/accessories/details"], {
      queryParams: { id: accessory.id },
    });
  }
}
