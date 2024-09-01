import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-detail-component',
  templateUrl: './product-detail-component.component.html',
  styleUrls: ['./product-detail-component.component.css']
})
export class ProductDetailComponentComponent implements OnInit{

  productDetail:any;

  ngOnInit(): void {
      this.productDetail=history.state.data;
  }

}
