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
    this.getAllStaticstestimonials();
  }

  getAllStaticstestimonials() {
    this.http.getAllStaticstestimonial().subscribe(
      (res) => {
        this.testimonials = res.data.map((testimonial: any) => {
          // Remove backslashes from profile_picture URL
          testimonial.profile_picture = testimonial.profile_picture.replace(/\\/g, '');
          return testimonial;
        });

        console.log("this.testimonials",this.testimonials)
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
  }

  getNextIndex(offset: number = 1): number {
    return (this.activeIndex + offset) % this.testimonials.length;
  }
}
