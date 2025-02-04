import { Component, ElementRef, HostListener, OnInit } from "@angular/core";
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
  featured: boolean = false;
  watchTypes:any[]=[
    {id:1,name:'Promoted'},
    {id:2,name:'Featured'},
    {id:3,name:'Popular'}
  ];
  categories:any[]=[];
  searchQuery: string = "";

  getFilteredData(){
    this.http.getFilteredData().subscribe(
      (res)=>{
        this.categories=res.top_categories;
        if(res?.min_price){
          this.min=Math.round(res.min_price);
         this.currentValue = this.min; 
        }else{
          this.min = 1000;
        }
        if(res?.max_price){
          this.max=Math.round(res.max_price);
        }else{
          this.max = 3000;
        }
      }
    )
  }

  ngOnInit(): void {
    this.getAllCategories();
    this.getFilteredData()
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if (this.isUserLogin === "true") {
      this.getWishList();
    }
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['query'] || '';  // Read query parameter, or default to an empty string
      this.featured = params['name'] === 'featured';  // Check if 'name' is 'featured' and set the flag
      if(this.featured){
        this.watchTypes[1].selected = true;
      }
      this.applyFilters();
    });
  }

  get selectedCategories() {
    return this.categories.filter(category => category.selected);
  }

  get selectedWatchTypes() {
    return this.watchTypes.filter(type => type.selected);
  }

   // Method to remove category from selected categories
   removeCategory(categoryId: number) {
    const category = this.categories.find(cat => cat.id === categoryId);
    if (category) {
      category.selected = false;  // Deselect the category
      this.applyFilters();  // Reapply filters after removal
    }
  }

  // Method to remove watch type from selected watch types
  removeWatchType(watchTypeId: number) {
    const watchType = this.watchTypes.find(type => type.id === watchTypeId);
    if (watchType) {
      watchType.selected = false;  // Deselect the watch type
      this.applyFilters();  // Reapply filters after removal
    }
  }

  wishList: any;
  getWishList() {
    this.http.getWishList().subscribe((res) => {
      this.wishList = res?.data;
    });
  }

  addWishList(watch) {
    const formData = {
      product_id: watch.id,
    };
    this.http.addWishList(formData).subscribe((res) => {
      this.wishList = res?.data;
      this.getWishList();
      this.applyFilters();
    });
  }

  getAllCategories() {
    this.http.getCategoryDropDown().subscribe(
      (res) => {
        this.categories = res?.data;
      },
      (err) => {}
    );
  }

  clearFilters(){
    this.isApplyFiltere=false;
    this.categories.forEach(category => (category.selected = false));
    this.watchTypes.forEach(type => (type.selected = false));
    // this.priceRange = { from: 200, to: 50000 };
      // Optionally, update slider UI if used
    this.currentValue = 200; // Update the "From" value on the slider
    this.currentPercentage = 0
    this.applyFilters();
  }

  itemsPerPage:number=30;
  currentPage:number=1;
  totalItems:number=0;
  fromItem:number=1;
  toItem:number=1;
  itemsPerPageOptions: number[] = [30, 60, 90, 100];
  totalPageNumbers: number[] = [];
  isnextPage:boolean=true;

  changePage(page: number) {
    this.currentPage = page;

    this.applyFilters(); 
  }

  onItemsPerPageChange() {
    this.currentPage = 1; 
    this.applyFilters(); 
  }

  isApplyFiltere:boolean=false;
  applyFilters() {
    this.isApplyFiltere=true;
    this.isShowFilters=false;
    let queryString = "";
    // // Add categories to the query string
    if (this.categories?.length > 0) {
      this.categories.forEach((id, index) => {
        if(id?.selected){
          queryString += `category_ids[]=${id.id}`;
          if (index < this.categories?.length - 1) {
            queryString += "&"; // Add an "&" if it's not the last element
          }
        }
      });
    }
    // // Add brands to the query string
    if (this.watchTypes?.length > 0) {
      if (queryString) {
        queryString += "&"; // Add '&' if categories already exist
      }
      this.watchTypes.forEach((id, index) => {
        if(id.selected){
          let isPROMO=1
          if(id.id === 1){
            queryString += `&is_promoted=${isPROMO}`
          }
          if(id.id === 2){
            queryString += `&feature_item=${isPROMO}`
          }
          if(id.id === 3){
            queryString += `&popular_item=${isPROMO}`
          }
          // queryString += `brand_ids[]=${id.id}`; // Use brand_ids[] to store as an array
          if (index < this.watchTypes?.length - 1) {
            queryString += "&"; // Add '&' between values, not at the end
          }
        }
      });
    }
    // this.currentPage=1;
    // this.itemsPerPage=100;
    queryString += `&page=${this.currentPage}`;
    queryString += `&per_page=${this.itemsPerPage}`;
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
      this.totalItems=this.showList?.data?.total;
      this.fromItem=this.showList?.data?.from;
      this.toItem=this.showList?.data?.to;

     
      if(this.showList?.data?.next_page_url === null){
        this.isnextPage=false
      }else{
        this.isnextPage=true
      }
      this.showList = this.showList?.data?.data;
      this.showList?.data?.data?.map((product: any) => {
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

  constructor(
    public translateService: TranslateService,
    private http: HttpService,
    private router: Router,
    private elRef: ElementRef,
    private searchService: SearchServiceService,
    private route: ActivatedRoute,
    private languageService:LanguageService,
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages?.includes(browserLang)) {
      this.translateService.use(browserLang);
    }

    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages?.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages?.includes(browserLang)) {
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
   this.isShowFilters=!this.isShowFilters;
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
