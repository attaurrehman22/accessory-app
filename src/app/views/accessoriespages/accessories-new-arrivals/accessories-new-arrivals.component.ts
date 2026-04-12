import { animate, style, transition, trigger } from "@angular/animations";
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/services/http/http.service';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-accessories-new-arrivals',
  templateUrl: './accessories-new-arrivals.component.html',
  styleUrls: ['./accessories-new-arrivals.component.css'],
  animations: [
    trigger("cardEnter", [
      transition(":enter", [
        style({ opacity: 0, transform: "translateY(16px)" }),
        animate(
          "420ms cubic-bezier(0.22, 1, 0.36, 1)",
          style({ opacity: 1, transform: "none" }),
        ),
      ]),
    ]),
  ],
})
export class AccessoriesNewArrivalsComponent implements OnInit{
  // Properties for data management
  showList: any[] = [];
  filterBtn: string[] = [];
  selectedBtn: string = 'All';
  filteredList: any[] = [];
  loading: boolean = false;
  error: string = '';
  /** Placeholder count for skeleton grid */
  skeletonSlots = [0, 1, 2, 3, 4, 5, 6, 7];
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

  /** Category checkboxes for sidebar filters — filled from API payload (embedded categories on each accessory). */
  filterCategories: { id: number; name: string; selected?: boolean }[] = [];

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
    this.filterCategories.forEach((c) => (c.selected = false));
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
    
    if (this.filterCategories?.length > 0) {
      this.filterCategories.forEach((c) => {
        if (c?.selected) {
          this.queryString += "&";
          this.queryString += `category_ids[]=${c.id}`;
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
      const rows = res?.data;
      this.wishList = Array.isArray(rows)
        ? rows.map((item: any) => item.id)
        : [];
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
  /**
   * API may return a bare array, or legacy `{ data: [] }`, `{ groups: [...] }`.
   */
  private normalizeAccessoriesResponse(res: any): any[] {
    if (Array.isArray(res)) {
      return res;
    }
    if (Array.isArray(res?.data)) {
      return res.data;
    }
    if (Array.isArray(res?.groups)) {
      return res.groups.reduce((acc: any[], g: any) => {
        return acc.concat(g.accessories || []);
      }, []);
    }
    return [];
  }

  /** Unique categories for sidebar checkboxes from embedded `categories` on each accessory. */
  private buildFilterCategoriesFromAccessories(accessories: any[]): void {
    const map = new Map<
      number,
      { id: number; name: string; selected: boolean }
    >();
    accessories.forEach((a) => {
      const cats = a?.categories;
      if (!Array.isArray(cats)) {
        return;
      }
      cats.forEach((c: any) => {
        const id = c?.id;
        if (id != null && !map.has(id)) {
          map.set(id, {
            id,
            name: c.name ?? `Category ${id}`,
            selected: false,
          });
        }
      });
    });
    this.filterCategories = Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }

  // Fetch accessories from API (flat list of accessories)
  getAccessories() {
    this.loading = true;
    this.error = "";
    this.http.getPublicAccessories(this.queryString).subscribe({
      next: (res: any) => {
        const list = this.normalizeAccessoriesResponse(res);
        this.showList = list;
        this.buildFilterCategoriesFromAccessories(list);
        this.setupFilterButtons();
        this.selectBtn("All");
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = "Failed to load accessories.";
        this.showList = [];
        this.filteredList = [];
        this.filterBtn = ["All"];
        this.filterCategories = [];
      },
    });
  }

  /** Horizontal chips: unique category names from loaded accessories. */
  setupFilterButtons() {
    const names = new Set<string>();
    this.showList.forEach((a: any) => {
      const cats = a?.categories;
      if (!Array.isArray(cats)) {
        return;
      }
      cats.forEach((c: any) => {
        if (c?.name) {
          names.add(String(c.name));
        }
      });
    });
    this.filterBtn = ["All", ...Array.from(names).sort((a, b) => a.localeCompare(b))];
  }

  /** Filter grid by selected category chip (matches any embedded category name). */
  selectBtn(btn: string) {
    this.selectedBtn = btn;

    if (btn === "All") {
      this.filteredList = [...this.showList];
      return;
    }

    this.filteredList = this.showList.filter((a: any) =>
      (a.categories || []).some((c: any) => c?.name === btn),
    );
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

  getDisplayPrice(accessory: any): string {
    if (accessory?.inventories?.length) {
      const inventory = accessory.inventories[0];
      const price = inventory.offer_price || inventory.sale_price || "0";
      return parseFloat(String(price)).toFixed(2);
    }
    return parseFloat(String(accessory?.min_price ?? "0")).toFixed(2);
  }

  getDisplayTitle(accessory: any): string {
    if (accessory?.inventories?.length && accessory.inventories[0].title) {
      return accessory.inventories[0].title;
    }
    return accessory?.name ?? "";
  }

  getDisplayBrand(accessory: any): string {
    if (accessory?.inventories?.length && accessory.inventories[0].brand) {
      return accessory.inventories[0].brand;
    }
    const b = accessory?.brand;
    return b != null && String(b).trim() !== "" ? String(b) : "—";
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

  trackByAccessoryId(_index: number, item: any): string | number {
    return item?.id ?? _index;
  }
}
