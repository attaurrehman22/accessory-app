import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-accessory-summary',
  templateUrl: './accessory-summary.component.html',
  styleUrls: ['./accessory-summary.component.css']
})
export class AccessorySummaryComponent implements OnInit {
  apiUrl = environment.apipath + '/';
  order_id: any;
  totalAmount = 361.50;
  shippingCharges = 25.50;
  totalPayout = 386.00;
  lugWidth=[];
  Buckle=[];
  Length=[];
  Color:any;
  ngOnInit(): void {
    this.getCartList();
  }
  cartItems:any;
  getCartList() {
    this.http.getCartList().subscribe((res) => {
      this.cartItems = res.items;
      this.totalAmount = res.total_amount ? res.total_amount : 0;
      this.shippingCharges = res.shipping_charges ? res.shipping_charges : 0;
      this.totalPayout = res.total_amount ? res.total_amount : 0;
      if(this.cartItems){
        this.cartItems = this.cartItems?.map((item: any) => {
          item.accessory.main_image = item.accessory.main_image.replace(/\\/g, "");
          return item;
        });
        this.Buckle = res?.items[0]?.accessory?.inventories[0]?.attribute_values;
        this.Length = res?.items[0]?.accessory?.inventories;
        this.Color = res?.items[0]?.accessory?.inventories[0]?.attribute_values;
        Object.values(res?.items[0]?.accessory?.attributes || {}).forEach(attrObj => {
          if (attrObj && typeof attrObj === 'object') {
            this.lugWidth.push(...Object.keys(attrObj));
          }
        });

        // this.cartItems = this.cartItems?.map((item: any) => {
        //   item.accessory.additional_images = item.accessory.additional_images.map((image: any) => {
        //     image.image = image.image.replace(/\\/g, "");
        //     return image;
        //   });
        //   return item;
        // });
      }
    });
  }

  constructor(private http:HttpService,private alertService:AlertsServicesService,private router:Router){}

 
  goBack() {
    // Handle back navigation
    this.router.navigate(['/myListing'], 
      { 
        state: {
          activeRouteType: 'cart'
        }
       });
  }

  paymentId: any;

  payNow() {
        // const formData = {
        //   order_id: this.order_id,
        // }
      // this.http.paymentInitiate(formData).subscribe(
      //     (res) => {
      //     if(res?.payment_url){
      //       const paymentUrl = res?.payment_url.replace(/\\/g, "");
      //       console.log("paymentUrl",paymentUrl);
            
      //       // Store order ID for callback handling
      //       localStorage.setItem('pendingPaymentOrderId', res?.order_id);
      //       this.paymentId = res?.payment_id;
      //       // Add return URL to payment URL if not already present
      //       let finalPaymentUrl = paymentUrl;
      //       if (!paymentUrl.includes('returnUrl') && !paymentUrl.includes('callback')) {
      //         const returnUrl = encodeURIComponent(window.location.origin + '/payment-callback');
      //         finalPaymentUrl = paymentUrl + (paymentUrl.includes('?') ? '&' : '?') + 'returnUrl=' + returnUrl;
      //       }
            
      //       // Open payment URL in new window
      //       const paymentWindow = window.open(finalPaymentUrl, "_blank");
            
      //       // Set up polling to check payment status
      //       this.checkPaymentStatus(res?.order_id, paymentWindow);
      //     }
      //     console.log("res",res);
      //   });

       this.http.confirmCartOrder().subscribe(
      (res) => {
      this.alertService.showAlert("success", "Order confirmed");
      console.log("res",res);
      if(res?.order_id){
        const formData = {
          order_id: res?.order_id,
        }
        this.http.paymentInitiate(formData).subscribe(
          (res) => {
          if(res?.payment_url){
            const paymentUrl = res?.payment_url.replace(/\\/g, "");
            console.log("paymentUrl",paymentUrl);
            
            // Store order ID for callback handling
            localStorage.setItem('pendingPaymentOrderId', res?.order_id);
            this.paymentId = res?.payment_id;
            // Add return URL to payment URL if not already present
            let finalPaymentUrl = paymentUrl;
            if (!paymentUrl.includes('returnUrl') && !paymentUrl.includes('callback')) {
              const returnUrl = encodeURIComponent(window.location.origin + '/payment-callback');
              finalPaymentUrl = paymentUrl + (paymentUrl.includes('?') ? '&' : '?') + 'returnUrl=' + returnUrl;
            }
            
            // Open payment URL in new window
            const paymentWindow = window.open(finalPaymentUrl, "_blank");
            
            // Set up polling to check payment status
            this.checkPaymentStatus(res?.order_id, paymentWindow);
          }
          console.log("res",res);
        });
      }
    });
  }

  // Check payment status after redirect
  checkPaymentStatus(orderId: string, paymentWindow: Window) {
    const checkInterval = setInterval(() => {
      // Check if payment window is closed
      if (paymentWindow.closed) {
        clearInterval(checkInterval);
        this.handlePaymentCallback(orderId);
      }
    }, 2000); // Check every 2 seconds

    // Also check after 30 seconds regardless of window status
    setTimeout(() => {
      clearInterval(checkInterval);
      this.handlePaymentCallback(orderId);
    }, 30000);
  }

  // Handle payment callback
  handlePaymentCallback(orderId: string) {
    // console.log("orderId -----------------------------",orderId);
    // Get payment ID from localStorage or URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    console.log("urlParams -----------------------------",urlParams);
    const paymentId = urlParams.get('paymentId') || localStorage.getItem('paymentId');
    // const paymentId = '07075871732281095673'
    console.log("orderId -----------------------------",paymentId);
    if (paymentId) {
      this.http.paymentCallback(paymentId).subscribe(
        (response) => {
          console.log('Payment callback response:', response);
          
          if (response?.status === 'success' || response?.payment_status === 'completed') {
            this.alertService.showAlert("success", "Payment completed successfully!");
            // Refresh cart and order data
            // this.getCartList();
            // this.getOrderDetails();
            
            // Redirect to cart page if we're on payment callback route
            if (window.location.pathname.includes('payment-callback')) {
              this.router.navigate(['/myListing'], { 
                state: { activeRouteType: 'cart' } 
              });
            }
          } else if (response?.status === 'failed' || response?.payment_status === 'failed') {
            this.alertService.showAlert("warning", "Payment failed. Please try again.");
            
            // Redirect to cart page if we're on payment callback route
            if (window.location.pathname.includes('payment-callback')) {
              this.router.navigate(['/myListing'], { 
                state: { activeRouteType: 'cart' } 
              });
            }
          } else {
            this.alertService.showAlert("info", "Payment status: " + (response?.status || 'pending'));
          }
          
          // Clear stored payment data
          localStorage.removeItem('pendingPaymentOrderId');
          localStorage.removeItem('paymentId');
        },
        (error) => {
          console.error('Payment callback error:', error);
          this.alertService.showAlert("warning", "Error checking payment status. Please contact support.");
          
          // Redirect to cart page if we're on payment callback route
          if (window.location.pathname.includes('payment-callback')) {
            this.router.navigate(['/myListing'], { 
              state: { activeRouteType: 'cart' } 
            });
          }
        }
      );
    } else {
      // No payment ID found, redirect to cart page
      if (window.location.pathname.includes('payment-callback')) {
        this.router.navigate(['/myListing'], { 
          state: { activeRouteType: 'cart' } 
        });
      }
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
