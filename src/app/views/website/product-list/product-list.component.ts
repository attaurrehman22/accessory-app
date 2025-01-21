import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";
import { SearchServiceService } from "src/services/search-service/search-service.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  showList: any;
  isUserLogin: any;
  watchTypes:any[]=[
    {id:1,name:'Promoted'},
    {id:2,name:'Featured'},
    {id:3,name:'Popular'}
  ];

  // this.watchTypes = 
  categories:any[]=[];
  searchQuery: string = "";

  ngOnInit(): void {
    this.getAllCategories()
    // this.getAllBrands()
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if (this.isUserLogin === "true") {
      this.getWishList();
    }
    this.applyFilters();
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['query'] || '';  // Read query parameter, or default to an empty string
      console.log("Search query received in ProductListComponent:", this.searchQuery);
      this.applyFilters();
    });
    // this.getAllModels();
  }

  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res.data;
    });
  }

  addWishList(watch) {
    const formData = {
      product_id: watch.id,
    };
    this.http.addWishList(formData).subscribe((res) => {
      this.wishList = res.data;
      this.getWishList();
      this.applyFilters();
      // this.getAllModels();
    });
  }

  getAllCategories() {
    this.http.getCategoryDropDown().subscribe(
      (res) => {
        this.categories = res.data;
      },
      (err) => {}
    );
  }

  clearFilters(){
    this.categories.forEach(category => (category.selected = false));
    this.watchTypes.forEach(type => (type.selected = false));
    // this.priceRange = { from: 200, to: 50000 };
      // Optionally, update slider UI if used
    this.currentValue = 200; // Update the "From" value on the slider
    this.currentPercentage = 0
    this.applyFilters();
  }


  applyFilters() {
    let queryString = "";
    // // Add categories to the query string
    if (this.categories.length > 0) {
      this.categories.forEach((id, index) => {
        if(id.selected){
          queryString += `category_ids[]=${id.id}`;
          if (index < this.categories.length - 1) {
            queryString += "&"; // Add an "&" if it's not the last element
          }
        }
      });
    }
    // // Add brands to the query string
    if (this.watchTypes.length > 0) {
      if (queryString) {
        queryString += "&"; // Add '&' if categories already exist
      }
      this.watchTypes.forEach((id, index) => {
        console.log("Brand ID ------ ",id)
        if(id.selected){
          let isPROMO=1
          if(id.id === 1){
            console.log("id.id === 1")
            queryString += `&is_promoted=${isPROMO}`
            console.log("queryString",queryString)
          }
          if(id.id === 2){
            console.log("id.id === 2")
            queryString += `&feature_item=${isPROMO}`
            console.log("queryString",queryString)
          }
          if(id.id === 3){
            console.log("id.id === 3")
            queryString += `&popular_item=${isPROMO}`
            console.log("queryString",queryString)
          }
          // queryString += `brand_ids[]=${id.id}`; // Use brand_ids[] to store as an array
          if (index < this.watchTypes.length - 1) {
            queryString += "&"; // Add '&' between values, not at the end
          }
        }
      });
    }
    let currentPage=1;
    let itemsPerPage=100;
    queryString += `&page=${currentPage}`;
    queryString += `&per_page=${itemsPerPage}`;
    queryString += `&min_price=${this.currentValue}`;
    queryString += `&max_price=${this.max}`;
    
    if(this.searchQuery){
      queryString += `&name=${this.searchQuery}`;
    }
    // // Call the API with the constructed query string
    if (queryString) {
      this.getProductsByCategory(queryString);
    }
  }

  getProductsByCategory(queryString: any) {
    this.http.getProductsByCategory(queryString).subscribe((res) => {
      this.showList = res;
      this.showList = this.showList.data.data;
      this.showList.data.data.map((product: any) => {
        if (product.main_image) {
          product.main_image = product.main_image
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        }

        if (product.folder) {
          product.folder = product.folder
            .replace(/\\/g, "/")
            .replace(/^\/+/, "");
        }

        if (product.additional_images) {
          try {
            product.additional_images = JSON.parse(
              product.additional_images
            ).map((img: string) => img.replace(/\\/g, "/").replace(/^\/+/, ""));
          } catch (error) {
            console.error("Error parsing additional_images:", error);
          }
        }
        return product;
      });

    });
  }

  // getAllBrands() {
  //   this.http.getBrandsDropDownFilter().subscribe(
  //     (res) => {
  //       this.watchTypes = res.data;
  //     },
  //     (err) => {}
  //   );
  // }

  constructor(
    public translateService: TranslateService,
    private http: HttpService,
    private router: Router,
    private searchService: SearchServiceService,
    private route: ActivatedRoute,
    private languageService:LanguageService,
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }

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

  useLang(lang: string) {
    this.translateService.use(lang);
  }

  routeToDetailPage(watch) {
    this.router.navigate(["/buy-product"], {
      state: { data: watch },
    });
  }

  priceRange = { from: 200, to: 50000 };


  isShowFilters:boolean=false;

  openFilters(){
   this.isShowFilters=!this.isShowFilters
  }

  min = 200; 
  max = 50000;
  currentValue = this.min; 
  currentPercentage = 0; 

  dragging = false; // State to track dragging

  // Handle mousedown to start dragging
  startDragging(event: MouseEvent, range: HTMLElement): void {
    this.dragging = true;
    this.updateValue(event, range);
  }

  // Listen for mousemove to update the slider thumb and value
  @HostListener('window:mousemove', ['$event'])
  onDragging(event: MouseEvent): void {
    if (this.dragging) {
      const range = document.querySelector('.range') as HTMLElement;
      if (range) {
        this.updateValue(event, range);
      }
    }
  }

  // Stop dragging on mouseup
  @HostListener('window:mouseup')
  stopDragging(): void {
    this.dragging = false;
    console.log('Final Value:', this.currentValue);
  }

  // Update the value and position of the thumb
  updateValue(event: MouseEvent, range: HTMLElement): void {
    const rangeRect = range.getBoundingClientRect();
    let newLeft = event.clientX - rangeRect.left;

    // Constrain within the slider bounds
    if (newLeft < 0) newLeft = 0;
    if (newLeft > rangeRect.width) newLeft = rangeRect.width;

    // Calculate percentage and value
    this.currentPercentage = (newLeft / rangeRect.width) * 100;
    this.currentValue = Math.round(
      this.min + (this.currentPercentage / 100) * (this.max - this.min)
    );
  }

}
