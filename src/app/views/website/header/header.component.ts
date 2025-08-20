import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  computed,
} from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";
import { MatSidenav } from "@angular/material/sidenav";
import { SearchServiceService } from "src/services/search-service/search-service.service";
import { LoginStateService } from "src/services/login-service/login-state.service";
import { ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ModelLoginComponent } from "../../auth/model-login/model-login.component";
import { MatMenuTrigger } from "@angular/material/menu";
// import * as jwt_decode from 'jwt-decode';
// import { jwt_decode } from 'jwt-decode';
import { jwtDecode } from 'jwt-decode';
import { HttpService } from "src/services/http/http.service";
import { filter } from "rxjs/operators";
import { ShoppingCartComponent } from "../../modal/shopping-cart/shopping-cart.component";
import { MessageServiceService } from "src/services/search-show-hide/message-service.service";
import { environment } from "src/environments/environment";



@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  apiUrl = environment.apipath + "/";
  isSmallScreen: boolean = false;
  isUserLogin: any = false;
  searchQuery: string = "";
  dropdownOpen = false;
  showHideAdminUser: any;
  showHideUser: any;
  isNewArrivalsProduct:boolean=false;

  isAdminUser = computed(() => this.loginStateService.isAdminUser());
  isUserLoggedIn = computed(() => this.loginStateService.isUserLoggedIn());

  searchFilter: boolean = true;
  supportLanguages = [
    { name: "English", value: "en" },
    { name: "العربية", value: "ar" },
    { name: "Français", value: "fr" },
    { name: "தமிழ்", value: "ta" },
    { name: "हिन्दी", value: "hi" },
  ];
  isRtl: boolean = false;
  selectedLang: string = "en";

  @ViewChild('drawer') drawer: MatSidenav; 
  @ViewChild('header', { static: true }) headerRef: ElementRef; 
  @ViewChild('sidenav', { static: true }) sidenavRef: ElementRef;

  constructor(
    public translateService: TranslateService,
    private languageService: LanguageService,
    public router: Router,
    private searchService: SearchServiceService,
    private loginStateService: LoginStateService,
    private cdRef: ChangeDetectorRef,
     private dialog: MatDialog,private http:HttpService,
     private searchShowHide:MessageServiceService
  ) {
    const languagevalues = this.supportLanguages.map((lang) => lang.value);
    this.translateService.addLangs(languagevalues);
    this.translateService.setDefaultLang("en");
    const browserlang = this.translateService.getBrowserLang();

    if (languagevalues.includes(browserlang)) {
      this.translateService.use(browserlang);
      this.isRtl = browserlang !== "en";
    }

    this.router.events.subscribe(() => {
      const currentRoute = this.router.url;
      this.searchFilter = ["/product-list"].includes(currentRoute);
    });

    this.languageService.currentLang$.subscribe((lang) => {
      this.translateService.use(lang);
      this.isRtl = lang !== "en";
      this.selectedLang = lang;
    });
  }


  @ViewChild('search2MenuTrigger') search2MenuTrigger: MatMenuTrigger;
  @ViewChild('search3MenuTrigger') search3MenuTrigger: MatMenuTrigger;
  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.isSmallScreen = window?.innerWidth <= 768;

    if (this.search3MenuTrigger && this.search3MenuTrigger?.menuOpen) {
      this.search3MenuTrigger.closeMenu();
    }
    
    if (this.search2MenuTrigger && this.search2MenuTrigger?.menuOpen) {
      this.search2MenuTrigger.closeMenu();
    }
    if (!this.isSmallScreen && this.drawer?.opened) {
      this.drawer.close();
    }
  }

  isShowSearchField:boolean=false;
  isManuallyToggled = false;
  
  isShowSearchForm(){
   this.isManuallyToggled = true;
   this.isShowSearchField=!this.isShowSearchField
  }

  userToken:any;

  isSmallScreenScreen: boolean = window.innerWidth <= 991;

  checkScreenSize() {
    this.isSmallScreenScreen = window.innerWidth <= 991;
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth <= 1500;
   
    // if(this.isManuallyToggled && this.isShowSearchField){
      this.searchShowHide.getMessage().subscribe(msg => {
       if(this.isManuallyToggled && this.isShowSearchField && this.isSearchActive){
          this.isShowSearchField= true;
          this.isManuallyToggled=false
       }else{
         this.isShowSearchField= false
       }
        });
    // }
    this.checkScreenSize();
    window.addEventListener('resize', this.checkScreenSize.bind(this));

    this.isUserLogin = localStorage.getItem("isLoggedIn");
   
    this.userToken = localStorage.getItem("user_token");
    if(this.userToken){
      this.getUserDetails()
    }

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Close the sidebar when a route change occurs
      this.isNavbarOpen = false;
    });

    
    if (this.isUserLoggedIn()) {
      this.showHideUser = this.isUserLoggedIn();
      console.log("IsAdminUser ----------- ",this.isAdminUser())
      if (this.isAdminUser()) {
        this.showHideAdminUser = this.isAdminUser();
      }
    } 
    this.callForNewArrivals(); // <-- Call immediately once
    setInterval(() => {
      this.callForNewArrivals();
    }, 30 * 60 * 1000); // 30 minutes in milliseconds
  }


// call this function to check new arrivals product 
  callForNewArrivals(){
    // this.isNewArrivalsProduct = true
  }

  userDetails:any

  getUserDetails(){
    this.http.gtUserDetails().subscribe(
      (res)=>{
      this.userDetails = res.user
    })
  }

  routeToAdminPannel() {
    this.router.navigate(["/admin/dashboard"]);
  }

  isSearchActive:boolean=true;

onSearchInputClick() {
  this.isSearchActive = true
    this.isManuallyToggled=true;
}

  onSearch(query: string) {
    this.isSearchActive = true
    this.isManuallyToggled=true;
    if (this.search3MenuTrigger && this.search3MenuTrigger.menuOpen) {
      this.search3MenuTrigger.closeMenu();
    }
    this.searchService.changeSearchQuery(query);  
    this.router.navigate(['/product-list'], { queryParams: { query } }); 

    this.isShowSearchField=false;
    this.searchQuery="";
  }

  onSearchChange() {
    this.onSearch(this.searchQuery);
  }

  useLang(lang: string) {
    this.languageService.setLanguage(lang);
  }

  routeToBuyProduct() {
    this.router.navigate(["/product-list"]);
  }

  goToRegister() {
    this.router.navigateByUrl("login");
  }

  logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userID");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userType");
    this.isUserLogin = false;
    this.loginStateService.updateLoginStatus(false);
    localStorage.setItem("isAdmin", "false");
    this.router.navigateByUrl("login").then(() => {
      window.location.reload();
    });
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "header" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  routeToNewProduct() {
    let isUserLogin = localStorage.getItem("isLoggedIn");
    if (isUserLogin == 'false') {
      this.loginFirst();
    }

    isUserLogin = localStorage.getItem("isLoggedIn");
    if(isUserLogin != 'false'){
      this.router.navigate(["/new-product"]);
    }
  }
  
  isSearchForm: any = false;
  openSearchForm() {
    this.isSearchForm = !this.isSearchForm;
  }



  isNavbarOpen = false;

  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  closeNavbar(): void {
    this.isNavbarOpen = false;
  }

  userListing(){
    this.router.navigate(['/myListing'])
  }


    openCart() {
      console.log("open cart");
      const dialogRef = this.dialog.open(ShoppingCartComponent, {
        width: '600px', // Adjust as needed
        position: {
          right: '0',
          top: '0',
        },
        panelClass: 'custom-dialog-panel'
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        // handle result
      });
    }

    goToFavorites(){
      this.router.navigate(['myListing'], {
        state:{activeRouteType:'Favorites'}
      })
    }

    goToBuyOrders(){
      this.router.navigate(['myListing'], {
        state:{activeRouteType:'buyOrders'}
      })
    }

     goToSellOrders(){
      this.router.navigate(['myListing'], {
        state:{activeRouteType:'sellOrders'}
      })
    }

    goToMyListings(){
      this.router.navigate(['myListing'], {
        state:{activeRouteType:'myListings'}
      })
    }

    goToCart() {
      this.router.navigate(['/myListing'], 
        { 
          state: {
            activeRouteType: 'cart'
          }
         });
    }
}
