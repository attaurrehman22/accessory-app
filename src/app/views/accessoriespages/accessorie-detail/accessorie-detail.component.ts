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

  lugWidth = [
    "Apple 38/40/41MM",
    "Apple 42/44/45MM",
    "Apple 42/44/45MM",
    "Apple 49MM",
    "16MM",
    "18MM",
    "20MM",
    "22MM",
    "24MM",
    "26MM",
  ]

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
      const res = await this.http.getProductsByID(this.ProductID).toPromise();
      this.isDealer = res.typeOfProduct;
      this.productDetails = res.data;
      this.isReviewsCount = res.reviewsCount;
      if (this.productDetails.additional_images) {
        this.productDetails.additional_images = JSON.parse(
          this.productDetails.additional_images
        );
      }

      if (this.productDetails.main_image) {
        this.productDetails.main_image = this.productDetails.main_image.replace(
          /\\/g,
          ""
        );
      }

      if (this.productDetails.created_by.id == localStorage.getItem("userID")) {
        this.loggedUserType = "seller";
      } else {
        this.loggedUserType = "buyer";
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  }

  async initializeComponent() {
    try {
        await this.fetchProductDetails();
      this.productMainImage = this.productDetails.main_image;
      this.thumbnails = this.productDetails.additional_images.map((image) => ({
        url: image.replace(/\\/g, ""),
        type: "image",
      }));

      if (this.productDetails?.proof_image_1) {
        this.productDetails.proof_image_1 =
          this.productDetails.proof_image_1.replace(/\\/g, "");
        this.thumbnails.push({
          url: this.productDetails.proof_image_1,
          type: "image",
        });
      }

      if (this.productDetails?.proof_image_2) {
        this.productDetails.proof_image_2 =
          this.productDetails.proof_image_2.replace(/\\/g, "");
        this.thumbnails.push({
          url: this.productDetails.proof_image_2,
          type: "image",
        });
      }

      if (this.productDetails?.video) {
        this.productDetails.video = this.productDetails.video.replace(
          /\\/g,
          ""
        );
        this.thumbnails.push({ url: this.productDetails.video, type: "video" });
      }

      if (this.thumbnails.length > 0) {
        this.selectedImage = this.thumbnails[0].url; // Store only the URL
      }
      if (
        this.isDealer === "dealer"

      ) {
        if (this.productDetails.created_by.id && this.isReviewsCount) {
          // await this.fetchDealerDetails(this.productDetails.created_by.id);
          // await this.fetchDealerUserDetails(this.productDetails.created_by.id);
        }
      }
      // if (this.isUserLogin === "true") {
      //   this.getOrderandChatID();
      // }


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
