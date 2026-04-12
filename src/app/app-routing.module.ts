import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./views/auth/login/login.component";
import { RegisterComponent } from "./views/auth/register/register.component";
import { AdminHomeComponent } from "./views/adminpages/admin-home/admin-home.component";
import { CanDeactivateFormGuard } from "./can-deactivate-form.guard";
import { MyListingDetailsComponent } from "./views/website/my-listing-details/my-listing-details.component";
import { ForgotPasswordComponent } from "./views/auth/forgot-password/forgot-password.component";
import { AdminUsersComponent } from "./views/adminpages/admin-users/admin-users.component";
import { AccessoriesProductsComponent } from "./views/adminpages/accessories-products/accessories-products.component";
import { CreateAccessoriesProductComponent } from "./views/adminpages/create-accessories-product/create-accessories-product.component";
import { adminGuard } from "./guards/admin.guard";
import { AccessoriesHomeComponent } from "./views/accessoriespages/accessories-home/accessories-home.component";
import { AccessorieDetailComponent } from "./views/accessoriespages/accessorie-detail/accessorie-detail.component";
import { AccessoryCategoriesComponent } from "./views/adminpages/accessory-categories/accessory-categories.component";
import { AccessoryCategoryGroupComponent } from "./views/adminpages/accessory-category-group/accessory-category-group.component";
import { AccessorySubCategoryGroupComponent } from "./views/adminpages/accessory-sub-category-group/accessory-sub-category-group.component";
import { AttributeComponent } from "./views/adminpages/accessories/attributes/attribute/attribute.component";
import { AttributeValuesComponent } from "./views/adminpages/accessories/attributes/attribute-values/attribute-values.component";
import { InventoriesComponent } from "./views/adminpages/accessories/attributes/inventories/inventories.component";
import { AttributeListingComponent } from "./views/adminpages/accessories/attributes/attribute-listing/attribute-listing.component";
import { ChangePasswordComponent } from "./views/auth/change-password/change-password.component";
import { AccessoryImagesListingComponent } from "./views/adminpages/accessories/accessory-images-listing/accessory-images-listing.component";
import { AttributeInventoryComponent } from "./views/adminpages/attribute-inventory/attribute-inventory.component";
import { AccessorySummaryComponent } from "./views/website/accessory-summary/accessory-summary.component";
import { ProfileComponent } from "./views/website/my-listing/profile/profile.component";
import { ShippingAddressComponent } from "./views/website/my-listing/shipping-address/shipping-address.component";
import { MessageComponent } from "./views/website/my-listing/message/message.component";
import { ListingComponent } from "./views/website/my-listing/listing/listing.component";
import { FavoriteComponent } from "./views/website/my-listing/favorite/favorite.component";
import { SellOrderComponent } from "./views/website/my-listing/sell-order/sell-order.component";
import { BuyOrderComponent } from "./views/website/my-listing/buy-order/buy-order.component";
import { SellOrderDetailsComponent } from "./views/website/my-listing/sell-order-details/sell-order-details.component";
import { BuyOrderDetailsComponent } from "./views/website/my-listing/buy-order-details/buy-order-details.component";
import { ChronosouqUsersComponent } from "./views/adminpages/chronosouq-users/chronosouq-users.component";
import { AdminVatComponent } from "./views/adminpages/admin-vat/admin-vat.component";
import { ReportsComponent } from "./views/website/my-listing/reports/reports.component";
import { ReportDetailsComponent } from "./views/website/my-listing/report-details/report-details.component";

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  // Root URL must use pathMatch: 'full' or the empty path may not activate reliably.
  { path: "accessories/home", pathMatch: "full", redirectTo: "/" },
  { path: "", pathMatch: "full", component: AccessoriesHomeComponent },
  {
    canActivate: [adminGuard],
    path: "admin/dashboard",
    component: AdminHomeComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/users",
    component: AdminUsersComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/accessories",
    component: AccessoriesProductsComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/accessories/add",
    component: CreateAccessoriesProductComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/accessory/categories",
    component: AccessoryCategoriesComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/group",
    component: AccessoryCategoryGroupComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/sub-group",
    component: AccessorySubCategoryGroupComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/attributes",
    component: AttributeComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/attribute-values",
    component: AttributeValuesComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/inventory",
    component: InventoriesComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/attribute-listing",
    component: AttributeListingComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/images-listing",
    component: AccessoryImagesListingComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/attribute-inventory",
    component: AttributeInventoryComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/chronosouq-users",
    component: ChronosouqUsersComponent,
  },
  {
    canActivate: [adminGuard],
    path: "admin/vat",
    component: AdminVatComponent,
  },
  { path: "accessories/details", component: AccessorieDetailComponent },

  { path: "change-password", component: ChangePasswordComponent },
  // { path: 'myListing', component:  MyListingDetailsComponent},

  {
    path: "myprofile",
    component: MyListingDetailsComponent, // parent container (with sidebar)
    children: [
      { path: "", component: ProfileComponent, pathMatch: "full" },
      { path: "profile", component: ProfileComponent },
      { path: "shipping", component: ShippingAddressComponent },
      { path: "message", component: MessageComponent },
      { path: "listing", component: ListingComponent },
      { path: "favorite", component: FavoriteComponent },
      { path: "sell/order", component: SellOrderComponent },
      { path: "sell/order/details", component: SellOrderDetailsComponent },
      { path: "buy/order", component: BuyOrderComponent },
      { path: "buy/order/details", component: BuyOrderDetailsComponent },
      { path: "reports", component: ReportsComponent },
      { path: "reports/:id", component: ReportDetailsComponent },
    ],
  },

  { path: "forgotPassword", component: ForgotPasswordComponent },
  { path: "payment-callback", component: MyListingDetailsComponent },
  { path: "myprofile/summary", component: AccessorySummaryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
