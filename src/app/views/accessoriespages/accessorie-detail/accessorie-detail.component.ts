import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-accessorie-detail',
  templateUrl: './accessorie-detail.component.html',
  styleUrls: ['./accessorie-detail.component.css']
})
export class AccessorieDetailComponent implements OnInit {
   apiUrl = environment.apipath+ '/'
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  productDetails: any;
  ProductID:any;
  isDealer: any = "";
  isReviewsCount: any;
  loggedUserType: any;
  productMainImage: any;
  thumbnails: { url: string; type: string }[] = [];
  selectedImage: string;
  selectedType: string = "image";
  similarWatchesList: any;
  totalPages: number = 1;
  currentPage: number = 1;
  quantity = 1;
  apipath = environment.apipath;
  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  lugWidth = []

  Buckle_Connector = [
     "Black",
     "Silver"
  ]

  Length = [
    "Small 115/75MM (wrist 5 to 6.5 inches)",
    "Medium 125/75MM (wrist 6 to 7.5 inches)",
    "Large 145/75MM (wrist 7 to 8.5 inches)"
  ]

  color = [
    "black",
    "brown",
    "blue"
  ]

  constructor( private route: ActivatedRoute,private http: HttpService,private alertService: AlertsServicesService,
      public translateService: TranslateService,
        private languageService: LanguageService,
  ){
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

  viewProduct(watchID) {
    this.ProductID = watchID;
    window.scrollTo(0, 0);
    this.initializeComponent();
  }

  ngOnInit(): void {
    const watchId = this.route.snapshot.queryParamMap.get("id");
    if (watchId) {
      this.ProductID = watchId;
    } else {
      this.ProductID = history.state.data.id;
    }
    this.initializeComponent();
  }


  async fetchProductDetails() {
    try {
      const res = await this.http.getPublicAccessoriesByID(this.ProductID).toPromise();
      // this.isDealer = res.typeOfProduct;
      this.productDetails = res.accessory;
      this.isReviewsCount = res.accessory.views_count;
      if (this.productDetails?.additional_images) {
        this.productDetails.additional_images = JSON.parse(
          this.productDetails.additional_images
        );
      }

      if (this.productDetails?.main_image) {
        this.productDetails.main_image = this.productDetails.main_image.replace(
          /\\/g,
          ""
        );
      }

      // "images": [
      //       {
      //           "id": 5,
      //           "title_en": "Brown Leather Strap",
      //           "title_ar": "Brown Leather Strap",
      //           "image": "accessory_images\/accessory_images\/20250624113201\/1750764721_685a8cb18e92c.jpeg"
      //       },
      //       {
      //           "id": 6,
      //           "title_en": "Brown Leather Strap",
      //           "title_ar": "Brown Leather Strap",
      //           "image": "accessory_images\/accessory_images\/20250624113211\/1750764731_685a8cbb4460c.jpeg"
      //       },
      //       {
      //           "id": 7,
      //           "title_en": "Brown Leather Strap",
      //           "title_ar": "Brown Leather Strap",
      //           "image": "accessory_images\/accessory_images\/20250624113221\/1750764741_685a8cc5c21b7.jpeg"
      //       }
      //   ]
      console.log("productDetails.images",this.productDetails.images);

      if(this.productDetails?.images){
       this.productDetails.images = this.productDetails.images.map((image) => ({
        url: image.image.replace(/\\/g, ""),
        type: "image",
        title_en: image.title_en,
        title_ar: image.title_ar,
        description_en: image.description_en,
        description_ar: image.description_ar,
       }))
      }
      console.log("productDetails.images",this.productDetails.images);
      // if (this.productDetails.created_by.id == localStorage.getItem("userID")) {
      //   this.loggedUserType = "seller";
      // } else {
      //   this.loggedUserType = "buyer";
      // }
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  }

  async initializeComponent() {
    try {
        await this.fetchProductDetails();
        if(this.productDetails){
          if(this.productDetails?.main_image){
            this.productMainImage = this.productDetails.main_image;
          }
          if(this.productDetails?.additional_images){
            this.thumbnails = this.productDetails.additional_images.map((image) => ({
              url: image.replace(/\\/g, ""),
              type: "image",
            }));
          }
          // if(this.productDetails?.images){
          //   this.thumbnails = this.productDetails.images.map((image) => ({
          //     url: image.replace(/\\/g, ""),
          //     type: "image",
          //   }));
          // }

        this.lugWidth = [];
        Object.values(this.productDetails?.attributes || {}).forEach(attrObj => {
          if (attrObj && typeof attrObj === 'object') {
            this.lugWidth.push(...Object.keys(attrObj));
          }
        });
        }

      if (this.thumbnails.length > 0) {
        this.selectedImage = this.thumbnails[0].url; // Store only the URL
      }

      await this.getAllSimilarProducts();
    } catch (err) {
      console.error("Error initializing component:", err);
    }
  }

  swapImages(clickedItem: { url: string; type: string }): void {

    if (clickedItem.type === "image") {
      this.selectedImage = clickedItem.url; // Extract only the URL
      this.selectedType = "image"; // Set the selected type to 'image'
    }
    if (clickedItem.type === "video") {

      this.selectedImage = clickedItem.url; // Extract only the URL
      this.selectedType = "video"; // Set the selected type to 'video'
    }
  }

  async getAllSimilarProducts() {
    try {
      const res = await this.http
        .getSimilarProductsByID(this.ProductID)
        .toPromise();
      this.similarWatchesList = res.data.data.map((product: any) => {
        return {
          ...product,
          main_image: product.main_image
            ? product.main_image.replace(/\\/g, "")
            : null,
        };
      });

      this.totalPages = res.data.last_page;
    } catch (err) {
      console.error("Error fetching similar products:", err);
    }
  }

  async loadMoreWatches() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      try {
        const res = await this.http
          .getSimilarProductsByIDwithPage(this.ProductID, this.currentPage)
          .toPromise();
        const newWatches = res.data.data.map((product: any) => ({
          ...product,
          // main_image: product.main_image.replace(/\\/g, ""),
          main_image: product.main_image
            ? product.main_image.replace(/\\/g, "")
            : null,
        }));
        this.similarWatchesList = [...this.similarWatchesList, ...newWatches];
        this.totalPages = res.data.last_page;
      } catch (err) {
        console.error("Error loading more watches:", err);
      }
    }
  }

}
