import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/services/http/http.service";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { MatDialog } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";
import { HoverStateService } from "../../services/shared-blured-modal-service/hover-state.service";

@Component({
  selector: "app-my-listing-details",
  templateUrl: "./my-listing-details.component.html",
  styleUrls: ["./my-listing-details.component.css"],
})
export class MyListingDetailsComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  menuItems = [
    {
      label: "Personal Info",
      arabicLabel: "المعلومات الشخصية",
      route: '/myprofile',
      white_icon: "assets/images/white_profile.svg",
      black_icon: "assets/images/black_profile.svg",
    },
    {
      label: "Shipping Address",
      arabicLabel: "عنوان الشحن",
      route: '/myprofile/shipping',
      black_icon: "assets/images/black_shipping_address.svg",
      white_icon: "assets/images/white_shipping_address.svg",
    },
    {
      label: "Messages",
      arabicLabel: "الرسائل",
      route: '/myprofile/message',
      black_icon: "assets/images/black_chat.svg",
      white_icon: "assets/images/white_chat.svg",
    },
    {
      label: "My Listings",
      arabicLabel: "قوائمي",
      route: '/myprofile/listing',
      black_icon: "assets/images/black_mylisting.svg",
      white_icon: "assets/images/white_buy_sell.svg",
    },
    {
      label: "Buy Orders",
      arabicLabel: "طلبات الشراء",
      route: '/myprofile/buy/order',
      black_icon: "assets/images/black_buy_sell.svg",
      white_icon: "assets/images/white_buy_sell.svg",
    },
    {
      label: "Sell Orders",
      arabicLabel: "طلبات البيع",
      route: '/myprofile/sell/order',
      black_icon: "assets/images/black_buy_sell.svg",
      white_icon: "assets/images/white_buy_sell.svg",
    },
    {
      label: "Favorites",
      arabicLabel: "المفضلة",
      route: '/myprofile/favorite',
      black_icon: "assets/images/black_favourites.svg",
      white_icon: "assets/images/white_favourites.svg",
    },
    // {
    //   label: "Cart Items",
    //   arabicLabel: "المفضلة",
    //   black_icon: "assets/images/black_cartitems.svg",
    //   white_icon: "assets/images/white_cartitems.svg",
    // },
    // { label: "Security", arabicLabel: "الأمان", icon: "bi bi-shield-lock" },
    // { label: "Privacy", arabicLabel: "الخصوصية", icon: "bi bi-globe" },
    // { label: "My Subscriptions", arabicLabel: "اشتراكاتي", icon: "bi bi-box-arrow-in-right" },
    // { label: "Feedback", arabicLabel: "التقييمات", icon: "bi bi-star" },
    // { label: "Help Center", arabicLabel: "مركز المساعدة", icon: "bi bi-question-circle" },
  ];

  getWrapperClass(): any {
    const url = this.router.url;
    return {
      'global-main-wraper': url.includes('sell/order/details') || url.includes('buy/order/details'),
      'container': !(url.includes('sell/order/details') || url.includes('buy/order/details')),
      'blur-effect': this.isHoverModel
    };
  }
  

  listings: any[] = [];
  userID: any;
  paymentId: any;
  isHoverModel: boolean = false;
  ngOnInit(): void {
    this.userID = localStorage.getItem("userID");
    if (!this.userID) {
      this.loginFirst();
    }

    this.hoverStateService.hoverState$.subscribe(state => {
      this.isHoverModel = state;
      console.log("Hover state in MyListingDetailsComponent = ", state);
    });
  }


  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "dialog-box" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  constructor(
    private http: HttpService,
    private hoverStateService: HoverStateService,
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


}
