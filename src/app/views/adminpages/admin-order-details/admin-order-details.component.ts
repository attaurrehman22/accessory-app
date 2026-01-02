import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
} from "@angular/core";
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
  }

  async loadOrderDetails() {
    this.isLoading = true;
    try {
      this.http.getAdminOrderDetails(this.data.orderId).subscribe(
        (res: any) => {
          this.order = res.order || res.data;
          this.initializeOrderStatuses();
          this.isLoading = false;
          this.loadChatHistory();
        },
        (err: any) => {
          this.isLoading = false;
        }
      );
    } catch (err: any) {
      this.isLoading = false;
      if (err && err.error) {
        this.alertService.showAlert(
          "warning",
          `${err.error.message || "Error loading order details"}`
        );
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error loading order details. Please try again"
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء تحميل تفاصيل الطلب، يرجى المحاولة مرة أخرى"
          );
        }
      }
    }
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
          (s) => s.status === history.new_status.toLowerCase()
        );
        if (statusIndex !== -1) {
          this.orderStatuses[statusIndex].active = true;
          this.orderStatuses[statusIndex].time = moment(
            history.created_at
          ).fromNow();
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

  loadChatHistory() {
    if (!this.order?.chat_id) {
      return;
    }

    this.isLoadingChat = true;
    this.http.getAdminChatHistory(this.order.chat_id).subscribe(
      (res: any) => {
        const messages = res.chat_history || res.data.messages || [];
        // Sort messages chronologically (earliest first)
        this.chatHistory = this.sortMessagesByDate(messages);
        this.isLoadingChat = false;
        setTimeout(() => this.scrollToTop(), 100);
      },
      (err: any) => {
        this.isLoadingChat = false;
        if (err && err.error) {
          this.alertService.showAlert(
            "warning",
            `${err.error.message || "Error loading chat history"}`
          );
        }
      }
    );
  }

  sortMessagesByDate(messages: any[]): any[] {
    return [...messages].sort((a, b) => {
      const dateA = new Date(a.created_at || a.createdAt || 0).getTime();
      const dateB = new Date(b.created_at || b.createdAt || 0).getTime();
      return dateA - dateB; // Ascending order (earliest first)
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
        this.alertService.showAlert(
          "warning",
          "Please fill all required fields"
        );
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
        this.alertService.showAlert(
          "warning",
          `${err.error.message || "Error performing action"}`
        );
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error performing action. Please try again"
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء تنفيذ الإجراء، يرجى المحاولة مرة أخرى"
          );
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
          const newMessage = {
            id: this.chatHistory.length + 1,
            sender_id: "admin",
            receiver_id: this.order.buyer_id,
            message: formData.message,
            created_at: new Date().toISOString(),
            sender: { name: "Admin", id: "admin" },
            is_admin: true,
          };
          // Add message and re-sort chronologically
          this.chatHistory = this.sortMessagesByDate([
            ...this.chatHistory,
            newMessage,
          ]);
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
      const newMessage = {
        id: this.chatHistory.length + 1,
        sender_id: "admin",
        receiver_id: this.order.buyer_id,
        message: this.newMessage,
        created_at: new Date().toISOString(),
        sender: { name: "Admin", id: "admin" },
        is_admin: true,
      };

      // Add message and re-sort chronologically
      this.chatHistory = this.sortMessagesByDate([
        ...this.chatHistory,
        newMessage,
      ]);

      this.newMessage = "";
      this.selectedImages = [];
      setTimeout(() => this.scrollToTop(), 100);
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert(
          "warning",
          `${err.error.message || "Error sending message"}`
        );
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

  scrollToTop() {
    if (this.chatContainer?.nativeElement) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = 0;
    }
  }

  isBuyerMessage(message: any): boolean {
    if (!message || !this.order) return false;
    // Check if sender_id matches buyer_id
    return (
      message.sender_id === this.order.buyer_id ||
      (message.sender && message.sender.id === this.order.buyer_id)
    );
  }

  isSellerMessage(message: any): boolean {
    if (!message || !this.order) return false;
    // Check if sender_id matches seller_id
    return (
      message.sender_id === this.order.seller_id ||
      (message.sender && message.sender.id === this.order.seller_id)
    );
  }

  isAdminMessage(message: any): boolean {
    return (
      message.is_admin === true ||
      message.sender_id === "admin" ||
      (message.sender && message.sender.id === "admin")
    );
  }

  isSystemMessage(message: any): boolean {
    return (
      message.is_system_generated === 1 ||
      message.is_system_generated === true ||
      message.action_type !== null
    );
  }

  getMessageSenderName(message: any): string {
    if (this.isAdminMessage(message)) {
      return "Admin";
    }
    if (this.isBuyerMessage(message)) {
      return this.order?.buyer?.name || `Buyer #${this.order?.buyer_id}`;
    }
    if (this.isSellerMessage(message)) {
      return this.order?.seller?.name || `Seller #${this.order?.seller_id}`;
    }
    return message.sender?.name || "Unknown";
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

  getAttachmentType(attachment: string | any): "image" | "video" | "unknown" {
    if (!attachment) return "unknown";
    const attachmentPath =
      typeof attachment === "string"
        ? attachment
        : attachment.url || attachment.path || "";
    const lower = attachmentPath.toLowerCase();
    if (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".gif") ||
      lower.endsWith(".webp")
    ) {
      return "image";
    }
    if (
      lower.endsWith(".mp4") ||
      lower.endsWith(".webm") ||
      lower.endsWith(".ogg")
    ) {
      return "video";
    }
    return "unknown";
  }

  getAttachmentUrl(attachment: string | any): string {
    if (!attachment) return "";

    // If attachment is an object with url or path
    if (typeof attachment === "object") {
      if (attachment.url) {
        // If already a full URL, return it
        if (
          attachment.url.startsWith("http://") ||
          attachment.url.startsWith("https://")
        ) {
          return attachment.url;
        }
        return this.apiUrl + attachment.url;
      }
      if (attachment.path) {
        return this.apiUrl + attachment.path;
      }
      return "";
    }

    // If attachment is already a full URL, return it
    if (typeof attachment === "string") {
      if (
        attachment.startsWith("http://") ||
        attachment.startsWith("https://")
      ) {
        return attachment;
      }
      return this.apiUrl + attachment;
    }

    return "";
  }

  close() {
    this.dialogRef.close();
  }
}
