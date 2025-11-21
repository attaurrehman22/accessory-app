import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";
import { environment } from "src/environments/environment";
import mediumZoom from "medium-zoom";
import { NgxImageZoomModule } from "ngx-image-zoom";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-accessorie-detail",
  templateUrl: "./accessorie-detail.component.html",
  styleUrls: ["./accessorie-detail.component.css"],
})
export class AccessorieDetailComponent implements OnInit {
  apiUrl = environment.apipath + "/";
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  productDetails: any;
  ProductID: any;
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
  myThumbnail: any;
  myFullresImage: any;

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  lugWidth = [];

  Buckle_Connector = ["Black", "Silver"];

  Length = [
    "Small 115/75MM (wrist 5 to 6.5 inches)",
    "Medium 125/75MM (wrist 6 to 7.5 inches)",
    "Large 145/75MM (wrist 7 to 8.5 inches)",
  ];

  color = ["black", "brown", "blue"];

  constructor(
    private route: ActivatedRoute,
    private http: HttpService,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private router: Router,
    private dialog: MatDialog
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

  viewProduct(watchID) {
    this.ProductID = watchID;
    window.scrollTo(0, 0);
    this.initializeComponent();
  }

  isUserLogin: any;

  ngOnInit(): void {
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    console.log("isUserLogin", this.isUserLogin);
    const watchId = this.route.snapshot.queryParamMap.get("id");
    if (watchId) {
      this.ProductID = watchId;
    } else {
      this.ProductID = history.state.data.id;
    }
    this.getWishList();
    this.initializeComponent();
  }

  async fetchProductDetails() {
    try {
      const res = await this.http
        .getPublicAccessoriesByID(this.ProductID)
        .toPromise();
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

      if (this.productDetails?.images) {
        this.productDetails.images = this.productDetails.images.map(
          (image) => ({
            url: image.image.replace(/\\/g, ""),
            type: "image",
            title_en: image.title_en,
            title_ar: image.title_ar,
            description_en: image.description_en,
            description_ar: image.description_ar,
            background_color: image.background_color,
          })
        );
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
    }
  }

  async initializeComponent() {
    try {
      await this.fetchProductDetails();
      if (this.productDetails) {
        if (this.productDetails?.main_image) {
          this.productMainImage = this.productDetails.main_image;
        }
        if (this.productDetails?.additional_images) {
          this.thumbnails = this.productDetails.additional_images.map(
            (image) => ({
              url: image.replace(/\\/g, ""),
              type: "image",
            })
          );
        }
        // if(this.productDetails?.images){
        //   this.thumbnails = this.productDetails.images.map((image) => ({
        //     url: image.replace(/\\/g, ""),
        //     type: "image",
        //   }));
        // }

        this.lugWidth = [];
        Object.values(this.productDetails?.attributes || {}).forEach(
          (attrObj) => {
            if (attrObj && typeof attrObj === "object") {
              this.lugWidth.push(...Object.keys(attrObj));
            }
          }
        );
      }

      if (this.thumbnails.length > 0) {
        this.selectedImage = this.thumbnails[0].url; // Store only the URL
        this.myThumbnail = this.apiUrl + this.selectedImage;
        this.myFullresImage = this.apiUrl + this.selectedImage;
        if (this.myThumbnail === this.myFullresImage) {
          // Add a timestamp or random parameter to force a new image load
          this.myThumbnail = this.myThumbnail + "?t=" + new Date().getTime();
        }
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
      this.myThumbnail = this.apiUrl + clickedItem.url;
      this.myFullresImage = this.apiUrl + clickedItem.url;
      if (this.myThumbnail === this.myFullresImage) {
        // Add a timestamp or random parameter to force a new image load
        this.myThumbnail = this.myThumbnail + "?t=" + new Date().getTime();
      }
    }
    if (clickedItem.type === "video") {
      this.selectedImage = clickedItem.url; // Extract only the URL
      this.selectedType = "video"; // Set the selected type to 'video'
    }
  }

  async getAllSimilarProducts() {
    try {
      const res = await this.http
        .getPublicSimilarAccessoriesByID(this.ProductID)
        .toPromise();
      this.similarWatchesList = res.similar_accessories.map((product: any) => {
        return {
          ...product,
          main_image: product.image ? product.image.replace(/\\/g, "") : null,
        };
      });

      this.totalPages = res?.data?.last_page;
    } catch (err) {
      console.error("Error fetching similar products:", err);
    }
  }

  async loadMoreWatches() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      try {
        const res = await this.http
          .getPublicSimilarAccessoriesByID(this.ProductID)
          .toPromise();
        const newWatches = res.data.data.map((product: any) => ({
          ...product,
          // main_image: product.main_image.replace(/\\/g, ""),
          main_image: product.main_image
            ? product.main_image.replace(/\\/g, "")
            : null,
        }));
        this.similarWatchesList = [...this.similarWatchesList, ...newWatches];
        this.totalPages = res?.data?.last_page;
      } catch (err) {
        console.error("Error loading more watches:", err);
      }
    }
  }

  addWishList(productID: any) {
    if (this.wishList.includes(productID)) {
      this.http.removeAccessoryWishList(productID).subscribe((res: any) => {
        // this.wishList = res.data;
        this.getWishList();
      });
    } else {
      this.http.addAccessoryWishList(productID).subscribe((res: any) => {
        this.wishList = res.data;
        this.getWishList();
      });
    }
  }

  wishList: number[] = [];

  getWishList() {
    this.http.getAccessoryWishList().subscribe((res: any) => {
      this.wishList = res.data.map((item: any) => item.id); // extract only the IDs
    });
  }

  copyCurrentUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  }
  isBuy: boolean = false;
  buyandGoToOrderDetails() {
    const userLogin = localStorage.getItem("user_token");
    if (userLogin && this.isUserLogin == "true") {
      this.isBuy = true;
      this.addtoCart();
      this.router.navigate(["/myListing/summary"]);
    } else {
      this.loginFirst();
    }
  }

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      backdropClass: "hello",
      width: "600px",
      data: { message: "header" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  addtoCart() {
    const userLogin = localStorage.getItem("user_token");
    if (userLogin && this.isUserLogin == "true") {
      console.log("this.ProductID", this.ProductID);
      const formData = {
        items: [
          {
            accessory_id: this.ProductID,
            quantity: this.quantity,
          },
        ],
      };
      this.http.addtoCart(formData).subscribe(
        (res: any) => {
          if (!this.isBuy) {
            this.alertService.showAlert(
              "success",
              "Accessory added to cart successfully"
            );
          }
        },
        (err: any) => {
          this.alertService.showAlert("warning", "Something went wrong");
        }
      );
    } else {
      this.loginFirst();
    }
  }

  addtoCartById(ID) {
    const userLogin = localStorage.getItem("user_token");
    if (userLogin && this.isUserLogin == "true") {
      const formData = {
        items: [
          {
            accessory_id: ID,
            quantity: 1,
          },
        ],
      };
      this.http.addtoCart(formData).subscribe(
        (res: any) => {
          this.alertService.showAlert(
            "success",
            "Accessory added to cart successfully"
          );
        },
        (err: any) => {
          this.alertService.showAlert("warning", "Something went wrong");
        }
      );
    } else {
      this.loginFirst();
    }
  }
}
