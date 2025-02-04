import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnInit,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-people-syaing-component",
  templateUrl: "./people-syaing-component.component.html",
  styleUrls: ["./people-syaing-component.component.css"],
})
export class PeopleSyaingComponentComponent implements AfterViewInit, OnInit {
  @ViewChild("testimonialCarousel", { static: false }) carousel!: ElementRef;
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
          testimonial.profile_picture = testimonial.profile_picture.replace(/\\/g, '');
          return testimonial;
        });
      },
      (err) => {
        console.error('Error fetching testimonials:', err);
      }
    );
  }

  constructor(
    private translateService: TranslateService,
    private http: HttpService
  ) {
    const supportedLanguages = ["en", "ar"];
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang("en");

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  ngAfterViewInit(): void {
    const carouselElement = this.carousel.nativeElement;
    carouselElement.addEventListener("slid.bs.carousel", () => {
      this.updateActiveIndex();
    });
  }

  private updateActiveIndex() {
    const carouselItems =
      this.carousel.nativeElement.querySelectorAll(".carousel-item");
    const activeElement = this.carousel.nativeElement.querySelector(
      ".carousel-item.active"
    );
    this.activeIndex = Array.from(carouselItems).indexOf(activeElement);
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
