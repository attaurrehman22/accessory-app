import { BrowserModule } from '@angular/platform-browser';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './views/website/home/home.component';
import { HeaderComponent } from './views/website/header/header.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip'
import { FindDreamComponentComponent } from "./views/website/find-dream-component/find-dream-component.component";
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


import { MatCheckboxModule } from '@angular/material/checkbox';
// import {MatExpansionModule} from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FindDreamComponentComponent,
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
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatIconModule,
    MatTooltipModule,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    HttpClientModule,
    NgxMasonryModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonToggleModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatCheckboxModule,
    // MatExpansionModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: (http: HttpClient) => { return new TranslateHttpLoader(http, './assets/i18n/', '.json'); },
            deps: [HttpClient]
        }
    }),
    
],
  providers: [TranslateService, provideAnimationsAsync()],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
