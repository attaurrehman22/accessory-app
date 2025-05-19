import { Component } from '@angular/core';

export interface CategoryData {
  name: any;
  slug: any;
  description: any;
  order: any;
  meta_title: any;
  meta_description: any;
  icon:any;
}

@Component({
  selector: 'app-accessory-category-group',
  templateUrl: './accessory-category-group.component.html',
  styleUrls: ['./accessory-category-group.component.css']
})
export class AccessoryCategoryGroupComponent {

}
