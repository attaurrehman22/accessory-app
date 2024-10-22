import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";

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

  @ViewChild("targetContainer") targetContainer!: ElementRef;

  scrollToTarget(): void {
    this.targetContainer.nativeElement.scrollIntoView({ behavior: "smooth" });
  }

  toggleHearttwo(index: number): void {
    // this.similarWatchesList[index].liked = !this.similarWatchesList[index].liked;
  }

  displayedWatches: number = 6;
  currentPage: number = 1;
  totalPages: number = 1;

  loadMoreWatches() {
    console.log("hello");
    console.log("totalPages", this.totalPages);
    console.log("currentPage", this.currentPage);
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.http
        .getSimilarProductsByIDwithPage(this.ProductID, this.currentPage)
        .subscribe(
          (res) => {
            const newWatches = res.data.data.map((product: any) => {
              return {
                ...product,
                main_image: product.main_image.replace(/\\/g, ""),
              };
            });
            this.similarWatchesList = [
              ...this.similarWatchesList,
              ...newWatches,
            ];
            this.totalPages = res.data.last_page;
          },
          (err) => {
            console.error(err);
          }
        );
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
    private dialog: MatDialog
  ) {}

  swapImages(clickedImage: string): void {
    this.selectedImage = clickedImage;
  }

  productDetails: any;
  dealerDetails: any;
  dealerUserDetails: any;
  ProductID;
  any;
  ngOnInit(): void {
    this.ProductID = history.state.data.id;
    this.fetchProductDetails()
      .then(() => {
        this.productMainImage = this.productDetails.main_image;

        // Log the product main image

        // Set and clean up the thumbnails
        this.thumbnails = this.productDetails.additional_images.map((image) =>
          image.replace(/\\/g, "")
        );

        // Set the default selected image
        if (this.thumbnails.length > 0) {
          this.selectedImage = this.thumbnails[0];
        }
        if (this.isDealer === "dealer") {
          if (this.productDetails.created_by.id) {
            this.http
              .getDealerReviewsByID(this.productDetails.created_by.id)
              .subscribe(
                (res) => {
                  this.dealerDetails = res.data;

                  this.dealerDetails = this.dealerDetails.map((detail: any) => {
                    if (detail.main_image) {
                      detail.main_image = detail.main_image.replace(/\\/g, "");
                    }
                    return detail;
                  });
                },
                (err) => {}
              );
          }

          if (this.productDetails.created_by.id) {
            this.http
              .getRevieweruserByID(this.productDetails.created_by.id)
              .subscribe(
                (res) => {
                  this.dealerUserDetails = res.data;
                  this.dealerReviewsRatings = res.data.ratings;
                  this.dealerReviewstotalRatings = Object.values(
                    this.dealerReviewsRatings
                  ).reduce((a: number, b: number) => a + b, 0);
                  this.cosmeticCondition = res.data.cosmetic_condition;
                  this.satisfaction = res.data.satisfaction;
                },
                (err) => {}
              );
          }
        }

        this.getAllSimilarProducts();
      })
      .catch((err) => {});
  }

  getPercentage(count: number): number {
    return this.dealerReviewstotalRatings > 0
      ? (count / this.dealerReviewstotalRatings) * 100
      : 0;
  }

  similarWatchesList: any;

  getAllSimilarProducts() {
    this.http.getSimilarProductsByID(this.ProductID).subscribe(
      (res) => {
        this.similarWatchesList = res.data.data.map((product: any) => {
          return {
            ...product,
            main_image: product.main_image.replace(/\\/g, ""),
          };
        });
        this.totalPages = res.data.last_page; // Update the total pages
      },
      (err) => {
        console.error(err);
      }
    );
  }

  isDealer: any = "";
  dealerReviewsRatings: any;
  dealerReviewstotalRatings: any;

  fetchProductDetails() {
    return this.http
      .getProductsByID(this.ProductID)
      .toPromise()
      .then((res) => {
        this.isDealer = res.typeOfProduct;
        this.productDetails = res.data;

        if (this.productDetails.additional_images) {
          this.productDetails.additional_images = JSON.parse(
            this.productDetails.additional_images
          );
        }

        if (this.productDetails.main_image) {
          this.productDetails.main_image =
            this.productDetails.main_image.replace(/\\/g, "");
        }
      });
  }

  toggleHeart(image): void {
    // this.watches[index].liked = !this.watches[index].liked;
  }

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
    const isUserLogin = localStorage.getItem("Logged");
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
}
