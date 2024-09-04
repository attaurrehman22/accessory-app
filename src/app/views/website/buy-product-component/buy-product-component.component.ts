import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-buy-product-component",
  templateUrl: "./buy-product-component.component.html",
  styleUrls: ["./buy-product-component.component.css"],
})
export class BuyProductComponentComponent implements OnInit, OnDestroy {
  products = [
    {
      name: "Rolex GMT-Master II",
      model: "126715CHNR",
      price: 35500,
      location: "HK",
      image: "../assets/images/recommonded-1.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126710BLRO",
      price: 20925,
      location: "NL",
      image: "../assets/images/recommonded-2.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126715CHNR",
      price: 35500,
      location: "HK",
      image: "../assets/images/recommonded-3.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126710BLRO",
      price: 20925,
      location: "NL",
      image: "../assets/images/recommonded-4.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126715CHNR",
      price: 35500,
      location: "HK",
      image: "../assets/images/recommonded-5.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126710BLRO",
      price: 20925,
      location: "NL",
      image: "../assets/images/recommonded-6.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126715CHNR",
      price: 35500,
      location: "HK",
      image: "../assets/images/recommonded-7.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126710BLRO",
      price: 20925,
      location: "NL",
      image: "../assets/images/recommonded.png",
    },
  ];

  products1 = [
    {
      name: "Rolex GMT-Master II",
      model: "126715CHNR",
      price: 35500,
      location: "HK",
      image: "../assets/images/interested-watches-1.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126710BLRO",
      price: 20925,
      location: "NL",
      image: "../assets/images/interested-watches-2.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126715CHNR",
      price: 35500,
      location: "HK",
      image: "../assets/images/interested-watches-3.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126710BLRO",
      price: 20925,
      location: "NL",
      image: "../assets/images/interested-watches-4.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126715CHNR",
      price: 35500,
      location: "HK",
      image: "../assets/images/interested-watches-5.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126710BLRO",
      price: 20925,
      location: "NL",
      image: "../assets/images/interested-watches-6.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126715CHNR",
      price: 35500,
      location: "HK",
      image: "../assets/images/interested-watches-7.png",
    },
    {
      name: "Rolex GMT-Master II",
      model: "126710BLRO",
      price: 20925,
      location: "NL",
      image: "../assets/images/interested-watches-8.png",
    },
    // Add more products here
  ];
  

  currentIndex = 0;
  currentIndex1 = 0;
  itemsPerPage = 4;
  itemsPerPage1 = 4;
  autoSlideInterval: any;
  autoSlideInterval1: any;

  get currentProducts1() {
    return this.products1.slice(
      this.currentIndex1,
      this.currentIndex1 + this.itemsPerPage1
    );
  }

  get currentProducts() {
    return this.products.slice(
      this.currentIndex,
      this.currentIndex + this.itemsPerPage
    );
  }

  nextSlide1() {
    if (this.currentIndex1 + this.itemsPerPage1 < this.products1.length) {
      this.currentIndex1 += this.itemsPerPage1;
    } else {
      this.currentIndex1 = 0;
    }
  }

  previousSlide1() {
    if (this.currentIndex1 - this.itemsPerPage1 >= 0) {
      this.currentIndex1 -= this.itemsPerPage1;
    } else {
      this.currentIndex1 = this.products1.length - this.itemsPerPage1;
    }
  }

  nextSlide() {
    if (this.currentIndex + this.itemsPerPage < this.products.length) {
      this.currentIndex += this.itemsPerPage;
    } else {
      this.currentIndex = 0;
    }
  }

  previousSlide() {
    if (this.currentIndex - this.itemsPerPage >= 0) {
      this.currentIndex -= this.itemsPerPage;
    } else {
      this.currentIndex = this.products.length - this.itemsPerPage;
    }
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 6000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  startAutoSlide1() {
    this.autoSlideInterval1 = setInterval(() => {
      this.nextSlide1();
    }, 6000);
  }

  stopAutoSlide1() {
    if (this.autoSlideInterval1) {
      clearInterval(this.autoSlideInterval1);
    }
  }

  productsList: any;
  selectedImage: string;
  thumbnails: string[] = [];

  constructor(private http: HttpService) {
    this.selectedImage = "./assets/images/man-watch-3.png";
    this.thumbnails = [
      "./assets/images/man-watch-3.png",
      "./assets/images/how-works-watch.png",
      "./assets/images/man-watch-2.png",
      "./assets/images/how-works-watch.png",
    ];
  }

  swapImages(clickedImage: string): void {
    this.selectedImage = clickedImage;
  }

  ngOnInit(): void {
    this.getAllProducts();
    this.startAutoSlide();
    this.startAutoSlide1();
  }

  ngOnDestroy(): void {
    this.stopAutoSlide();
    this.stopAutoSlide1();
  }

  getAllProducts() {
    this.http.getProducts().subscribe(
      (res) => {
        this.productsList = res.data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
