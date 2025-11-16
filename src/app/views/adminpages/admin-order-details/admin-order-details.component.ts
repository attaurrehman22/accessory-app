import { Component, OnInit, Inject, ViewChild, ElementRef } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "src/environments/environment";
import * as moment from "moment";

@Component({
  selector: "app-admin-order-details",
  templateUrl: "./admin-order-details.component.html",
  styleUrls: ["./admin-order-details.component.css"],
})
export class AdminOrderDetailsComponent implements OnInit {
  apiUrl = environment.apipath + "/";
  order: any = null;
  isLoading = true;
  chatHistory: any[] = [];
  isLoadingChat = false;
  actionForm: FormGroup;
  showActionForm = false;
  selectedAction: string = "";
  newMessage: string = "";
  selectedImages: File[] = [];
  @ViewChild("fileInput") fileInput!: ElementRef;
  @ViewChild("chatContainer") chatContainer!: ElementRef;

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  actionTypes = [
    { value: "send_message", label: "Send Message" },
    { value: "update_status", label: "Update Order Status" },
    { value: "cancel_order", label: "Cancel Order" },
    { value: "refund", label: "Process Refund" },
  ];

  statusOptions = [
    { value: "initiated", label: "Order Initiated" },
    { value: "awaiting_confirmation", label: "Awaiting Confirmation" },
    { value: "make_payment", label: "Make Payment" },
    { value: "preparing_shipment", label: "Preparing Shipment" },
    { value: "delivery_in_progress", label: "Delivery in Progress" },
    { value: "order_delivered", label: "Order Delivered" },
    { value: "order_completed", label: "Order Completed" },
    { value: "order_canceled", label: "Order Canceled" },
  ];

  orderStatuses: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AdminOrderDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private fb: FormBuilder
  ) {
    this.actionForm = this.fb.group({
      action: ["", Validators.required],
      message: [""],
      status: [""],
      notes: [""],
    });
  }

  async ngOnInit() {
    await this.loadOrderDetails();
    await this.loadChatHistory();
  }

  async loadOrderDetails() {
    this.isLoading = true;
    try {
      // TODO: Replace with actual API call when backend is ready
      // const res: any = await this.http.getAdminOrderDetails(this.data.orderId).toPromise();
      // this.order = res.order || res.data;

      // Dummy data for testing
      await this.loadDummyOrderDetails();
      this.initializeOrderStatuses();
      this.isLoading = false;
    } catch (err: any) {
      this.isLoading = false;
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error loading order details"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error loading order details. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تحميل تفاصيل الطلب، يرجى المحاولة مرة أخرى");
        }
      }
    }
  }

  loadDummyOrderDetails() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.order = {
          id: 3354654654526,
          buyer_id: 101,
          seller_id: 202,
          product_id: 501,
          chat_id: 12345,
          status: "awaiting_confirmation",
          created_at: "2024-01-20T10:30:00Z",
          updated_at: "2024-01-20T10:30:00Z",
          buyer: {
            id: 101,
            name: "John Doe",
            email: "john@example.com",
            profile_image: "user1.jpg",
          },
          seller: {
            id: 202,
            name: "Jane Smith",
            email: "jane@example.com",
            profile_image: "user2.jpg",
          },
          product: {
            id: 501,
            title: "Rolex Speedmaster in a good condition but in low price",
            price: 2500,
            currency: "SR",
            main_image: "watch1.jpg",
            serial_no: "RS-2024-001",
          },
          order_history: [
            {
              id: 1,
              old_status: null,
              new_status: "initiated",
              created_at: "2024-01-20T10:30:00Z",
            },
            {
              id: 2,
              old_status: "initiated",
              new_status: "awaiting_confirmation",
              created_at: "2024-01-20T10:35:00Z",
            },
          ],
        };
        resolve(null);
      }, 300);
    });
  }

  initializeOrderStatuses() {
    this.orderStatuses = [
      {
        label: "Order Initiated",
        status: "initiated",
        active: false,
        time: null,
        description: "Order has been initiated.",
      },
      {
        label: "Order Received",
        status: "initiated",
        active: false,
        time: null,
        description: "Buyer has initiated the order.",
      },
      {
        label: "Awaiting For Confirmation",
        status: "awaiting_confirmation",
        active: false,
        time: null,
        description: "Waiting for seller to confirm the order.",
      },
      {
        label: "Confirm Order Availability",
        status: "awaiting_confirmation",
        active: false,
        time: null,
        description: "Confirm availability for your listed order.",
      },
      {
        label: "Make Payment",
        status: "make_payment",
        active: false,
        time: null,
        description: "Make a payment for your order.",
      },
      {
        label: "Preparing Shipment",
        status: "preparing_shipment",
        active: false,
        time: null,
        description: "Seller is preparing your order.",
      },
      {
        label: "Delivery in Progress",
        status: "delivery_in_progress",
        active: false,
        time: null,
        description: "Click to track your order.",
      },
      {
        label: "Order Delivered",
        status: "order_delivered",
        active: false,
        time: null,
        description: "Authorize payout for your order.",
      },
      {
        label: "Order Completed",
        status: "order_completed",
        active: false,
        time: null,
        description: "Your order has been completed successfully.",
      },
    ];

    // Update statuses based on order history
    if (this.order?.order_history) {
      this.order.order_history.forEach((history: any) => {
        const statusIndex = this.orderStatuses.findIndex(
          (s) => s.status === history.new_status
        );
        if (statusIndex !== -1) {
          this.orderStatuses[statusIndex].active = true;
          this.orderStatuses[statusIndex].time = moment(history.created_at).fromNow();
        }
      });
    }

    // Set current status as active
    const currentStatusIndex = this.orderStatuses.findIndex(
      (s) => s.status === this.order?.status
    );
    if (currentStatusIndex !== -1) {
      this.orderStatuses[currentStatusIndex].active = true;
    }
  }

  async loadChatHistory() {
    if (!this.order?.chat_id) {
      return;
    }

    this.isLoadingChat = true;
    try {
      // TODO: Replace with actual API call when backend is ready
      // const res: any = await this.http.getChatsDetails(this.order.chat_id).toPromise();
      // this.chatHistory = res.messages || [];

      // Dummy chat history
      await this.loadDummyChatHistory();
      this.isLoadingChat = false;
      setTimeout(() => this.scrollToBottom(), 100);
    } catch (err: any) {
      this.isLoadingChat = false;
      console.error("Error loading chat history:", err);
    }
  }

  loadDummyChatHistory() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.chatHistory = [
          {
            id: 1,
            sender_id: this.order.buyer_id,
            receiver_id: this.order.seller_id,
            message: "Hello, I'm interested in this watch.",
            created_at: "2024-01-20T10:25:00Z",
            sender: this.order.buyer,
          },
          {
            id: 2,
            sender_id: this.order.seller_id,
            receiver_id: this.order.buyer_id,
            message: "Hi! Yes, it's available. Would you like to proceed?",
            created_at: "2024-01-20T10:26:00Z",
            sender: this.order.seller,
          },
          {
            id: 3,
            sender_id: this.order.buyer_id,
            receiver_id: this.order.seller_id,
            message: "Yes, I'll buy it now.",
            created_at: "2024-01-20T10:30:00Z",
            sender: this.order.buyer,
          },
        ];
        resolve(null);
      }, 200);
    });
  }

  showActionDialog(action: string) {
    this.selectedAction = action;
    this.actionForm.patchValue({ action: action });
    if (action === "update_status") {
      this.actionForm.patchValue({ status: this.order?.status });
    }
    this.showActionForm = true;
  }

  async submitAction() {
    if (this.actionForm.invalid) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please fill all required fields");
      } else {
        this.alertService.showAlert("warning", "يرجى ملء جميع الحقول المطلوبة");
      }
      return;
    }

    const formData = this.actionForm.value;

    try {
      // TODO: Replace with actual API call when backend is ready
      // await this.http.performAdminOrderAction(formData).toPromise();

      // Simulate API call
      await this.simulateAction(formData);

      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("success", "Action performed successfully");
      } else {
        this.alertService.showAlert("success", "تم تنفيذ الإجراء بنجاح");
      }

      this.showActionForm = false;
      this.actionForm.reset();
      await this.loadOrderDetails();
      if (formData.action === "send_message") {
        await this.loadChatHistory();
      }
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error performing action"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error performing action. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تنفيذ الإجراء، يرجى المحاولة مرة أخرى");
        }
      }
    }
  }

  simulateAction(formData: any) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (formData.action === "update_status" && formData.status) {
          this.order.status = formData.status;
          this.initializeOrderStatuses();
        }
        if (formData.action === "send_message") {
          // Add message to chat history
          this.chatHistory.push({
            id: this.chatHistory.length + 1,
            sender_id: "admin",
            receiver_id: this.order.buyer_id,
            message: formData.message,
            created_at: new Date().toISOString(),
            sender: { name: "Admin", id: "admin" },
            is_admin: true,
          });
        }
        resolve(null);
      }, 500);
    });
  }

  cancelAction() {
    this.showActionForm = false;
    this.actionForm.reset();
    this.selectedAction = "";
  }

  async sendMessage() {
    if (!this.newMessage.trim() && this.selectedImages.length === 0) {
      return;
    }

    const formData = new FormData();
    if (this.newMessage.trim()) {
      formData.append("message", this.newMessage);
    }

    if (this.selectedImages.length > 0) {
      this.selectedImages.forEach((file) => {
        formData.append("attachments[]", file);
      });
    }

    formData.append("chat_id", this.order.chat_id.toString());
    formData.append("receiver_id", this.order.buyer_id.toString());
    formData.append("action_type", "admin_message");

    try {
      // TODO: Replace with actual API call when backend is ready
      // await this.http.sendAdminMessage(formData).toPromise();

      // Simulate sending message
      this.chatHistory.push({
        id: this.chatHistory.length + 1,
        sender_id: "admin",
        receiver_id: this.order.buyer_id,
        message: this.newMessage,
        created_at: new Date().toISOString(),
        sender: { name: "Admin", id: "admin" },
        is_admin: true,
      });

      this.newMessage = "";
      this.selectedImages = [];
      setTimeout(() => this.scrollToBottom(), 100);
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error sending message"}`);
      }
    }
  }

  uploadImages() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedImages = Array.from(files);
    }
  }

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
  }

  scrollToBottom() {
    if (this.chatContainer?.nativeElement) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  formatTime(date: string): string {
    if (!date) return "";
    return moment(date).format("MMMM d, yyyy, h:mm a");
  }

  getInitials(name: string | undefined | null): string {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  }

  getImagePreviewUrl(file: File): string {
    return window.URL.createObjectURL(file);
  }

  isStatusCompleted(statusIndex: number): boolean {
    if (!this.order?.status) return false;
    const currentStatusIndex = this.orderStatuses.findIndex(
      (s) => s.status === this.order.status
    );
    return statusIndex < currentStatusIndex;
  }

  shouldShowCheckIcon(status: any, statusIndex: number): boolean {
    return status.active || this.isStatusCompleted(statusIndex);
  }

  isArray(attachments: any): boolean {
    return Array.isArray(attachments);
  }

  getAttachmentType(attachment: string): "image" | "video" | "unknown" {
    const lower = attachment.toLowerCase();
    if (lower.endsWith(".jpg") || lower.endsWith(".jpeg") || lower.endsWith(".png") || lower.endsWith(".gif")) {
      return "image";
    }
    if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".ogg")) {
      return "video";
    }
    return "unknown";
  }

  close() {
    this.dialogRef.close();
  }
}

