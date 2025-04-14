import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";
import { LanguageService } from "src/services/lang-service/language.service";
import { Carousel } from 'bootstrap';
@Component({
  selector: "app-people-syaing-component",
  templateUrl: "./people-syaing-component.component.html",
  styleUrls: ["./people-syaing-component.component.css"],
})
export class PeopleSyaingComponentComponent implements AfterViewInit, OnInit {
  @ViewChild("testimonialCarousel", { static: false }) carousel!: ElementRef;
  carouselInstance: any;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  activeIndex = 0;
  testimonials:any;

  ngOnInit(): void {
    this.testimonials=[];
    this.getAllStaticstestimonials();
  }

  getAllStaticstestimonials() {
    this.http.getAllStaticstestimonial().subscribe(
      (res) => {
        this.testimonials = res.data.map((testimonial: any) => {
          if (testimonial?.profile_picture) {
            testimonial.profile_picture = testimonial.profile_picture.replace(/\\/g, '');
          }
          return testimonial;
        });
  
        // Wait for DOM to update
        setTimeout(() => {
          if (this.carousel?.nativeElement) {
            const carouselElement = this.carousel.nativeElement;
            carouselElement.addEventListener("slid.bs.carousel", () => {
              this.updateActiveIndex();
            });
          }
        });
      },
      (err) => {
       
      }
    );
  }
  

  constructor(
    public translateService: TranslateService,
    private http: HttpService,
      private languageService:LanguageService,
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

  ngAfterViewInit(): void {
    // const carouselElement = this.carousel.nativeElement;
    // carouselElement.addEventListener("slid.bs.carousel", () => {
    //   this.updateActiveIndex();
    // });

      if (this.carousel?.nativeElement) {
      this.carouselInstance = new Carousel(this.carousel.nativeElement, {
        interval: 5000, // 5 seconds
        ride: 'carousel',
        pause: true, // do not stop on hover
        wrap: true, // loop back
      });

      this.carousel.nativeElement.addEventListener("slid.bs.carousel", () => {
        this.updateActiveIndex();
      });
    }
  }

  animationTrigger = false;

  private carouselInitialized = false;

  ngAfterViewChecked(): void {
    if (!this.carouselInitialized && this.carousel?.nativeElement) {
      const carouselElement = this.carousel.nativeElement;
      carouselElement.addEventListener("slid.bs.carousel", () => {
        this.updateActiveIndex();
      });
      this.carouselInitialized = true;
    }
  }

  private updateActiveIndex() {
    const carouselItems =
      this.carousel.nativeElement.querySelectorAll(".carousel-item");
    const activeElement = this.carousel.nativeElement.querySelector(
      ".carousel-item.active"
    );
    this.activeIndex = Array.from(carouselItems).indexOf(activeElement);

    this.animationTrigger = false;
    setTimeout(() => {
      this.animationTrigger = true;
    }, 10); // Small delay to re-trigger CSS animation
    // console.log("this.activeIndex",this.activeIndex)
  }

  getNextIndex(offset: number = 1): number {
    if (!this.testimonials || this.testimonials.length === 0) {
      // console.error('Testimonials not available or empty');
      return 0; // or return a default index, e.g., 0
    }

    return (this.activeIndex + offset + this.testimonials.length) % this.testimonials.length;
  }
}
