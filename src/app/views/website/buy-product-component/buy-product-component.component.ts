import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";

@Component({
  selector: "app-buy-product-component",
  templateUrl: "./buy-product-component.component.html",
  styleUrls: ["./buy-product-component.component.css"],
})
export class BuyProductComponentComponent implements OnInit {
  cosmeticCondition: number;
  satisfaction: number;
  experience: number = 4;
  productMainImage: any;
  currentLanguage: string;
  @ViewChild("targetContainer") targetContainer!: ElementRef;

  scrollToTarget(): void {
    this.targetContainer.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res.data;
    });
  }

  addWishList(id) {
    const formData = {
      product_id: id,
    };
    this.http.addWishList(formData).subscribe(
      (res) => {
      this.wishList = res.data;
      this.getWishList();
      this.initializeComponent();
    });
  }

  displayedWatches: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;

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
        console.log(
          "Similar watches in more watches function",
          this.similarWatchesList
        );
        this.totalPages = res.data.last_page;
      } catch (err) {
        console.error("Error loading more watches:", err);
      }
    }
  }

  reviewsListIndex: number = 2;

  loadMoreReviews() {
    this.reviewsListIndex += 2;
  }

  productsList: any;
  selectedImage: string;
  thumbnails: string[] = [];

  constructor(
    private http: HttpService,
    private alertService: AlertsServicesService,
    private router: Router,
    private dialog: MatDialog,
    public translateService: TranslateService,
    private languageService: LanguageService
  ) {}

  swapImages(clickedImage: string): void {
    this.selectedImage = clickedImage;
  }

  productDetails: any;
  dealerDetails: any;
  dealerUserDetails: any;
  ProductID: any;
  routeFrom: any;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.getWishList();
    this.routeFrom = history.state.param;
    if (this.routeFrom === "listing-to-product") {
      this.ProductID = history.state.ID;
    } else {
      this.ProductID = history.state.data.id;
    }
    this.initializeComponent();
  }

  isReviewsCount: any;

  async initializeComponent() {
    try {
      await this.fetchProductDetails();
      this.productMainImage = this.productDetails.main_image;
      this.thumbnails = this.productDetails.additional_images.map((image) =>
        image.replace(/\\/g, "")
      );
      if (this.thumbnails.length > 0) {
        this.selectedImage = this.thumbnails[0];
      }

      if (this.isDealer === "dealer") {
        if (this.productDetails.created_by.id && this.isReviewsCount) {
          await this.fetchDealerDetails(this.productDetails.created_by.id);
          await this.fetchDealerUserDetails(this.productDetails.created_by.id);
        }
      }
      await this.getAllSimilarProducts();
    } catch (err) {
      console.error("Error initializing component:", err);
    }
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
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  }

  async fetchDealerDetails(dealerId: number) {
    try {
      const res = await this.http.getDealerReviewsByID(dealerId).toPromise();
      this.dealerDetails = res.data.map((detail: any) => {
        if (detail.main_image) {
          detail.main_image = detail.main_image.replace(/\\/g, "");
        }
        return detail;
      });
    } catch (err) {
      console.error("Error fetching dealer details:", err);
    }
  }

  async fetchDealerUserDetails(userId: number) {
    try {
      const res = await this.http.getRevieweruserByID(userId).toPromise();
      this.dealerUserDetails = res.data;
      this.dealerReviewsRatings = res.data.ratings;
      this.dealerReviewstotalRatings = Object.values(
        this.dealerReviewsRatings
      ).reduce((a: number, b: number) => a + b, 0);
      this.cosmeticCondition = res.data.cosmetic_condition;
      this.satisfaction = res.data.satisfaction;
    } catch (err) {
      console.error("Error fetching dealer user details:", err);
    }
  }

  getPercentage(count: number): number {
    return this.dealerReviewstotalRatings > 0
      ? (count / this.dealerReviewstotalRatings) * 100
      : 0;
  }

  similarWatchesList: any;

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
      console.log("this main images", this.similarWatchesList);
      this.totalPages = res.data.last_page;
    } catch (err) {
      console.error("Error fetching similar products:", err);
    }
  }

  isDealer: any = "";
  dealerReviewsRatings: any;
  dealerReviewstotalRatings: any;

  getConditionPercentage(): number {
    return (this.cosmeticCondition / 5) * 100;
  }

  getSatisfactionPercentage(): number {
    return (this.satisfaction / 5) * 100;
  }

  getInitials(): string {
    if (this.dealerUserDetails?.user_details?.name) {
      return this.dealerUserDetails.user_details.name
        .substring(0, 2)
        .toUpperCase();
    }
    return "";
  }

  copyCurrentUrl() {
    const currentUrl = window.location.href; // Get the current browser URL

    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        // Optionally, you can show a success message or notification
        this.alertService.showAlert("success", "Url copy Successfully");
      })
      .catch((err) => {
        console.error("Could not copy the URL: ", err);
      });
  }

  buyNow() {
    const isUserLogin = localStorage.getItem("isLoggedIn");
    if (isUserLogin) {
      this.router.navigate(["/buy-now"]);
    } else {
      const dialogRef = this.dialog.open(ModelLoginComponent, {
        width: "600px",
        data: { message: "dialog-box" },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.router.navigate(["/buy-now"]);
        }
      });
    }
  }

  backTo() {
    this.router.navigate(["/new-product"], {
      state: { ID: this.ProductID }
    });
  }
}
