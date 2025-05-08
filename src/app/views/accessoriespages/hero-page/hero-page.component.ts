import { ChangeDetectorRef, Component, computed, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { ModelLoginComponent } from '../../auth/model-login/model-login.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatMenuTrigger } from '@angular/material/menu';
import { LanguageService } from 'src/services/lang-service/language.service';
import { SearchServiceService } from 'src/services/search-service/search-service.service';
import { LoginStateService } from 'src/services/login-service/login-state.service';
import { MatDialog } from '@angular/material/dialog';
import { HttpService } from 'src/services/http/http.service';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ShoppingCartComponent } from '../../modal/shopping-cart/shopping-cart.component';

@Component({
  selector: 'app-hero-page',
  templateUrl: './hero-page.component.html',
  styleUrls: ['./hero-page.component.css']
})
export class HeroPageComponent {
isSmallScreen: boolean = false;
  isUserLogin: any = false;
  searchQuery: string = "";
  dropdownOpen = false;
  showHideAdminUser: any;
  showHideUser: any;

      @Input() imageWidth: number = 300;
      @Input() speed: number = 100;
      @Input() coins: boolean = false;
    
      @ViewChild('container') containerRef!: ElementRef;
      @ViewChild('slider') sliderRef!: ElementRef;
    
      visibleSlides: number = 3;
      slideMargin: number = 20;
    
      images: string[] = []; // Store image URLs here
      duplicatedImages: string[] = [];
    
      private animationFrame: any;
      private position: number = 0;
      private apiSubscription!: Subscription;

  homeData: any = { slider: [] }

  isAdminUser = computed(() => this.loginStateService.isAdminUser());
  isUserLoggedIn = computed(() => this.loginStateService.isUserLoggedIn());

  getSlideData() {
    this.http.getHomeData().subscribe(
      (res) => {
        this.homeData = res.data || { slider: [] };
      },
      (err) => {
        this.homeData = { slider: [] };
      }
    );
  }
 
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
     private dialog: MatDialog,private http:HttpService,private httpps: HttpClient
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
    this.updateLayout();
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

  isShowSearchForm(){
   this.isShowSearchField=!this.isShowSearchField
  }

  userToken:any;

  @HostListener('window:resize', ['$event'])
  // onResize(): void {
    
  // }

  private getAllPopularModels(): void {
    // Assuming `http.getTopBrandsData()` returns the response you mentioned
    this.apiSubscription = this.httpps.get<any>('https://api.chronosouq.com/api/get-top-brands-data').subscribe(
      (res) => {
        if (res && res.top_brands) {
          // Process the response to extract cover_image URLs
          this.images = res.top_brands.map((product: any) => {
              if(product?.svg){
                return product.svg;
              }
           
          }).filter(img => img); // Ensure we don't include empty strings if there's no cover_image
     
   

          this.duplicatedImages = [...this.images, ...this.images, ...this.images,...this.images,...this.images, ...this.images, ...this.images,...this.images,...this.images, ...this.images, ...this.images,...this.images,...this.images, ...this.images, ...this.images,...this.images, ...this.images, ...this.images,...this.images, ...this.images, ...this.images,...this.images, ...this.images, ...this.images,...this.images, ...this.images, ...this.images,...this.images, ...this.images, ...this.images,...this.images, ...this.images, ...this.images,...this.images, ...this.images, ...this.images];
          this.animate(); // Start the animation after images are fetched
        }
      },
      (err) => {
        console.error('Error loading popular models:', err);
      }
    );
  }

  private updateLayout(): void {
    if (window.innerWidth < 768) {
      if (this.coins) {
        this.visibleSlides = 4;
        this.slideMargin = 20;
      } else {
        this.visibleSlides = 2;
        this.slideMargin = 60;
      }
    } else if (window.innerWidth < 480) {
      if (this.coins) {
        this.visibleSlides = 1;
        this.slideMargin = 10;
      } else {
        this.visibleSlides = 1;
        this.slideMargin = 30;
      }
    } else {
      if (this.coins) {
        this.visibleSlides = 3;
        this.slideMargin = 50;
      } else {
        this.visibleSlides = 3;
        this.slideMargin = 100;
      }
    }
  }

  private animate(): void {
    const slideWidth = this.imageWidth + this.slideMargin * 2;
    this.position -= this.speed / 60;

    if (-this.position >= slideWidth * this.duplicatedImages.length) {
      this.position += slideWidth * this.duplicatedImages.length;
    }

    this.sliderRef.nativeElement.style.transform = `translateX(${this.position}px)`;
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
     
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.getAllPopularModels();
      this.updateLayout();
    this.isSmallScreen = window.innerWidth <= 1500;
    this.isUserLogin = localStorage.getItem("isLoggedIn");
   
    this.userToken = localStorage.getItem("user_token");
    if(this.userToken){
      this.getUserDetails()
    }

    this.getSlideData();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Close the sidebar when a route change occurs
      this.isNavbarOpen = false;
    });

    
    if (this.isUserLoggedIn()) {
      this.showHideUser = this.isUserLoggedIn();
      if (this.isAdminUser()) {
        this.showHideAdminUser = this.isAdminUser();
      } else {

      }
    } else {

    }
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

  onSearch(query: string) {
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
      width: '400px', // Adjust as needed
      height: '100vh',
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
  
}
