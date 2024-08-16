import { Component,HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isSmallScreen: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isSmallScreen = window.innerWidth <= 1500;
  }

  ngOnInit() {
    this.isSmallScreen = window.innerWidth <= 1500;
  }
}
