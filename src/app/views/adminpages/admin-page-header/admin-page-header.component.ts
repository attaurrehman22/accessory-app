import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { AdminSidebarComponent } from '../admin-sidebar/admin-sidebar.component';

@Component({
  selector: 'app-admin-page-header',
  templateUrl: './admin-page-header.component.html',
  styleUrl: './admin-page-header.component.css'
})
export class AdminPageHeaderComponent {
  constructor(
    private translateService: TranslateService,
    private router: Router,
    public alertService: AlertsServicesService
  ) {}
  gotoLogin() {
    localStorage.removeItem('Logged')
    localStorage.removeItem('user_token')
    localStorage.removeItem('isAdminUser')
    this.router.navigate(['/login'])
  }
}
