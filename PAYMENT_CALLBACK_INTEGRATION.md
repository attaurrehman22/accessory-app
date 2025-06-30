# Payment Callback Integration

This document explains how the payment callback integration works in the Chronosouq application.

## Overview

The payment callback integration allows the application to handle payment responses from the payment gateway (MyFatoorah) and update the order status accordingly.

## Implementation Details

### 1. Payment Initiation

When a user clicks "Checkout" in the cart:

1. The `goToCheckout()` method is called
2. Order is confirmed via `confirmCartOrder()` API
3. Payment is initiated via `paymentInitiate()` API
4. Payment URL is opened in a new window
5. Return URL is added to the payment URL for callback handling

### 2. Payment Callback Handling

The application handles payment callbacks in multiple ways:

#### A. URL Parameter Callback
- Payment gateway redirects to `/payment-callback?paymentId=XXXXX`
- The `ngOnInit()` method detects the `paymentId` parameter
- Calls `handlePaymentCallback()` to verify payment status

#### B. Window Polling
- After opening payment window, the app polls every 2 seconds
- Checks if payment window is closed
- Automatically calls callback after 30 seconds

#### C. Manual Status Check
- Users can click "Check Payment Status" button
- Calls `refreshPaymentStatus()` method

### 3. API Endpoints

#### Payment Initiation
```
POST /api/accessory-payment/initiate
Body: { order_id: string }
Response: { payment_url: string, order_id: string }
```

#### Payment Callback
```
GET /api/accessory-payment/callback?paymentId=XXXXX
Response: { status: string, payment_status: string }
```

### 4. Payment Status Handling

The application handles different payment statuses:

- **Success**: Shows success message, refreshes cart and order data
- **Failed**: Shows failure message, allows retry
- **Pending**: Shows status message
- **Error**: Shows error message, suggests contacting support

### 5. Routes

- `/payment-callback` - Handles payment gateway redirects
- `/myListing` - Main listing page with cart functionality

### 6. Local Storage

The application uses localStorage to track payment state:

- `pendingPaymentOrderId` - Stores the order ID for pending payments
- `paymentId` - Stores the payment ID from callback

### 7. Error Handling

- Network errors are caught and displayed to user
- Missing payment IDs are handled gracefully
- Automatic redirects prevent users from getting stuck

## Usage

1. Add items to cart
2. Click "Checkout" button
3. Complete payment on payment gateway
4. Payment status is automatically checked
5. Order status is updated based on payment result

## Configuration

To configure the payment callback URL in your payment gateway:

1. Set the return URL to: `https://yourdomain.com/payment-callback`
2. Ensure the payment gateway sends `paymentId` as a query parameter
3. The application will automatically handle the callback and update order status

## Testing

To test the payment callback:

1. Use the demo payment gateway
2. Complete a test payment
3. Check that the callback URL is called with the correct `paymentId`
4. Verify that order status is updated correctly
5. Test error scenarios (network issues, invalid payment IDs, etc.) 