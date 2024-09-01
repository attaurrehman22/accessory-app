import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { HomeComponent } from './views/website/home/home.component';
import { AddNewProductComponent } from './views/website/add-new-product/add-new-product.component';
import { BuyProductComponentComponent } from './views/website/buy-product-component/buy-product-component.component';
import { ProductDetailComponentComponent } from './views/website/product-detail-component/product-detail-component.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component:  RegisterComponent},
  { path: '', component:  HomeComponent},
  { path: 'new-product', component:  AddNewProductComponent},
  { path: 'buy-product', component:  BuyProductComponentComponent},
  { path: 'product-detail', component:  ProductDetailComponentComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
