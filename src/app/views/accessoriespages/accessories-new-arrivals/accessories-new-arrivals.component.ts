import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/services/http/http.service';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-accessories-new-arrivals',
  templateUrl: './accessories-new-arrivals.component.html',
  styleUrls: ['./accessories-new-arrivals.component.css']
})
export class AccessoriesNewArrivalsComponent implements OnInit{
  // Properties for data management
  showList: any[] = [];
  filterBtn: string[] = [];
  selectedBtn: string = 'All';
  filteredList: any[] = [];
  loading: boolean = false;
  error: string = '';
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;

  constructor(private http: HttpService, private router: Router,
    public translateService: TranslateService,
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

  categories = [
    {
      id: 1,
      name: "Python"
    },
    {
      id: 2,
      name: "Snake"
    },
    {
      id: 3,
      name: "Leather"
    },
    {
      id: 4,
      name: "Leather two"
    },  
    {
      id: 5,
      name: "Leather three"
    },
    {
      id: 6,
      name: "Leather four"
    },
  ];

  isFiltereredOptionIsShow:boolean=false;
  min = 200; 
  max = 50000;
  currentValue = this.min; 
  minPercentage = 0; // Left thumb position (percentage)
  maxPercentage = 100; // Right thumb position (percentage)
  beminprice:number=1000
  bemaxprice:number=3000

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
    limit:number=100;
  clearFilters(){
    this.isShowFilters=false;
    this.queryString="";
    this.min=200;
    this.max=50000;
    this.currentValue=this.min;
    this.beminprice=1000;
    this.bemaxprice=3000;
    this.categories.forEach((category:any) => (category.selected = false));
    this.currentValue = 200; // Update the "From" value on the slider
    this.minPercentage = 0; // Left thumb position (percentage)
    this.maxPercentage = 100; // Right thumb position (percentage)
    this.limit=100;
    this.applyFilters();
  }

  
  queryString:string="";

  applyFilters() {
    this.isShowFilters=false;
    this.queryString="";
    // // Add categories to the query string
    this.queryString += `limit=${this.limit}`;
    if(this.min > 0){
      this.queryString += "&";
      this.queryString += `min_price=${this.min}`;
    }
    if(this.max > 0){
      this.queryString += "&";
      this.queryString += `max_price=${this.max}`;
    }
    
    if (this.categories?.length > 0) {
      this.categories.forEach((id:any, index:any) => {
        if(id?.selected){
          this.queryString += "&"; 
          this.queryString += `category_ids[]=${id.id}`;
          // if (index < this.categories?.length - 1) {
          //   this.queryString += "&"; // Add an "&" if it's not the last element
          // }
        }     
      });
    }
   
    this.getAccessories();
  }

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  ngOnInit(): void {
    this.getWishList()
    this.applyFilters();
  }

  wishList: number[] = [];

  getWishList() {
    this.http.getAccessoryWishList().subscribe((res: any) => {
      this.wishList = res.data.map((item: any) => item.id); // extract only the IDs
    });
  }

  addWishList(productID: any) {
    if(this.wishList.includes(productID)){
      this.http.removeAccessoryWishList(productID).subscribe(
        (res: any) => {
          // this.wishList = res.data;
          this.getWishList()
        }
      );
    }else{
      this.http.addAccessoryWishList(productID).subscribe(
        (res: any) => {
          this.wishList = res.data;
          this.getWishList()
        }
      );
    }
  }  
  // Fetch accessories from API
  getAccessories() {
    this.loading = true;
    this.http.getPublicAccessories(this.queryString).subscribe((res:any)=>{
      console.log(res);
      this.showList = res.groups || [];
      this.setupFilterButtons();
      this.selectBtn('All');
      this.loading = false;
    })
  }

  // Setup filter buttons from groups
  setupFilterButtons() {
    this.filterBtn = this.showList.map((group: any) => group.group_name);
    this.filterBtn.unshift("All");
  }

  // Handle filter button selection
  selectBtn(btn: string) {
    this.selectedBtn = btn;
    
    if (btn === "All") {
      // Show all accessories from all groups
      this.filteredList = this.showList.reduce((acc: any[], group: any) => {
        return acc.concat(group.accessories);
      }, []);
    } else {
      // Show accessories from selected group only
      const selectedGroup = this.showList.find((group: any) => group.group_name === btn);
      this.filteredList = selectedGroup ? selectedGroup.accessories : [];
    }
  }

  // Scroll functionality
  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({
      left: -200,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({
      left: 200,
      behavior: 'smooth'
    });
  }

  // Helper method to get display price for an accessory
  getDisplayPrice(accessory: any): string {
    if (accessory.inventories && accessory.inventories.length > 0) {
      const inventory = accessory.inventories[0];
      return inventory.offer_price || inventory.sale_price || '0';
    }
    return accessory.min_price || '0';
  }

  // Helper method to get display title for an accessory
  getDisplayTitle(accessory: any): string {
    if (accessory.inventories && accessory.inventories.length > 0) {
      return accessory.inventories[0].title || accessory.name;
    }
    return accessory.name;
  }

  // Helper method to get display brand for an accessory
  getDisplayBrand(accessory: any): string {
    if (accessory.inventories && accessory.inventories.length > 0) {
      return accessory.inventories[0].brand || accessory.brand;
    }
    return accessory.brand;
  }

  // Helper method to get main image
  getMainImage(accessory: any): string {
    if (accessory.main_image) {
      return `${environment.apipath}/${accessory.main_image}`;
    }
    return '../../../../assets/images/accesory-dummy-image.svg';
  }

  apipath = environment.apipath;


  isShowFilters:boolean=false;

  openFilters(){
   this.isShowFilters=!this.isShowFilters;
  }
}
