import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { HomeComponent } from './views/website/home/home.component';
import { AddNewProductComponent } from './views/website/add-new-product/add-new-product.component';
import { BuyProductComponentComponent } from './views/website/buy-product-component/buy-product-component.component';
import { ProductDetailComponentComponent } from './views/website/product-detail-component/product-detail-component.component';
import { ProductListComponent } from './views/website/product-list/product-list.component';
import { AdminHomeComponent } from './views/adminpages/admin-home/admin-home.component';
import { AdminProductsComponent } from './views/adminpages/admin-products/admin-products.component';
import { AdminAddProductComponent } from './views/adminpages/admin-add-product/admin-add-product.component';
import { AdminBrandsComponent } from './views/adminpages/admin-brands/admin-brands.component';
import { AdminCategoryComponent } from './views/adminpages/admin-category/admin-category.component';
import { AdminBrandsProductComponent } from './views/adminpages/admin-brands-product/admin-brands-product.component';
import { AdminCategoryProductComponent } from './views/adminpages/admin-category-product/admin-category-product.component';
import { BuyNowComponent } from './views/website/buy-now/buy-now.component';
import { CanDeactivateFormGuard } from './can-deactivate-form.guard';
import { ChatComponent } from './views/website/chat/chat/chat.component';
import { MyListingDetailsComponent } from './views/website/my-listing-details/my-listing-details.component';
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';
import { AdminUsersComponent } from './views/adminpages/admin-users/admin-users.component';
import { NewArrivalsComponent } from './views/website/new-arrivals/new-arrivals.component';
import { WatchOfTheDayComponent } from './views/adminpages/watch-of-the-day/watch-of-the-day.component';
import { AccessoriesProductsComponent } from './views/adminpages/accessories-products/accessories-products.component';
import { CreateAccessoriesProductComponent } from './views/adminpages/create-accessories-product/create-accessories-product.component';
import { adminGuard } from './guards/admin.guard';
import { TopBrandsLogosComponent } from './views/adminpages/top-brands-logos/top-brands-logos.component';
import { AccessoriesHomeComponent } from './views/accessoriespages/accessories-home/accessories-home.component';
import { AccessorieDetailComponent } from './views/accessoriespages/accessorie-detail/accessorie-detail.component';
import { AccessoryCategoriesComponent } from './views/adminpages/accessory-categories/accessory-categories.component';
import { AccessoryCategoryGroupComponent } from './views/adminpages/accessory-category-group/accessory-category-group.component';
import { AccessorySubCategoryGroupComponent } from './views/adminpages/accessory-sub-category-group/accessory-sub-category-group.component';
import { AttributeComponent } from './views/adminpages/accessories/attributes/attribute/attribute.component';
import { AttributeValuesComponent } from './views/adminpages/accessories/attributes/attribute-values/attribute-values.component';
import { InventoriesComponent } from './views/adminpages/accessories/attributes/inventories/inventories.component';
import { AttributeListingComponent } from './views/adminpages/accessories/attributes/attribute-listing/attribute-listing.component';
import { ChangePasswordComponent } from './views/auth/change-password/change-password.component';
import { AccessoryImagesListingComponent } from './views/adminpages/accessories/accessory-images-listing/accessory-images-listing.component';
import { AttributeInventoryComponent } from './views/adminpages/attribute-inventory/attribute-inventory.component';
import { PayoutConfirmationComponent } from './views/website/payout-confirmation/payout-confirmation.component';
import { AccessorySummaryComponent } from './views/website/accessory-summary/accessory-summary.component';
import { ProfileComponent } from './views/website/my-listing/profile/profile.component';
import { ShippingAddressComponent } from './views/website/my-listing/shipping-address/shipping-address.component';
import { MessageComponent } from './views/website/my-listing/message/message.component';
import { ListingComponent } from './views/website/my-listing/listing/listing.component';
import { FavoriteComponent } from './views/website/my-listing/favorite/favorite.component';
import { SellOrderComponent } from './views/website/my-listing/sell-order/sell-order.component';
import { BuyOrderComponent } from './views/website/my-listing/buy-order/buy-order.component';
import { SellOrderDetailsComponent } from './views/website/my-listing/sell-order-details/sell-order-details.component';
import { BuyOrderDetailsComponent } from './views/website/my-listing/buy-order-details/buy-order-details.component';
import { AdminReportsComponent } from './views/adminpages/admin-reports/admin-reports.component';
import { AdminOrdersComponent } from './views/adminpages/admin-orders/admin-orders.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component:  RegisterComponent},
  { path: '', component:  HomeComponent},
  { path: 'new-product', component:  AddNewProductComponent,
    canDeactivate: [CanDeactivateFormGuard]},
  { path: 'buy-product', component:  BuyProductComponentComponent},
  { path: 'product-list', component:  ProductListComponent},
  { path: 'product-detail', component:  ProductDetailComponentComponent},
  { path: 'newArrivals', component:  NewArrivalsComponent},
  
  {  canActivate: [adminGuard],path: 'admin/dashboard', component:  AdminHomeComponent},
  {  canActivate: [adminGuard],path: 'admin/products', component:  AdminProductsComponent},
  {  canActivate: [adminGuard],path: 'admin/product/add', component:  AdminAddProductComponent},
  {  canActivate: [adminGuard],path: 'admin/brands', component:  AdminBrandsComponent},
  {  canActivate: [adminGuard],path: 'admin/brands/product', component:  AdminBrandsProductComponent},
  {  canActivate: [adminGuard],path: 'admin/category', component:  AdminCategoryComponent},
  {  canActivate: [adminGuard],path: 'admin/category/product', component:  AdminCategoryProductComponent},
  {  canActivate: [adminGuard],path: 'admin/users', component:  AdminUsersComponent},
  {  canActivate: [adminGuard],path: 'admin/watchOfDay', component:  WatchOfTheDayComponent},
  {  canActivate: [adminGuard],path: 'admin/accessories', component:  AccessoriesProductsComponent},
  {  canActivate: [adminGuard],path: 'admin/accessories/add', component:  CreateAccessoriesProductComponent},
  {  canActivate: [adminGuard],path: 'admin/top/brands', component:  TopBrandsLogosComponent},
  {  canActivate: [adminGuard],path: 'admin/accessory/categories', component:  AccessoryCategoriesComponent},
  {  canActivate: [adminGuard],path: 'admin/group', component:  AccessoryCategoryGroupComponent},
  {  canActivate: [adminGuard],path: 'admin/sub-group', component:  AccessorySubCategoryGroupComponent},
  {  canActivate: [adminGuard],path: 'admin/attributes', component:  AttributeComponent},
  {  canActivate: [adminGuard],path: 'admin/attribute-values', component:  AttributeValuesComponent},
  {  canActivate: [adminGuard],path: 'admin/inventory', component:  InventoriesComponent},
  {  canActivate: [adminGuard],path: 'admin/attribute-listing', component:  AttributeListingComponent},
  {  canActivate: [adminGuard],path: 'admin/images-listing', component:  AccessoryImagesListingComponent},
  {  canActivate: [adminGuard],path: 'admin/attribute-inventory', component:  AttributeInventoryComponent},
  {  canActivate: [adminGuard],path: 'admin/reports', component:  AdminReportsComponent},
  {  canActivate: [adminGuard],path: 'admin/orders', component:  AdminOrdersComponent},


  { path: 'accessories/home', component:  AccessoriesHomeComponent},
  { path: 'accessories/details', component:  AccessorieDetailComponent},

 { path: 'change-password', component:  ChangePasswordComponent},
  { path: 'buy-now', component:  BuyNowComponent},
  // { path: 'myListing', component:  MyListingDetailsComponent},


  {
    path: 'myprofile',
    component: MyListingDetailsComponent, // parent container (with sidebar)
    children: [
      { path: '', component: ProfileComponent, pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'shipping', component: ShippingAddressComponent },
      { path: 'message', component: MessageComponent },
      { path: 'listing', component: ListingComponent },
      { path: 'favorite', component: FavoriteComponent },
      { path: 'sell/order', component: SellOrderComponent },
      { path: 'sell/order/details', component: SellOrderDetailsComponent },
      { path: 'buy/order', component: BuyOrderComponent },
      { path: 'buy/order/details', component: BuyOrderDetailsComponent },
    ],
  },


  { path: 'forgotPassword', component:  ForgotPasswordComponent},
  { path: 'payment-callback', component:  MyListingDetailsComponent},
  {path:'payment-confirmation',component:PayoutConfirmationComponent},
  {path:'myprofile/summary',component:AccessorySummaryComponent},
  {path:'chat',component:ChatComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
