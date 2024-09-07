import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsServicesService {
  private alertSubject = new BehaviorSubject<{ type: string; message: string } | null>(null);
  alert$ = this.alertSubject.asObservable();
  private alertTimeout: any; // Variable to hold the timeout reference

  showAlert(type: 'success' | 'danger' | 'warning' | 'info', message: string, duration: number = 4000) {
    this.alertSubject.next({ type, message });

    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }

    this.alertTimeout = setTimeout(() => {
      this.clearAlert();
    }, duration);
  }

  clearAlert() {
    this.alertSubject.next(null);
  }
}
