import { Component, OnInit } from '@angular/core';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-payout-confirmation',
  templateUrl: './payout-confirmation.component.html',
  styleUrls: ['./payout-confirmation.component.css']
})
export class PayoutConfirmationComponent implements OnInit{
  paymentId:any
  status: string | null = null;
  message: string | null = null;
  constructor(private http:HttpService,private alertService:AlertsServicesService){}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('paymentId');
    if (paymentId) {
      localStorage.setItem('paymentId', paymentId);
      this.handlePaymentCallback(null);
    }
    this.paymentId = localStorage.getItem('paymentId');
  }

    // Handle payment callback
    handlePaymentCallback(orderId: string) {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentId = urlParams.get('paymentId') || localStorage.getItem('paymentId');
  
      if (paymentId) {
        this.http.paymentCallback(paymentId).subscribe(
          (response) => {
            console.log('Payment callback response:', response);
            this.status = response?.status || 'pending';
            this.message = response?.message || null;
  
            // Optional: show alert
            if (this.status === 'success' || response?.payment_status === 'completed') {
              this.alertService.showAlert("success", "Payment completed successfully!");
            } else if (this.status === 'failed' || response?.payment_status === 'failed') {
              this.alertService.showAlert("warning", "Payment failed. Please try again.");
            } else {
              this.alertService.showAlert("info", "Payment status: " + this.status);
            }
  
            // Clear stored data
            localStorage.removeItem('pendingPaymentOrderId');
            localStorage.removeItem('paymentId');
          },
          (error) => {
            console.error('Payment callback error:', error);
            this.status = 'error';
            this.message = 'Error checking payment status. Please contact support.';
            this.alertService.showAlert("warning", this.message);
          }
        );
      }
    }

  // Check payment status for a specific order
  checkOrderPaymentStatus(orderId: string) {
    if (orderId) {
      // You can implement this method to check payment status for a specific order
      // This might involve calling a different API endpoint
      console.log('Checking payment status for order:', orderId);
      
      // For now, we'll use the callback method with a stored payment ID
      const paymentId = localStorage.getItem('paymentId');
      if (paymentId) {
        this.handlePaymentCallback(orderId);
      }
    }
  }

  // Manual payment status check (can be called from UI)
  refreshPaymentStatus() {
    const pendingOrderId = localStorage.getItem('pendingPaymentOrderId');
    if (pendingOrderId) {
      this.checkOrderPaymentStatus(pendingOrderId);
    } else {
      this.alertService.showAlert("info", "No pending payment found.");
    }
  }
}
