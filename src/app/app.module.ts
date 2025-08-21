import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './views/website/home/home.component';
import { HeaderComponent } from './views/website/header/header.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip'
// import { FindDreamComponentComponent } from "./views/website/find-dream-component/find-dream-component.component";
import { eamFindDreamComponentComponent } from './views/website/find-dream-component/find-dream-component.component';
import { PopularBrandsComponentComponent } from "./views/website/popular-brands-component/popular-brands-component.component";
import { ChronosouqBuyerProtectionComponentComponent } from "./views/website/chronosouq-buyer-protection-component/chronosouq-buyer-protection-component.component";
import { MostPopularModelsComponentComponent } from "./views/website/most-popular-models-component/most-popular-models-component.component";
import { ExploreChronosouqComponentComponent } from "./views/website/explore-chronosouq-component/explore-chronosouq-component.component";
import { HowWorksComponentComponent } from "./views/website/how-works-component/how-works-component.component";
import { PeopleSyaingComponentComponent } from "./views/website/people-syaing-component/people-syaing-component.component";
import { StayLoopComponentComponent } from "./views/website/stay-loop-component/stay-loop-component.component";
import { FooterComponentComponent } from "./views/website/footer-component/footer-component.component";
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgxMasonryModule } from 'ngx-masonry';
import { AddNewProductComponent } from './views/website/add-new-product/add-new-product.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import {MatExpansionModule} from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
// import {MatExpansionModule} from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { ProductDetailComponentComponent } from './views/website/product-detail-component/product-detail-component.component';
import { BuyProductComponentComponent } from './views/website/buy-product-component/buy-product-component.component';
import { SecondHeaderComponent } from "./views/website/second-header/second-header.component";
import { ProductListComponent } from './views/website/product-list/product-list.component';
import { FormsModule } from '@angular/forms';
import { BidiModule } from '@angular/cdk/bidi';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { ModelLoginComponent } from './views/auth/model-login/model-login.component';
import { ModelRegisterComponent } from './views/auth/model-register/model-register.component';
import { AdminHomeComponent } from './views/adminpages/admin-home/admin-home.component';
import { AdminNavbarComponent } from './views/adminpages/admin-navbar/admin-navbar.component';
import { AdminSidebarComponent } from './views/adminpages/admin-sidebar/admin-sidebar.component';
import { AdminProductsComponent } from './views/adminpages/admin-products/admin-products.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AdminAddProductComponent } from './views/adminpages/admin-add-product/admin-add-product.component';
import { AdminBrandsComponent } from './views/adminpages/admin-brands/admin-brands.component';
import { AdminCategoryComponent } from './views/adminpages/admin-category/admin-category.component';
import { AdminBrandsProductComponent } from './views/adminpages/admin-brands-product/admin-brands-product.component';
import { AdminCategoryProductComponent } from './views/adminpages/admin-category-product/admin-category-product.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatSidenav } from '@angular/material/sidenav';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import {MatExpansionModule} from '@angular/material/expansion';
import { AdminPageHeaderComponent } from "./views/adminpages/admin-page-header/admin-page-header.component";
import { PositiveNumberDirective } from 'src/directives/positiveNumberDirective/positive-number.directive';
import {MatRadioModule} from '@angular/material/radio';
import { ChatComponent } from './views/website/chat/chat/chat.component';
import { CustomOfferComponent } from './views/modal/custom-offer/custom-offer.component';
import { AddShippingComponent } from './views/modal/add-shipping/add-shipping.component';
import { MyListingDetailsComponent } from './views/website/my-listing-details/my-listing-details.component';
import { ForgotPasswordComponent } from './views/auth/forgot-password/forgot-password.component';
import { FieldLimitIntoHunderedDirective } from './views/directives/hundered-character-limit/field-limit-into-hundered.directive';
import { OnlyCharacterLimitThirtyDirective } from './views/directives/only-character-limit-thirty/only-character-limit-thirty.directive';
import { PriceLimitDirective } from './views/directives/price-limit/price-limit.directive';
import { AdminUsersComponent } from './views/adminpages/admin-users/admin-users.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { authInterceptorInterceptor } from './auth-interceptor.interceptor';
import { NgImageSliderModule } from 'ng-image-slider';
import { NewArrivalsComponent } from './views/website/new-arrivals/new-arrivals.component';
import { ConfirmationModelComponent } from './views/modal/confirmation-model/confirmation-model.component';
import { WatchOfTheDayComponent } from './views/adminpages/watch-of-the-day/watch-of-the-day.component';
import { AddProductWatchOfTheDayComponent } from './views/adminpages/add-product-watch-of-the-day/add-product-watch-of-the-day.component';
import { SkeletonLoaderComponent } from './views/modal/skeleton-loader/skeleton-loader.component';
import { SafeHtmlPipe } from './views/pipes/safe-html.pipe';
import {MatTabsModule} from '@angular/material/tabs';
import { AccessoriesProductsComponent } from './views/adminpages/accessories-products/accessories-products.component';
import { CreateAccessoriesProductComponent } from './views/adminpages/create-accessories-product/create-accessories-product.component';
import { UsernameValidationDirective } from './views/directives/username-validation/username-validation.directive';
import { AddEditPromotionComponent } from './views/adminpages/add-edit-promotion/add-edit-promotion.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TopBrandsLogosComponent } from './views/adminpages/top-brands-logos/top-brands-logos.component';


// ✅ Firebase imports
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

import { environment } from '../environments/environment';
import { OrderInitiatedModelComponent } from './views/modal/order-initiated-model/order-initiated-model.component';
import { TrimInputDirective } from './views/directives/trim-spaces/trim-input.directive';
import { RejectProductModalComponent } from './views/modal/reject-product-modal/reject-product-modal.component';
import { AccessoriesHomeComponent } from './views/accessoriespages/accessories-home/accessories-home.component';
import { HeroPageComponent } from './views/accessoriespages/hero-page/hero-page.component';
import { AccessoriesNewArrivalsComponent } from './views/accessoriespages/accessories-new-arrivals/accessories-new-arrivals.component';
import { AccessorieDetailComponent } from './views/accessoriespages/accessorie-detail/accessorie-detail.component';
import { ShoppingCartComponent } from './views/modal/shopping-cart/shopping-cart.component';
import { AccessoryCategoriesComponent } from './views/adminpages/accessory-categories/accessory-categories.component';
import { AddAccessoryCategoryComponent } from './views/adminpages/add-accessory-category/add-accessory-category.component';
import { AccessoryCategoryGroupComponent } from './views/adminpages/accessory-category-group/accessory-category-group.component';
import { AddAccessoryCategoryGroupComponent } from './views/adminpages/add-accessory-category-group/add-accessory-category-group.component';
import { AddAccessorySubCategoryGroupComponent } from './views/adminpages/add-accessory-sub-category-group/add-accessory-sub-category-group.component';
import { AccessorySubCategoryGroupComponent } from './views/adminpages/accessory-sub-category-group/accessory-sub-category-group.component';
import { AddAttributeComponent } from './views/adminpages/accessories/attributes/add-attribute/add-attribute.component';
import { AttributeComponent } from './views/adminpages/accessories/attributes/attribute/attribute.component';
import { AddAttributeValuesComponent } from './views/adminpages/accessories/attributes/add-attribute-values/add-attribute-values.component';
import { AttributeValuesComponent } from './views/adminpages/accessories/attributes/attribute-values/attribute-values.component';
import { AddInventoryComponent } from './views/adminpages/accessories/attributes/add-inventory/add-inventory.component';
import { InventoriesComponent } from './views/adminpages/accessories/attributes/inventories/inventories.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AddAttributeListingComponent } from './views/adminpages/accessories/attributes/add-attribute-listing/add-attribute-listing.component';
import { AttributeListingComponent } from './views/adminpages/accessories/attributes/attribute-listing/attribute-listing.component';
import { ChangePasswordComponent } from './views/auth/change-password/change-password.component';
import { AccessoryImagesListingComponent } from './views/adminpages/accessories/accessory-images-listing/accessory-images-listing.component';
import { AddAccessoryImagesListingComponent } from './views/adminpages/accessories/add-accessory-images-listing/add-accessory-images-listing.component';
import { AttributeInventoryComponent } from './views/adminpages/attribute-inventory/attribute-inventory.component';
import { AddAttributeInventoryComponent } from './views/adminpages/add-attribute-inventory/add-attribute-inventory.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AccessoryAttachImagesComponent } from './views/adminpages/accessory-attach-images/accessory-attach-images.component';
import { AccessorySummaryComponent } from './views/website/accessory-summary/accessory-summary.component';
import { PayoutConfirmationComponent } from './views/website/payout-confirmation/payout-confirmation.component';
import { ProfileComponent } from './views/website/my-listing/profile/profile.component';
import { ShippingAddressComponent } from './views/website/my-listing/shipping-address/shipping-address.component';
import { MessageComponent } from './views/website/my-listing/message/message.component';
import { ListingComponent } from './views/website/my-listing/listing/listing.component';
import { FavoriteComponent } from './views/website/my-listing/favorite/favorite.component';
import { SellOrderComponent } from './views/website/my-listing/sell-order/sell-order.component';
import { BuyOrderComponent } from './views/website/my-listing/buy-order/buy-order.component';
import { SellOrderDetailsComponent } from './views/website/my-listing/sell-order-details/sell-order-details.component';
import { BuyOrderDetailsComponent } from './views/website/my-listing/buy-order-details/buy-order-details.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    eamFindDreamComponentComponent,
    FooterComponentComponent,
    StayLoopComponentComponent,
    PeopleSyaingComponentComponent,
    HowWorksComponentComponent,
    ExploreChronosouqComponentComponent,
    MostPopularModelsComponentComponent,
    ChronosouqBuyerProtectionComponentComponent,
    PopularBrandsComponentComponent,
    AddNewProductComponent,
    LoginComponent,
    RegisterComponent,
    ProductDetailComponentComponent,
    BuyProductComponentComponent,
    SecondHeaderComponent,
    ProductListComponent,
    ModelLoginComponent,
    ModelRegisterComponent,
    AdminHomeComponent,
    AdminSidebarComponent,
    AdminNavbarComponent,
    AdminPageHeaderComponent,
    AdminProductsComponent,
    AdminAddProductComponent,
    AdminBrandsComponent,
    AdminCategoryComponent,
    AdminBrandsProductComponent,
    AdminCategoryProductComponent,
    PositiveNumberDirective,
    ChatComponent,
    CustomOfferComponent,
    AddShippingComponent,
    MyListingDetailsComponent,
    ForgotPasswordComponent,
    FieldLimitIntoHunderedDirective,
    OnlyCharacterLimitThirtyDirective,
    PriceLimitDirective,
    AdminUsersComponent,
    NewArrivalsComponent,
    ConfirmationModelComponent,
    WatchOfTheDayComponent,
    AddProductWatchOfTheDayComponent,
    SkeletonLoaderComponent,
    SafeHtmlPipe,
    AccessoriesProductsComponent,
    CreateAccessoriesProductComponent,
    UsernameValidationDirective,
    AddEditPromotionComponent,
    TopBrandsLogosComponent,
    OrderInitiatedModelComponent,
    TrimInputDirective,
    RejectProductModalComponent,
    AccessoriesHomeComponent,
    HeroPageComponent,
    AccessoriesNewArrivalsComponent,
    AccessorieDetailComponent,
    ShoppingCartComponent,
    AccessoryCategoriesComponent,
    AddAccessoryCategoryComponent,
    AccessoryCategoryGroupComponent,
    AddAccessoryCategoryGroupComponent,
    AddAccessorySubCategoryGroupComponent,
    AccessorySubCategoryGroupComponent,
    AddAttributeComponent,
    AttributeComponent,
    AddAttributeValuesComponent,
    AttributeValuesComponent,
    AddInventoryComponent,
    InventoriesComponent,
    AttributeListingComponent,
    AddAttributeListingComponent,
    ChangePasswordComponent,
    AccessoryImagesListingComponent,
    AddAccessoryImagesListingComponent,
    AttributeInventoryComponent,
    AddAttributeInventoryComponent,
    AccessoryAttachImagesComponent,
    AccessorySummaryComponent,
    PayoutConfirmationComponent,
    ProfileComponent,
    ShippingAddressComponent,
    MessageComponent,
    ListingComponent,
    FavoriteComponent,
    SellOrderComponent,
    BuyOrderComponent,
    SellOrderDetailsComponent,
    BuyOrderDetailsComponent
  ],
  imports: [
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    ChartModule,
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    HttpClientModule,
    NgxMasonryModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    FormsModule,
    MatDividerModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    RouterModule,
    MatDialogModule,
    MatMenuModule,
    MatSidenav,
    CarouselModule,
    ButtonModule,
    TagModule,
    MatRadioModule,
    NgImageSliderModule,
    MatExpansionModule,
    ColorPickerModule,
    BidiModule,HighchartsChartModule,
    MatTabsModule,
    DragDropModule,
    NgxImageZoomModule,
    BidiModule, HighchartsChartModule,MatOptionModule,MatAutocompleteModule,
    // MatExpansionModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) => { return new TranslateHttpLoader(http, './assets/i18n/', '.json'); },
            deps: [HttpClient]
        }
    })
],
providers: [
  TranslateService,
  provideAnimationsAsync(),
  provideHttpClient(withInterceptors([authInterceptorInterceptor])),

  // ✅ Move Firebase setup to `providers`
  {
    provide: 'FIREBASE_APP',
    useFactory: () => initializeApp(environment.firebase)
  },
  {
    provide: 'FIREBASE_AUTH',
    useFactory: () => getAuth()
  }
],
bootstrap: [AppComponent],
schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}