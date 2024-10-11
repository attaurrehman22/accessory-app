import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { HomeComponent } from './views/website/home/home.component';
import { AddNewProductComponent } from './views/website/add-new-product/add-new-product.component';
import { BuyProductComponentComponent } from './views/website/buy-product-component/buy-product-component.component';
import { ProductDetailComponentComponent } from './views/website/product-detail-component/product-detail-component.component';
import { ProductListComponent } from './views/website/product-list/product-list.component';
import { PopularBrandsListAlphabeticallyComponent } from './views/website/popular-brands-list-alphabetically/popular-brands-list-alphabetically.component';
import { AdminHomeComponent } from './views/adminpages/admin-home/admin-home.component';
import { AdminProductsComponent } from './views/adminpages/admin-products/admin-products.component';
import { AdminAddProductComponent } from './views/adminpages/admin-add-product/admin-add-product.component';
import { AdminBrandsComponent } from './views/adminpages/admin-brands/admin-brands.component';
import { AdminCategoryComponent } from './views/adminpages/admin-category/admin-category.component';
import { AdminBrandsProductComponent } from './views/adminpages/admin-brands-product/admin-brands-product.component';
import { AdminCategoryProductComponent } from './views/adminpages/admin-category-product/admin-category-product.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component:  RegisterComponent},
  { path: '', component:  HomeComponent},
  { path: 'new-product', component:  AddNewProductComponent},
  { path: 'buy-product', component:  BuyProductComponentComponent},
  { path: 'product-list', component:  ProductListComponent},
  { path: 'product-detail', component:  ProductDetailComponentComponent},
  { path: 'popular-brands-list', component:  PopularBrandsListAlphabeticallyComponent},
  { path: 'admin/dashboard', component:  AdminHomeComponent},
  { path: 'admin/products', component:  AdminProductsComponent},
  { path: 'admin/product/add', component:  AdminAddProductComponent},
  { path: 'admin/brands', component:  AdminBrandsComponent},
  { path: 'admin/brands-product', component:  AdminBrandsProductComponent},
  { path: 'admin/category', component:  AdminCategoryComponent},
  { path: 'admin/category-product', component:  AdminCategoryProductComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
