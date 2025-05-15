import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
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
  isLoading = true;
  featured: boolean = false;
  watchTypes:any[]=[
    {id:1,name:'Promoted'},
    {id:2,name:'Featured'},
    {id:3,name:'Popular'}
  ];
  categories:any[]=[];
  searchQuery: string = "";

  beminprice:number=0
  bemaxprice:number=0

  getFilteredData(){
    this.http.getFilteredData().subscribe(
      (res)=>{
        this.categories=res.top_categories;
        if(res?.min_price){
          this.min=Math.round(res.min_price);
          this.currentValue = this.min; 
          this.beminprice=this.min
        }else{
          this.min = 1000;
        }
        if(res?.max_price){
          this.max=Math.round(res.max_price);
          this.bemaxprice=this.max
        }else{
          this.max = 3000;
        }
      }
    )
  }

  isFiltereredSearchQueryIsShow:boolean=false;

  ngOnInit(): void {
    this.getAllCategories();
    this.getFilteredData()
    this.isUserLogin = localStorage.getItem("isLoggedIn");
    if (this.isUserLogin === "true") {
      this.getWishList();
    }
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['query'] || '';  // Read query parameter, or default to an empty string
      if(this.searchQuery){
         this.isFiltereredSearchQueryIsShow=true;
      }
      this.featured = params['name'] === 'featured';  // Check if 'name' is 'featured' and set the flag
      if(this.featured){
        this.watchTypes[1].selected = true;
      }
      this.applyFilters();
    });
  }



  removeSearchQuery(){
    this.searchQuery = "";
     this.isFiltereredSearchQueryIsShow=false;
       this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { query: null },
        queryParamsHandling: 'merge', // keep other params
      });
    this.applyFilters()
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
      // this.applyFilters();
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

    this.isFiltereredOptionIsShow=false
    this.categories.forEach(category => (category.selected = false));
    this.watchTypes.forEach(type => (type.selected = false));
    // this.priceRange = { from: 200, to: 50000 };
      // Optionally, update slider UI if used
    this.currentValue = 200; // Update the "From" value on the slider
    // this.currentPercentage = 0
    this.minPercentage = 0; // Left thumb position (percentage)
    this.maxPercentage = 100; // Right thumb position (percentage)
    this.removeSearchQuery();
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


  isFiltereredOptionIsShow:boolean=false;
  applyFilters() {

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

    if(this.selectedCategories.length > 0 || this.selectedWatchTypes.length > 0){
      this.isFiltereredOptionIsShow=true;
    }
    // // Call the API with the constructed query string
    if (queryString) {
      this.getProductsByCategory(queryString);
    }
  }

  getProductsByCategory(queryString: any) {
    this.http.getProductsByCategory(queryString).subscribe(
      (res) => {
      this.showList = res;
      this.totalItems=this.showList?.data?.total;
      this.fromItem=this.showList?.data?.from;
      this.toItem=this.showList?.data?.to;
      this.isLoading = false;
     
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
  minPercentage = 0; // Left thumb position (percentage)
  maxPercentage = 100; // Right thumb position (percentage)

  draggingThumb: 'min' | 'max' | null = null; // Track which thumb is being dragged

  @ViewChild('range', { static: false }) range!: ElementRef; // Reference to the slider

  // Handle mousedown to start dragging a thumb
  startDragging(event: MouseEvent, type: 'min' | 'max'): void {
    event.preventDefault(); // Fix dragging issue
    this.draggingThumb = type;
  }

  // Listen for mousemove to update the slider thumbs
  @HostListener('window:mousemove', ['$event'])
  onDragging(event: MouseEvent): void {
    if (!this.draggingThumb || !this.range) return;

    const rangeRect = this.range.nativeElement.getBoundingClientRect();
    let newLeft = ((event.clientX - rangeRect.left) / rangeRect.width) * 100;
    // Constrain within bounds (0% to 100%)
    newLeft = Math.max(0, Math.min(100, newLeft));

    if (this.draggingThumb == 'min' && newLeft < this.maxPercentage) {
      this.minPercentage = newLeft;
      this.min = Math.round(this.beminprice + (newLeft / 100) * (this.bemaxprice - this.beminprice));
      this.currentValue=this.min;
    } else if (this.draggingThumb == 'max' && newLeft > this.minPercentage) {
      this.maxPercentage = newLeft;
      this.max = Math.round(this.beminprice + (newLeft / 100) * (this.bemaxprice - this.beminprice));
    }
  }

  // Stop dragging on mouseup
  @HostListener('window:mouseup')
  stopDragging(): void {
    this.draggingThumb = null;
  }

}
