import { animate, style, transition, trigger } from "@angular/animations";
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
  animations: [
    trigger("detailEnter", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(14px)" }),
        animate(
          "480ms cubic-bezier(0.22, 1, 0.36, 1)",
          style({ opacity: 1, transform: "none" }),
        ),
      ]),
    ]),
  ],
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
  /** Shown until product + similar data finish loading */
  productLoading = true;

  /** True when this accessory is already in the user's cart (GET /api/accessory-cart). */
  currentProductInCart = false;
  private readonly cartAccessoryIds = new Set<string>();

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

  /** Built from main + additional for description tab gallery */
  galleryImages: { url: string }[] = [];

  /**
   * API may return the accessory object directly, or wrapped in `accessory` / `data`.
   */
  private normalizeAccessoryPayload(raw: any): any | null {
    const p = raw?.accessory ?? raw?.data ?? raw;
    if (!p || typeof p !== "object") {
      return null;
    }

    if (p.main_image != null) {
      p.main_image = String(p.main_image).replace(/\\/g, "");
    }

    if (p.additional_images != null) {
      if (Array.isArray(p.additional_images)) {
        p.additional_images = p.additional_images.map((x: any) =>
          String(x).replace(/\\/g, ""),
        );
      } else if (typeof p.additional_images === "string") {
        try {
          const parsed = JSON.parse(p.additional_images);
          p.additional_images = Array.isArray(parsed)
            ? parsed.map((x: any) => String(x).replace(/\\/g, ""))
            : [];
        } catch {
          p.additional_images = [];
        }
      } else {
        p.additional_images = [];
      }
    }

    if (p.images && Array.isArray(p.images)) {
      p.images = p.images.map((image: any) => ({
        url: String(image.image ?? image.url ?? "").replace(/\\/g, ""),
        type: "image",
        title_en: image.title_en,
        title_ar: image.title_ar,
        description_en: image.description_en,
        description_ar: image.description_ar,
        background_color: image.background_color,
      }));
    }

    return p;
  }

  private buildGalleryImages(p: any): { url: string }[] {
    const out: { url: string }[] = [];
    const seen = new Set<string>();

    const push = (rel: string | null | undefined) => {
      if (rel == null || rel === "") {
        return;
      }
      const u = String(rel).replace(/\\/g, "");
      if (!seen.has(u)) {
        seen.add(u);
        out.push({ url: u });
      }
    };

    push(p?.main_image);
    const extra = p?.additional_images;
    if (Array.isArray(extra)) {
      extra.forEach((x) => push(x));
    }

    return out;
  }

  formatMoney(v: any): string {
    if (v == null || v === "") {
      return "—";
    }
    const n = parseFloat(String(v));
    return Number.isFinite(n) ? n.toFixed(2) : "—";
  }

  /** Legacy inventories price, else min_price / max_price from flat accessory payload. */
  getDetailPriceDisplay(): string {
    const p = this.productDetails;
    if (!p) {
      return "—";
    }
    if (p.inventories?.length) {
      return this.formatMoney(p.inventories[0]?.sale_price);
    }
    const minN = parseFloat(String(p.min_price ?? "0"));
    const maxN = parseFloat(String(p.max_price ?? p.min_price ?? "0"));
    const minStr = this.formatMoney(p.min_price);
    if (
      Number.isFinite(minN) &&
      Number.isFinite(maxN) &&
      Math.abs(maxN - minN) > 0.001
    ) {
      return `${minStr} – ${this.formatMoney(p.max_price)}`;
    }
    return minStr;
  }

  async fetchProductDetails() {
    try {
      const res = await this.http
        .getPublicAccessoriesByID(this.ProductID)
        .toPromise();
      this.productDetails = this.normalizeAccessoryPayload(res);
      this.isReviewsCount = this.productDetails?.views_count;

      if (this.productDetails) {
        this.galleryImages = this.buildGalleryImages(this.productDetails);
        if (
          !this.galleryImages.length &&
          this.productDetails.images?.length
        ) {
          this.galleryImages = this.productDetails.images.map((i: any) => ({
            url: String(i.url ?? "").replace(/\\/g, ""),
          }));
        }
      } else {
        this.galleryImages = [];
      }
    } catch (err) {
      console.error("Error fetching product details:", err);
      this.productDetails = null;
      this.galleryImages = [];
    }
  }

  async initializeComponent() {
    this.productLoading = true;
    try {
      await this.fetchProductDetails();
      if (this.productDetails) {
        if (this.productDetails?.main_image) {
          this.productMainImage = this.productDetails.main_image;
        }
        if (
          this.productDetails?.additional_images?.length ||
          this.productDetails?.main_image
        ) {
          const thumbs: { url: string; type: string }[] = [];
          const seen = new Set<string>();
          const add = (rel: string) => {
            const u = String(rel).replace(/\\/g, "");
            if (u && !seen.has(u)) {
              seen.add(u);
              thumbs.push({ url: u, type: "image" });
            }
          };
          if (this.productDetails.main_image) {
            add(this.productDetails.main_image);
          }
          (this.productDetails.additional_images || []).forEach((img: string) =>
            add(img),
          );
          this.thumbnails = thumbs;
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
    } finally {
      this.productLoading = false;
    }
    this.refreshCartPresence();
  }

  /** Loads cart and hides Buy / Add to cart when this product (or similar ids) are present. */
  refreshCartPresence(): void {
    if (localStorage.getItem("user_token") && this.isUserLogin === "true") {
      this.http.getCartList().subscribe({
        next: (res: any) => {
          this.cartAccessoryIds.clear();
          for (const it of res?.items ?? []) {
            const id = it?.accessory?.id;
            if (id != null) {
              this.cartAccessoryIds.add(String(id));
            }
          }
          this.updateCurrentProductInCartFlag();
        },
        error: () => {
          this.cartAccessoryIds.clear();
          this.currentProductInCart = false;
        },
      });
    } else {
      this.cartAccessoryIds.clear();
      this.currentProductInCart = false;
    }
  }

  private updateCurrentProductInCartFlag(): void {
    const pid = this.productDetails?.id ?? this.ProductID;
    this.currentProductInCart =
      pid != null && this.cartAccessoryIds.has(String(pid));
  }

  /** For similar-products cards: hide Add to cart when that accessory is in cart. */
  isAccessoryInCart(accessoryId: any): boolean {
    if (accessoryId == null) {
      return false;
    }
    return this.cartAccessoryIds.has(String(accessoryId));
  }

  private markAccessoryInCart(accessoryId: any): void {
    if (accessoryId == null) {
      return;
    }
    this.cartAccessoryIds.add(String(accessoryId));
    this.updateCurrentProductInCartFlag();
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
      const rawList =
        res?.similar_accessories ??
        res?.data?.data ??
        res?.data ??
        (Array.isArray(res) ? res : []);
      const list = Array.isArray(rawList) ? rawList : [];
      this.similarWatchesList = list.map((product: any) => {
        const img =
          product.main_image ?? product.image ?? product.cover_image ?? null;
        return {
          ...product,
          main_image: img ? String(img).replace(/\\/g, "") : null,
        };
      });

      this.totalPages = res?.data?.last_page ?? res?.last_page ?? 1;
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
        const pageRows = res?.data?.data ?? res?.data ?? [];
        const rows = Array.isArray(pageRows) ? pageRows : [];
        const newWatches = rows.map((product: any) => {
          const img =
            product.main_image ?? product.image ?? product.cover_image ?? null;
          return {
            ...product,
            main_image: img ? String(img).replace(/\\/g, "") : null,
          };
        });
        this.similarWatchesList = [...this.similarWatchesList, ...newWatches];
        this.totalPages = res?.data?.last_page ?? res?.last_page ?? this.totalPages;
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
      const rows = res?.data;
      this.wishList = Array.isArray(rows)
        ? rows.map((item: any) => item.id)
        : [];
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
      this.router.navigate(["/myprofile/summary"]);
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
          this.markAccessoryInCart(this.productDetails?.id ?? this.ProductID);
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
          this.markAccessoryInCart(ID);
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
