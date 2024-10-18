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

  loadMoreWatches() {
    this.displayedWatches += 6;
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
    console.log("clickedImage", clickedImage);
    this.selectedImage = clickedImage;
  }

  productDetails: any;
  dealerDetails: any;
  dealerUserDetails: any;
  ngOnInit(): void {
    this.fetchProductDetails()
      .then(() => {
        this.productMainImage = this.productDetails.main_image;

        // Log the product main image
        console.log("productMainImage", this.productMainImage);

        // Set and clean up the thumbnails
        this.thumbnails = this.productDetails.additional_images.map((image) =>
          image.replace(/\\/g, "")
        );

        // Set the default selected image
        if (this.thumbnails.length > 0) {
          this.selectedImage = this.thumbnails[0];
        }

        if (this.productDetails.created_by) {
          this.http
            .getDealerReviewsByID(this.productDetails.created_by)
            .subscribe(
              (res) => {
                this.dealerDetails = res.data;

                this.dealerDetails = this.dealerDetails.map((detail: any) => {
                  if (detail.main_image) {
                    detail.main_image = detail.main_image.replace(/\\/g, "");
                  }
                  return detail;
                });

                console.log("this.dealerDetails", this.dealerDetails);
              },
              (err) => {
                console.log(err);
              }
            );
        }

        if (this.productDetails.created_by) {
          this.http
            .getRevieweruserByID(this.productDetails.created_by)
            .subscribe(
              (res) => {
                this.dealerUserDetails = res.data;
                this.cosmeticCondition = res.data.cosmetic_condition;
                this.satisfaction = res.data.satisfaction;
              },
              (err) => {
                console.log(err);
              }
            );
        }

        this.getAllSimilarProducts();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  similarWatchesList: any;

  getAllSimilarProducts() {
    this.http.getSimilarProductsByID(5).subscribe(
      (res) => {
        this.similarWatchesList = res.data.data;
        console.log("similarWatchesList", this.similarWatchesList);
        if (this.similarWatchesList) {
          this.similarWatchesList = this.similarWatchesList.map(
            (product: any) => {
              return {
                ...product,
                main_image: product.main_image.replace(/\\/g, ""),
              };
            }
          );
        }

        console.log("similarWatchesList", this.similarWatchesList);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  fetchProductDetails() {
    return this.http
      .getProductsByID(5)
      .toPromise()
      .then((res) => {
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
        console.log("URL copied to clipboard successfully!");
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
