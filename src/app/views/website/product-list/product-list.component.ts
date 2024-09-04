import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit{

  watches = [
    { name: 'Rolex', model: 'GMT-Master II', price: 9741, image: '../assets/images/recommonded-1.png' },
    { name: 'Rolex', model: 'Daytona', price: 14650, image: '../assets/images/recommonded-1.png' },
    { name: 'Rolex', model: 'Submariner', price: 7636, image: '../assets/images/recommonded-1.png' },
    { name: 'Rolex', model: 'Datejust', price: 2314, image: '../assets/images/recommonded-1.png' },
    { name: 'Rolex', model: 'Day-Date', price: 8596, image: '../assets/images/recommonded-1.png' }
  ];

  productsList:any;
  title = 'chronowatch';

  ngOnInit(): void {
    this.getAllProducts();
  }

  constructor(private http: HttpService,private router:Router){}

  getCarouselSlides() {
    const slides = [];
    for (let i = 0; i < this.watches.length; i += 4) {
      slides.push(this.watches.slice(i, i + 4));
    }
    return slides;
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

  routeTo(){
    this.router.navigate(['/buy-product'])
  }



  expandedIndex: number | null = null;

  // List of questions and answers
  questions = [
    { question: 'Why are Rolex watches so expensive?', answer: 'Rolex watches are made from premium materials and crafted with precision and expertise.' },
    { question: 'What is the most expensive Rolex watch of all time?', answer: 'The most expensive Rolex ever sold is the Paul Newman Daytona, which fetched over $17 million.' },
    { question: 'How much does a Rolex watch cost?', answer: 'Prices for Rolex watches start at around $2,000 USD, but can exceed $1 million USD for rare models.' }
  ];

  // Method to toggle the display of the answer
  toggleAnswer(index: number) {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

}
