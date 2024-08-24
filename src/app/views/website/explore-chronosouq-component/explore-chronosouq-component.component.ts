import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-explore-chronosouq-component',
  templateUrl: './explore-chronosouq-component.component.html',
  styleUrl: './explore-chronosouq-component.component.css',
})
export class ExploreChronosouqComponentComponent {
  constructor(private translateService: TranslateService) {
    const supportedLanguages = ["en", "ar"]; // Add other languages if necessary
    this.translateService.addLangs(supportedLanguages);
    this.translateService.setDefaultLang('en');

    const browserLang = this.translateService.getBrowserLang();
    if (supportedLanguages.includes(browserLang)) {
      this.translateService.use(browserLang);
    }
  }

  useLang(lang: string) {
    this.translateService.use(lang);
  }


  masonryOptions = {
    transitionDuration: '0.8s',
    gutter: 20,
    horizontalOrder: true,
    fitWidth: true
  };

  watchCategories = [
    { title: 'Men’s Watches', subtitle: 'Read More', image: 'assets/mens-watch.jpg' },
    { title: 'Pre-Owned', subtitle: 'Watches', image: 'assets/pre-owned.jpg' },
    { title: 'Pocket', subtitle: 'Watches', image: 'assets/pocket-watch.jpg' },
    { title: 'Women’s', subtitle: 'Watches', image: 'assets/womens-watch.jpg' },
    { title: 'Automatic', subtitle: 'Watches', image: 'assets/automatic-watch.jpg' },
    { title: 'Gold', subtitle: 'Watches', image: 'assets/gold-watch.jpg' },
    { title: 'Moon', subtitle: 'Watches', image: 'assets/moon-watch.jpg' },
  ];
}
