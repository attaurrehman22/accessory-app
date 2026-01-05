# Report System - Test Cases Documentation

## Overview
Yeh document Report System ke saare use cases aur test scenarios ko cover karta hai. Frontend developers in test cases ko follow karke implementation ko verify kar sakte hain.

---

## 📋 Test Cases Index

1. [Report Submission](#1-report-submission)
2. [Report Listing](#2-report-listing)
3. [Report Details View](#3-report-details-view)
4. [Proof Submission](#4-proof-submission)
5. [Cancel Report](#5-cancel-report)
6. [Mark Proof Invalid](#6-mark-proof-invalid)
7. [Time Remaining Countdown](#7-time-remaining-countdown)
8. [Actions History](#8-actions-history)
9. [Real-time Updates](#9-real-time-updates)
10. [Error Handling](#10-error-handling)

---

## 1. Report Submission

### Test Case 1.1: Submit Payment Issue Report (Buyer)
**Scenario:** Buyer ko payment issue face ho raha hai

**Steps:**
1. Chat module se "Report" button click karein
2. Report modal open hoga
3. Report type select karein: `payment_issue`
4. Reported user ID enter karein (seller ka ID)
5. Order ID enter karein (agar applicable ho)
6. Description enter karein: "Payment failed during checkout"
7. Attachments upload karein (optional - screenshots/files)
8. "Submit Report" button click karein

**Expected Results:**
- ✅ Success message show hoga: "Your report regarding payment failure has been submitted successfully."
- ✅ Report ID generate hoga
- ✅ Status: `pending`
- ✅ Seller ko notification jayega: "Submit proof within 6 hours"
- ✅ Modal close ho jayega
- ✅ Reports list mein naya report dikhega

**API Call:**
```
POST /api/reports/submit
Body: FormData
- reported_user_id: 202
- order_id: 501
- report_type: payment_issue
- description: "Payment failed during checkout"
- attachments[]: [file1.jpg, file2.jpg]
```

---

### Test Case 1.2: Submit Payment Delay Report (Seller)
**Scenario:** Seller ko payment delay ka issue hai

**Steps:**
1. Chat module se "Report" button click karein
2. Report type select karein: `payment_delay`
3. Reported user ID enter karein (buyer ka ID)
4. Order ID enter karein
5. Description enter karein: "Payment release delayed"
6. Submit karein

**Expected Results:**
- ✅ Success message: "Your report regarding delayed payment release has been submitted successfully."
- ✅ Status: `pending`
- ✅ Buyer ko notification: "A report has been submitted regarding delayed payment release"

---

### Test Case 1.3: Submit Delivery Delay Report (Buyer)
**Scenario:** Buyer ko delivery delay ka issue hai

**Steps:**
1. Report type select karein: `delivery_delay`
2. Description aur proof attachments add karein
3. Submit karein

**Expected Results:**
- ✅ Success message: "Your delivery delay report has been submitted successfully."
- ✅ Seller ko notification: "Upload shipping proof within 6 hours"

---

### Test Case 1.4: Submit Fraud Report (Seller)
**Scenario:** Seller buyer ko fraud report karta hai

**Steps:**
1. Report type select karein: `fraud`
2. Description enter karein
3. Submit karein

**Expected Results:**
- ✅ Success message: "Your misconduct report has been submitted successfully."
- ✅ Buyer ko notification: "Present your proof or chat evidence within 6 hours"

---

### Test Case 1.5: Submit Report Without Required Fields
**Scenario:** Validation testing

**Steps:**
1. Report modal open karein
2. Koi field fill kiye bina "Submit Report" click karein

**Expected Results:**
- ✅ Validation errors show honge
- ✅ Required fields highlight honge
- ✅ Form submit nahi hoga

---

## 2. Report Listing

### Test Case 2.1: View All Reports
**Scenario:** User apne saare reports dekhna chahta hai

**Steps:**
1. Profile section se "Reports" menu click karein
2. `/myprofile/reports` route par navigate hoga

**Expected Results:**
- ✅ Reports list load hogi
- ✅ Skeleton loader show hoga initially
- ✅ Reports cards dikhenge with:
  - Report ID
  - Report Type
  - Status badge (color-coded)
  - Created date
  - Description preview
- ✅ Pagination show hogi (agar reports 10+ hain)

**API Call:**
```
GET /api/reports/list?page=1&per_page=10
```

---

### Test Case 2.2: Filter Reports by Status
**Scenario:** User sirf pending reports dekhna chahta hai

**Steps:**
1. Reports list page par jayein
2. Status filter dropdown se "Pending" select karein

**Expected Results:**
- ✅ Sirf pending status ke reports dikhenge
- ✅ Filter automatically apply hoga
- ✅ URL update nahi hogi (client-side filter)

**API Call:**
```
GET /api/reports/list?status=pending&page=1&per_page=10
```

---

### Test Case 2.3: Filter Reports by Type
**Scenario:** User sirf payment_issue reports dekhna chahta hai

**Steps:**
1. Type filter dropdown se "Payment Issue" select karein

**Expected Results:**
- ✅ Sirf payment_issue type ke reports dikhenge
- ✅ List automatically refresh hogi

**API Call:**
```
GET /api/reports/list?type=payment_issue&page=1&per_page=10
```

---

### Test Case 2.4: Filter by Date Range
**Scenario:** User specific date range ke reports dekhna chahta hai

**Steps:**
1. Date From field mein date select karein
2. Date To field mein date select karein

**Expected Results:**
- ✅ Sirf selected date range ke reports dikhenge
- ✅ Date format: YYYY-MM-DD

**API Call:**
```
GET /api/reports/list?date_from=2024-01-01&date_to=2024-01-31&page=1&per_page=10
```

---

### Test Case 2.5: Pagination
**Scenario:** User next page dekhna chahta hai

**Steps:**
1. Reports list page par jayein
2. Pagination ke "Next" button par click karein

**Expected Results:**
- ✅ Next page ke reports load honge
- ✅ Page number update hoga
- ✅ Previous/Next buttons enable/disable honge accordingly

---

### Test Case 2.6: Empty State
**Scenario:** User ka koi report nahi hai

**Steps:**
1. Reports list page par jayein (jab koi report nahi ho)

**Expected Results:**
- ✅ Empty state message show hoga
- ✅ "No Reports Yet" message
- ✅ Helpful description

---

## 3. Report Details View

### Test Case 3.1: View Report Details (Reporter)
**Scenario:** Reporter apne report ki details dekhna chahta hai

**Steps:**
1. Reports list se kisi report card par click karein
2. Report details page open hoga

**Expected Results:**
- ✅ Report details load hongi:
  - Report ID
  - Report Type (formatted)
  - Status (with badge)
  - Description
  - Order ID (if applicable)
  - Reporter information
  - Reported user information
  - Attachments
  - General message (if available)
  - User-specific message (for_reporter)
  - Time remaining (if applicable)
  - Available actions
  - Actions history
- ✅ Back button se reports list par wapas ja sakte hain

**API Call:**
```
GET /api/reports/{id}
```

---

### Test Case 3.2: View Report Details (Counter Party)
**Scenario:** Counter party (reported user) report details dekhna chahta hai

**Steps:**
1. Counter party login karein
2. Reports list se report open karein

**Expected Results:**
- ✅ Report details load hongi
- ✅ User role: `counter_party` show hoga
- ✅ Counter party specific message show hoga (for_counter_party)
- ✅ Proof submission section available hoga (agar status `info_requested` ho)
- ✅ Available actions counter party ke liye different honge

---

### Test Case 3.3: View Order Information
**Scenario:** Report order se related hai

**Steps:**
1. Report details page par jayein (jahan order_id hai)

**Expected Results:**
- ✅ Order Information section show hoga:
  - Order ID
  - Order Status
  - Final Price
- ✅ Order details box mein properly formatted dikhega

---

### Test Case 3.4: View Attachments
**Scenario:** User report attachments dekhna chahta hai

**Steps:**
1. Report details page par jayein
2. Attachments section mein "View Attachment" button click karein

**Expected Results:**
- ✅ Attachment new tab mein open hoga
- ✅ File download ho sakta hai
- ✅ Image files directly display honge

---

## 4. Proof Submission

### Test Case 4.1: Submit Proof (Counter Party - Within Time)
**Scenario:** Counter party proof submit karta hai within 6 hours

**Steps:**
1. Counter party login karein
2. Report details page par jayein (status: `info_requested`)
3. "Submit Proof" section mein "Choose Files" click karein
4. Proof files select karein (images/documents)
5. Files select hone ke baad "Submit Proof" button click karein

**Expected Results:**
- ✅ Success message: "Thank you. Your proof has been received and the verification process has started."
- ✅ Status update hoga: `under_review`
- ✅ Proof submissions section mein naya proof dikhega
- ✅ Reporter ko notification: "Counterparty has submitted proof. Order will proceed after verification"
- ✅ Time remaining badge disappear ho jayega

**API Call:**
```
POST /api/reports/submit-proof
Body: FormData
- report_id: 1
- proof_attachments[]: [proof1.jpg, proof2.pdf]
```

---

### Test Case 4.2: Submit Proof (After Time Expiry)
**Scenario:** Counter party proof submit karta hai after 6 hours

**Steps:**
1. Time expired report par jayein
2. Proof submission section try karein

**Expected Results:**
- ✅ Proof submission section disabled hoga
- ✅ "Time expired" message show hoga
- ✅ Submit button disabled hoga
- ✅ Warning message: "Proof submission window has expired"

---

### Test Case 4.3: Submit Multiple Proof Files
**Scenario:** Counter party multiple files submit karta hai

**Steps:**
1. "Choose Files" click karein
2. Multiple files select karein (Ctrl+Click)
3. Submit karein

**Expected Results:**
- ✅ Sabhi files successfully upload hongi
- ✅ Har file proof submissions mein dikhegi
- ✅ File names properly show honge

---

### Test Case 4.4: Remove Selected Files Before Submit
**Scenario:** User selected files ko remove karta hai

**Steps:**
1. Files select karein
2. Kisi file ke saamne "×" button click karein

**Expected Results:**
- ✅ File list se remove ho jayegi
- ✅ Remaining files show hongi
- ✅ Submit button available rahega (agar koi file bachi ho)

---

## 5. Cancel Report

### Test Case 5.1: Cancel Report (Reporter)
**Scenario:** Reporter apna report cancel karta hai

**Steps:**
1. Reporter login karein
2. Report details page par jayein (status: `pending` ya `info_requested`)
3. "Cancel Report" button click karein
4. Confirmation dialog mein "Yes" click karein

**Expected Results:**
- ✅ Confirmation dialog show hoga
- ✅ Success message: "Your report has been canceled successfully."
- ✅ Status update hoga: `resolved`
- ✅ Reports list par redirect hoga
- ✅ Counter party ko notification: "The report has been canceled. No action required"

**API Call:**
```
POST /api/reports/cancel
Body: { "report_id": 1 }
```

---

### Test Case 5.2: Cancel Report - Cancel Action
**Scenario:** User cancel action ko cancel karta hai

**Steps:**
1. "Cancel Report" button click karein
2. Confirmation dialog mein "No" click karein

**Expected Results:**
- ✅ Dialog close ho jayega
- ✅ Report cancel nahi hoga
- ✅ Status same rahega

---

### Test Case 5.3: Cancel Report - Invalid Status
**Scenario:** User report cancel karta hai jo already resolved hai

**Steps:**
1. Already resolved report par jayein
2. Cancel button try karein

**Expected Results:**
- ✅ Cancel button show nahi hoga (available_actions mein nahi hoga)
- ✅ Ya disabled state mein hoga

---

## 6. Mark Proof Invalid

### Test Case 6.1: Mark Proof as Invalid (Reporter)
**Scenario:** Reporter counter party ki proof ko invalid mark karta hai

**Steps:**
1. Reporter login karein
2. Report details page par jayein (jahan proof submit ho chuki hai)
3. "Mark Proof as Invalid" button click karein
4. Reason enter karein: "Proof is incomplete or unclear"
5. Confirmation dialog mein "Yes" click karein

**Expected Results:**
- ✅ Reason prompt show hoga
- ✅ Confirmation dialog show hoga with reason
- ✅ Success message: "Proof has been marked as invalid. Counterparty has been asked to provide new evidence."
- ✅ Status update hoga: `info_requested`
- ✅ Counter party ko notification: "Your proof is invalid. Please resubmit within 6 hours"
- ✅ Time remaining reset hoga (6 hours)

**API Call:**
```
POST /api/reports/mark-proof-invalid
Body: {
  "report_id": 1,
  "reason": "Proof is incomplete or unclear"
}
```

---

### Test Case 6.2: Mark Proof Invalid - Without Reason
**Scenario:** User reason enter kiye bina mark karta hai

**Steps:**
1. "Mark Proof as Invalid" click karein
2. Reason prompt mein cancel karein ya empty submit karein

**Expected Results:**
- ✅ Error message: "Reason is required"
- ✅ Action cancel ho jayega
- ✅ Report status same rahega

---

## 7. Time Remaining Countdown

### Test Case 7.1: View Time Remaining
**Scenario:** User time remaining dekhna chahta hai

**Steps:**
1. Report details page par jayein (jahan time_remaining available hai)

**Expected Results:**
- ✅ Time remaining badge show hoga header mein
- ✅ Format: "4h 30m remaining"
- ✅ Badge color: Warning (yellow)
- ✅ Real-time countdown update hoga (every minute)

---

### Test Case 7.2: Time Expired
**Scenario:** 6 hours expire ho gaye hain

**Steps:**
1. Expired report par jayein

**Expected Results:**
- ✅ Badge show hoga: "Expired" (red color)
- ✅ Proof submission disabled hoga
- ✅ Warning messages show honge

---

### Test Case 7.3: Countdown Updates
**Scenario:** Countdown real-time update ho raha hai

**Steps:**
1. Report details page par jayein
2. 1 minute wait karein

**Expected Results:**
- ✅ Countdown automatically update hoga
- ✅ Minutes decrease honge
- ✅ Hours update honge jab minutes 0 ho jayenge

---

## 8. Actions History

### Test Case 8.1: View Actions History
**Scenario:** User actions history dekhna chahta hai

**Steps:**
1. Report details page par jayein
2. Actions History section scroll karein

**Expected Results:**
- ✅ Actions history timeline show hogi:
  - Action label (e.g., "Proof Submitted")
  - Notes
  - Timestamp
  - Admin information (if applicable)
  - Proof attachments count (if applicable)
- ✅ Timeline items chronologically ordered honge (newest first)
- ✅ Hover effect show hoga

---

### Test Case 8.2: Actions History - Multiple Actions
**Scenario:** Report mein multiple actions hain

**Steps:**
1. Report par multiple actions perform karein
2. Actions history check karein

**Expected Results:**
- ✅ Sabhi actions history mein dikhenge
- ✅ Har action ka proper details show hoga
- ✅ Timeline properly formatted hogi

---

## 9. Real-time Updates

### Test Case 9.1: Automatic Status Updates
**Scenario:** Report status automatically update ho raha hai

**Steps:**
1. Report details page par jayein
2. 30 seconds wait karein
3. Status check karein

**Expected Results:**
- ✅ Page automatically refresh hoga (every 30 seconds)
- ✅ Status updates reflect honge
- ✅ New actions show honge
- ✅ Time remaining update hoga
- ✅ Loading state show nahi hoga (background refresh)

---

### Test Case 9.2: Polling Stops on Navigation
**Scenario:** User page se navigate karta hai

**Steps:**
1. Report details page par jayein
2. Back button click karein

**Expected Results:**
- ✅ Polling automatically stop ho jayega
- ✅ Memory leak nahi hoga
- ✅ Interval clear ho jayega

---

## 10. Error Handling

### Test Case 10.1: Network Error
**Scenario:** Network connection fail ho jata hai

**Steps:**
1. Network disconnect karein
2. Report submit karein ya details load karein

**Expected Results:**
- ✅ Error message show hoga
- ✅ User-friendly error message
- ✅ Retry option available hoga

---

### Test Case 10.2: Unauthorized Access
**Scenario:** User unauthorized report access karta hai

**Steps:**
1. Different user login karein
2. Kisi aur user ka report ID directly URL mein enter karein

**Expected Results:**
- ✅ 403 Forbidden error
- ✅ Error message: "You are not authorized to view this report."
- ✅ Redirect to reports list

---

### Test Case 10.3: Report Not Found
**Scenario:** Invalid report ID

**Steps:**
1. Invalid report ID se details page open karein

**Expected Results:**
- ✅ 404 Not Found error
- ✅ Error message: "Report not found."
- ✅ Empty state show hoga
- ✅ Back to reports button available hoga

---

### Test Case 10.4: Validation Errors
**Scenario:** Invalid data submit karta hai

**Steps:**
1. Report submit karte waqt invalid data enter karein

**Expected Results:**
- ✅ Validation errors show honge
- ✅ Field-specific error messages
- ✅ Form submit nahi hoga

---

## 11. Additional Test Cases

### Test Case 11.1: Request Manual Review
**Scenario:** User manual review request karta hai

**Steps:**
1. Report details page par jayein
2. "Request Manual Review" button click karein
3. Confirmation dialog mein "Yes" click karein

**Expected Results:**
- ✅ Success message: "Report has been escalated to manual review."
- ✅ Status update: `under_review`
- ✅ Both parties ko notification

---

### Test Case 11.2: Check Response Timeout
**Scenario:** User manually timeout check karta hai

**Steps:**
1. Report details page par jayein
2. "Check Response Timeout" button click karein

**Expected Results:**
- ✅ Success message: "Response timeout check completed."
- ✅ Expired reports process honge
- ✅ Status updates reflect honge

---

### Test Case 11.3: Dynamic Actions Display
**Scenario:** Available actions API se aate hain

**Steps:**
1. Report details page par jayein
2. Available Actions section check karein

**Expected Results:**
- ✅ Actions API se dynamically load honge
- ✅ Only relevant actions show honge
- ✅ Actions properly formatted honge
- ✅ Icons aur labels sahi honge

---

## 📝 Test Checklist

### Pre-Testing Setup
- [ ] User accounts ready (Reporter, Counter Party, Admin)
- [ ] Test orders created
- [ ] Network connection stable
- [ ] Browser console open (for debugging)

### Functional Testing
- [ ] Report submission works
- [ ] Report listing works
- [ ] Report details load correctly
- [ ] Proof submission works
- [ ] Cancel report works
- [ ] Mark proof invalid works
- [ ] Time countdown works
- [ ] Actions history displays
- [ ] Real-time updates work

### UI/UX Testing
- [ ] All pages responsive
- [ ] Loading states show correctly
- [ ] Empty states display properly
- [ ] Error messages are user-friendly
- [ ] Status badges have correct colors
- [ ] Buttons are properly enabled/disabled

### Edge Cases
- [ ] Empty report list
- [ ] Expired time
- [ ] Network errors
- [ ] Invalid data
- [ ] Unauthorized access
- [ ] Large file uploads

---

## 🐛 Common Issues & Solutions

### Issue 1: Time Countdown Not Updating
**Solution:** Check if `startCountdown()` is called in `loadReportDetails()`

### Issue 2: Polling Not Stopping
**Solution:** Ensure `ngOnDestroy()` calls `stopPolling()`

### Issue 3: Actions Not Showing
**Solution:** Check if `available_actions` array is properly populated from API

### Issue 4: Proof Submission Not Working
**Solution:** Verify user role is `counter_party` and status is `info_requested`

---

## 📊 Test Results Template

```
Test Case ID: TC-1.1
Test Case Name: Submit Payment Issue Report
Status: ✅ Pass / ❌ Fail
Date: YYYY-MM-DD
Tester: [Name]
Notes: [Any observations]
```

---

**Last Updated:** [Current Date]
**Version:** 1.0

