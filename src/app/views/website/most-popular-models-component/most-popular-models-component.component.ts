import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, HostListener, Input, OnInit,ViewChild,ViewEncapsulation } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Subscription } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-most-popular-models-component",
  templateUrl: "./most-popular-models-component.component.html",
  styleUrls: ["./most-popular-models-component.component.css"]
})
export class MostPopularModelsComponentComponent implements OnInit {
   apiUrl = environment.apipath+ '/'
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
  
    constructor(private http: HttpClient) {}
  
    ngOnInit(): void {
     
      // Fetch images from the API
      this.getAllPopularModels();
      this.updateLayout();
    }
  
    ngOnDestroy(): void {
     
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      if (this.apiSubscription) {
        this.apiSubscription.unsubscribe();
      }
    }
  
    @HostListener('window:resize', ['$event'])
    onResize(): void {
      this.updateLayout();
    }
  
    private getAllPopularModels(): void {
      // Assuming `http.getTopBrandsData()` returns the response you mentioned
      this.apiSubscription = this.http.get<any>(`${this.apiUrl}api/get-top-brands-data`).subscribe(
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
  }