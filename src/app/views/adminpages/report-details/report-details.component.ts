import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { TranslateService } from "@ngx-translate/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import * as timeago from "timeago.js";

@Component({
  selector: "app-report-details",
  templateUrl: "./report-details.component.html",
  styleUrls: ["./report-details.component.css"],
})
export class ReportDetailsComponent implements OnInit {
  report: any = null;
  isLoading = true;
  apiUrl = environment.apipath + "/";
  actionForm: FormGroup;
  showActionForm = false;
  selectedAction: string = "";

  // Chat related properties
  chatMessages: any[] = [];
  chatProfile: any = null;
  isLoadingChat = false;
  chatId: number | null = null;
  adminMessage: string = "";
  adminMessageForm: FormGroup;
  currentUserId: string | null = null;

  // New properties for enhanced report details
  chats: any[] = [];
  proofs: any[] = [];
  history: any[] = [];
  recipientOptions: Array<{ value: string; label: string }> = [];

  // Two-way binding for admin message
  get adminMessageValue() {
    return this.adminMessageForm.get("message")?.value || "";
  }

  set adminMessageValue(value: string) {
    this.adminMessage = value;
    this.adminMessageForm.patchValue({ message: value });
  }

  supportLanguages = ["en", "ar", "fr", "ta", "hi"];

  // Updated: Only 3 statuses and simplified actions
  actionTypes = [
    { value: "reject_report", label: "Reject Report" },
    { value: "resolve_report", label: "Resolve Report" },
    { value: "add_note", label: "Add Note" },
  ];

  // Status change options
  statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
    { value: "resolved", label: "Resolved" },
  ];

  showStatusChangeForm: boolean = false;
  statusChangeForm: FormGroup;

  @ViewChild("chatContainer") chatContainer: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ReportDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private fb: FormBuilder,
  ) {
    this.actionForm = this.fb.group({
      action: ["", Validators.required],
      notes: [""],
    });

    this.statusChangeForm = this.fb.group({
      status: ["", Validators.required],
      notes: [""],
      meta: [{}],
    });

    this.adminMessageForm = this.fb.group({
      message: ["", [Validators.required, Validators.maxLength(500)]],
      recipient: ["reporter", Validators.required],
    });

    // Sync form value with adminMessage
    this.adminMessageForm.get("message")?.valueChanges.subscribe((value) => {
      this.adminMessage = value || "";
    });

    this.currentUserId = localStorage.getItem("userID");
  }

  async ngOnInit() {
    await this.loadReportDetails();
  }

  async loadReportDetails() {
    this.isLoading = true;
    try {
      const res: any = await this.http
        .getAdminReportDetails(this.data.reportId)
        .toPromise();

      // Handle API response structure
      if (res.success && res.data) {
        // New structure: data.report, data.chats, data.proofs, data.history
        if (res.data.report) {
          this.report = res.data.report;
          this.chats = res.data.chats || [];
          this.proofs = res.data.proofs || [];
          this.history = res.data.history || [];
        } else {
          // Fallback: old structure where data is directly the report
          this.report = res.data;
          this.chats = [];
          this.proofs = [];
          this.history = [];
        }

        // Map attachments if they are in the new format (array of objects with path and url)
        if (this.report.attachments && Array.isArray(this.report.attachments)) {
          this.report.attachments = this.report.attachments.map((att: any) => {
            // If attachment is an object with url, use url; otherwise use path
            if (typeof att === "object" && att.url) {
              return att.url;
            } else if (typeof att === "object" && att.path) {
              return att.path;
            } else if (typeof att === "string") {
              return att;
            }
            return att;
          });
        }

        // Normalize status - handle both "under_review" and "under review" formats
        if (this.report.status) {
          let status = this.report.status.toLowerCase();
          // Replace underscores with spaces
          status = status.replace(/_/g, " ");
          // Capitalize first letter of each word
          status = status
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          this.report.status = status;
        }
        // Normalize type - handle both "fraud" and other formats
        if (this.report.type) {
          let type = this.report.type.toLowerCase();
          // Replace underscores with spaces
          type = type.replace(/_/g, " ");
          // Capitalize first letter of each word
          type = type
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          this.report.type = type;
        }
      } else if (res.data) {
        // Fallback if response doesn't have success flag
        this.report = res.data;
      } else {
        this.report = res;
      }

      // Check for chat_id after report is loaded
      if (this.report) {
        // Initialize recipient options based on report data
        this.initializeRecipientOptions();

        // Try to get chat_id from report directly, or from order object
        if (this.report.chat_id) {
          this.chatId = this.report.chat_id;
        } else if (this.report.order && this.report.order.chat_id) {
          this.chatId = this.report.order.chat_id;
        } else if (this.report.order_id) {
          // If we have order_id but no chat_id in response, we might need to fetch order details
          // For now, we'll try to use order_id as chat_id if no chat_id is available
          // This is a fallback - ideally chat_id should be in the report response
        }

        // Use chats from API response if available
        if (this.chats && this.chats.length > 0) {
          this.chatMessages = this.chats;
          this.isLoadingChat = false;
        } else if (this.chatId) {
          // Fallback: Load chat details if chatId is available
          await this.loadChatDetails();
        } else {
          this.chatMessages = [];
          this.isLoadingChat = false;
        }
      }

      this.isLoading = false;
    } catch (err: any) {
      this.isLoading = false;
      if (err && err.error) {
        this.alertService.showAlert(
          "warning",
          `${err.error.message || "Error loading report details"}`,
        );
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error loading report details. Please try again",
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء تحميل تفاصيل التقرير، يرجى المحاولة مرة أخرى",
          );
        }
      }
      this.report = null;
    }
  }

  showActionDialog(action: string) {
    this.selectedAction = action;
    this.actionForm.patchValue({ action: action });
    this.showActionForm = true;
  }

  showStatusChangeDialog(): void {
    if (this.report && this.report.status) {
      this.statusChangeForm.patchValue({
        status: this.report.status.toLowerCase(),
      });
    }
    this.showStatusChangeForm = true;
  }

  async submitStatusChange(): Promise<void> {
    if (this.statusChangeForm.invalid || !this.report || !this.report.id) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please select a status");
      } else {
        this.alertService.showAlert("warning", "يرجى اختيار حالة");
      }
      return;
    }

    try {
      const statusData = {
        status: this.statusChangeForm.value.status,
        notes: this.statusChangeForm.value.notes || "",
        meta: this.statusChangeForm.value.meta || {},
      };

      const res: any = await this.http
        .changeReportStatus(this.report.id, statusData)
        .toPromise();

      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert(
          "success",
          "Report status changed successfully",
        );
      } else {
        this.alertService.showAlert("success", "تم تغيير حالة التقرير بنجاح");
      }

      this.showStatusChangeForm = false;
      this.statusChangeForm.reset();

      // Reload report details
      await this.loadReportDetails();
      this.dialogRef.close("updated");
    } catch (err: any) {
      if (err && err.error) {
        const errorMessage =
          err.error.message || err.error.error || "Error changing status";
        this.alertService.showAlert("warning", errorMessage);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error changing status. Please try again",
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء تغيير الحالة، يرجى المحاولة مرة أخرى",
          );
        }
      }
    }
  }

  cancelStatusChange(): void {
    this.showStatusChangeForm = false;
    this.statusChangeForm.reset();
  }

  async submitAction() {
    if (this.actionForm.invalid) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please select an action");
      } else {
        this.alertService.showAlert("warning", "يرجى اختيار إجراء");
      }
      return;
    }

    if (!this.report || !this.report.id) {
      this.alertService.showAlert("warning", "Report ID is missing");
      return;
    }

    // Use action value directly (already in API format)
    const apiAction = this.actionForm.value.action;

    const actionData = {
      action: apiAction,
      notes: this.actionForm.value.notes || "",
      meta: {},
    };

    try {
      const res: any = await this.http
        .performReportAction(this.report.id, actionData)
        .toPromise();

      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("success", "Action performed successfully");
      } else {
        this.alertService.showAlert("success", "تم تنفيذ الإجراء بنجاح");
      }

      this.showActionForm = false;
      this.actionForm.reset();
      this.selectedAction = "";

      // Reload report details to get updated status and actions
      await this.loadReportDetails();
      this.dialogRef.close("updated");
    } catch (err: any) {
      if (err && err.error) {
        const errorMessage =
          err.error.message || err.error.error || "Error performing action";
        this.alertService.showAlert("warning", errorMessage);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error performing action. Please try again",
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء تنفيذ الإجراء، يرجى المحاولة مرة أخرى",
          );
        }
      }
    }
  }

  cancelAction() {
    this.showActionForm = false;
    this.actionForm.reset();
    this.selectedAction = "";
  }

  // Helper method to normalize status for comparison
  normalizeStatus(status: string): string {
    if (!status) return "";
    // Convert to lowercase and replace underscores with spaces
    return status.toLowerCase().replace(/_/g, " ").trim();
  }

  getStatusClass(status: string): string {
    if (!status) return "status-default";
    // Updated: Only 3 statuses now - pending, rejected, resolved
    const normalizedStatus = status.toLowerCase().trim();
    const statusClasses: { [key: string]: string } = {
      pending: "status-pending",
      rejected: "status-rejected",
      resolved: "status-resolved",
    };
    return statusClasses[normalizedStatus] || "status-default";
  }

  getTypeClass(type: string): string {
    if (!type) return "type-default";
    // Normalize type to handle both "fraud" and "Fraud"
    const normalizedType =
      type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    const typeClasses: { [key: string]: string } = {
      "Product issue": "type-product",
      "Product Issue": "type-product",
      "Payment issue": "type-payment",
      "Payment Issue": "type-payment",
      Fraud: "type-fraud",
      Harassment: "type-harassment",
      Other: "type-other",
    };
    return typeClasses[normalizedType] || typeClasses[type] || "type-default";
  }

  formatDate(date: string): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getAttachmentUrl(attachment: string): string {
    if (!attachment) return "";
    // If attachment is already a full URL, return it
    if (attachment.startsWith("http://") || attachment.startsWith("https://")) {
      return attachment;
    }
    // Otherwise, prepend API URL
    return this.apiUrl + attachment;
  }

  getAttachmentsList(): any[] {
    if (!this.report || !this.report.attachments) return [];

    if (Array.isArray(this.report.attachments)) {
      // Handle both old format (strings) and new format (objects with path/url)
      return this.report.attachments.map((att: any) => {
        if (typeof att === "object" && att.url) {
          return att.url; // Use URL from API response
        } else if (typeof att === "object" && att.path) {
          return att.path; // Use path if URL not available
        } else if (typeof att === "string") {
          return att; // Already a string
        }
        return att;
      });
    }

    if (typeof this.report.attachments === "string") {
      try {
        const parsed = JSON.parse(this.report.attachments);
        if (Array.isArray(parsed)) {
          return parsed.map((att: any) => {
            if (typeof att === "object" && att.url) {
              return att.url;
            } else if (typeof att === "object" && att.path) {
              return att.path;
            }
            return att;
          });
        }
        return [this.report.attachments];
      } catch {
        return [this.report.attachments];
      }
    }

    return [];
  }

  isImage(attachment: string): boolean {
    if (!attachment) return false;
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];
    const lower = attachment.toLowerCase();
    return imageExtensions.some((ext) => lower.endsWith(ext));
  }

  getFileName(attachment: string): string {
    if (!attachment) return "";
    const parts = attachment.split("/");
    return parts[parts.length - 1];
  }

  openImage(url: string) {
    window.open(url, "_blank");
  }

  hasAttachments(): boolean {
    if (!this.report || !this.report.attachments) return false;
    if (Array.isArray(this.report.attachments)) {
      return this.report.attachments.length > 0;
    }
    if (typeof this.report.attachments === "string") {
      return this.report.attachments.length > 0;
    }
    return false;
  }

  // Chat related methods
  async loadChatDetails() {
    if (!this.chatId) {
      // If no chatId, try to load dummy data for testing
      this.loadDummyChatData();
      return;
    }

    this.isLoadingChat = true;
    try {
      // TODO: Uncomment when API is ready
      // const res: any = await this.http.getAdminChatDetails(this.chatId).toPromise();

      // For now, using dummy data
      this.loadDummyChatData();

      // Uncomment below when API is ready
      /*
      if (res.success && res.messages) {
        this.chatMessages = res.messages;
        this.chatProfile = res.profile;
        
        // Parse attachments if they are JSON strings
        this.chatMessages.forEach((message) => {
          if (message.attachments && typeof message.attachments === 'string') {
            try {
              message.attachments = JSON.parse(message.attachments);
            } catch (error) {
              console.error("Error parsing attachments:", error);
            }
          }
        });
      } else if (res.messages) {
        this.chatMessages = res.messages;
        this.chatProfile = res.profile;
      }
      */

      this.isLoadingChat = false;
      // Scroll to bottom after messages load
      setTimeout(() => this.scrollChatToBottom(), 100);
    } catch (err: any) {
      this.isLoadingChat = false;
      // Fallback to dummy data on error
      this.loadDummyChatData();
      /*
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message || "Error loading chat"}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error loading chat. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء تحميل المحادثة، يرجى المحاولة مرة أخرى");
        }
      }
      */
    }
  }

  loadDummyChatData() {
    // Dummy chat data matching API response format
    this.chatMessages = [
      {
        id: 535,
        sender_id: 144,
        receiver_id: 172,
        product_id: 292,
        folder: null,
        attachments: null,
        message:
          "Hello, I'm interested in this product. Can you provide more details?",
        read_at: "2025-11-26 18:11:40",
        action_type: null,
        is_system_generated: 0,
        created_at: "2025-11-26T18:11:40.000000Z",
        updated_at: "2025-11-26T18:11:40.000000Z",
        direction: "BTS", // Buyer to Seller (left side)
        offer_price: null,
        valid_until: null,
        ship_price: null,
        source: "buy_now",
        days: null,
      },
      {
        id: 534,
        sender_id: 144,
        receiver_id: 172,
        product_id: 292,
        folder: null,
        attachments: null,
        message:
          "Buyer have initiated the order. Please confirm watch availability by adding shipping cost.",
        read_at: "2025-11-26 18:11:35",
        action_type: "buy_now",
        is_system_generated: 1,
        created_at: "2025-11-26T18:11:33.000000Z",
        updated_at: "2025-11-26T18:11:35.000000Z",
        direction: "BTS",
        offer_price: null,
        valid_until: null,
        ship_price: null,
        source: "buy_now",
        days: null,
      },
      {
        id: 533,
        sender_id: 172,
        receiver_id: 144,
        product_id: 292,
        folder: null,
        attachments: null,
        message:
          "Sure! The product is available. I can ship it within 2-3 business days.",
        read_at: "2025-11-26 18:12:15",
        action_type: null,
        is_system_generated: 0,
        created_at: "2025-11-26T18:12:15.000000Z",
        updated_at: "2025-11-26T18:12:15.000000Z",
        direction: "STB", // Seller to Buyer (right side)
        offer_price: null,
        valid_until: null,
        ship_price: null,
        source: "chat",
        days: null,
      },
      {
        id: 532,
        sender_id: 144,
        receiver_id: 172,
        product_id: 292,
        folder: null,
        attachments: [
          {
            path: "reports/1763924354/1763924354_692359829149b.png",
            url: "https://api.chronosouq.com/reports/1763924354/1763924354_692359829149b.png",
          },
        ],
        message: "Here's a photo of what I'm looking for",
        read_at: "2025-11-26 18:13:20",
        action_type: null,
        is_system_generated: 0,
        created_at: "2025-11-26T18:13:20.000000Z",
        updated_at: "2025-11-26T18:13:20.000000Z",
        direction: "BTS",
        offer_price: null,
        valid_until: null,
        ship_price: null,
        source: "chat",
        days: null,
      },
      {
        id: 531,
        sender_id: 172,
        receiver_id: 144,
        product_id: 292,
        folder: null,
        attachments: null,
        message:
          "Perfect! That matches our product. Would you like to proceed with the purchase?",
        read_at: "2025-11-26 18:14:05",
        action_type: null,
        is_system_generated: 0,
        created_at: "2025-11-26T18:14:05.000000Z",
        updated_at: "2025-11-26T18:14:05.000000Z",
        direction: "STB",
        offer_price: null,
        valid_until: null,
        ship_price: null,
        source: "chat",
        days: null,
      },
      {
        id: 530,
        sender_id: 144,
        receiver_id: 172,
        product_id: 292,
        folder: null,
        attachments: null,
        message:
          "Yes, I would like to buy it. What's the total price including shipping?",
        read_at: "2025-11-26 18:15:30",
        action_type: null,
        is_system_generated: 0,
        created_at: "2025-11-26T18:15:30.000000Z",
        updated_at: "2025-11-26T18:15:30.000000Z",
        direction: "BTS",
        offer_price: null,
        valid_until: null,
        ship_price: null,
        source: "chat",
        days: null,
      },
      {
        id: 529,
        sender_id: 172,
        receiver_id: 144,
        product_id: 292,
        folder: null,
        attachments: null,
        message:
          "The total price is $500 including shipping. Payment can be made through the platform.",
        read_at: "2025-11-26 18:16:45",
        action_type: null,
        is_system_generated: 0,
        created_at: "2025-11-26T18:16:45.000000Z",
        updated_at: "2025-11-26T18:16:45.000000Z",
        direction: "STB",
        offer_price: null,
        valid_until: null,
        ship_price: null,
        source: "chat",
        days: null,
      },
    ];

    // Dummy profile data
    this.chatProfile = {
      id: 144,
      name: "attaRehman",
      email: "m.atta.shah7@gmail.com",
      email_verified_at: "2025-10-27T13:40:55.000000Z",
      type: "user",
      created_at: "2025-10-27T13:40:22.000000Z",
      updated_at: "2025-10-27T13:42:03.000000Z",
      country: null,
      city: null,
      delivery_time: null,
      chat_folder: null,
      first_name: null,
      last_name: null,
      gender: null,
      date_of_birth: null,
      phone_number: null,
      language: null,
      occupation: null,
      about_me: null,
      profile_image: null,
    };

    this.isLoadingChat = false;
    // Scroll to bottom after messages load
    setTimeout(() => this.scrollChatToBottom(), 100);
  }

  scrollChatToBottom() {
    if (this.chatContainer?.nativeElement) {
      const container = this.chatContainer.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  getReversedChatMessages() {
    // Use chats from API if available, otherwise use chatMessages
    const messages =
      this.chats && this.chats.length > 0 ? this.chats : this.chatMessages;
    return messages ? [...messages].reverse() : [];
  }

  isBuyerMessage(message: any): boolean {
    // BTS = Buyer to Seller (left side)
    // STB = Seller to Buyer (right side)
    return message.direction === "BTS";
  }

  isSellerMessage(message: any): boolean {
    return message.direction === "STB";
  }

  isSystemMessage(message: any): boolean {
    return (
      message.is_system_generated === 1 || message.is_system_generated === true
    );
  }

  // Helper methods for proofs
  getProofAttachments(proof: any): any[] {
    if (!proof || !proof.proof_attachments) return [];
    return Array.isArray(proof.proof_attachments)
      ? proof.proof_attachments
      : [];
  }

  getProofAttachmentUrl(attachment: any): string {
    if (typeof attachment === "string") {
      return this.apiUrl + attachment;
    } else if (attachment && attachment.url) {
      return attachment.url;
    } else if (attachment && attachment.path) {
      return this.apiUrl + attachment.path;
    }
    return "";
  }

  formatActionType(actionType: string): string {
    if (!actionType) return "";
    // Format action types for display
    const actionMap: any = {
      buy_now: "Buy Now",
      payment_issue: "Payment Issue Reported",
      delivery_delay: "Delivery Delay Reported",
      mark_sold: "Marked as Sold",
      update_offer: "Offer Updated",
      cancel_offer: "Offer Cancelled",
    };
    return (
      actionMap[actionType] ||
      actionType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  }

  formatChatTime(date: string): string {
    if (!date) return "N/A";
    return timeago.format(new Date(date));
  }

  formatChatDate(date: string): string {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getAttachmentType(attachment: string): "image" | "video" | "unknown" {
    if (!attachment) return "unknown";
    const lower = String(attachment).toLowerCase();
    if (
      lower.endsWith(".jpg") ||
      lower.endsWith(".jpeg") ||
      lower.endsWith(".png") ||
      lower.endsWith(".gif")
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

  isArray(attachments: any): boolean {
    return Array.isArray(attachments);
  }

  initializeRecipientOptions() {
    this.recipientOptions = [];

    const reporterName =
      this.report.reporter?.name ||
      this.report.reporter_name ||
      `User #${this.report.reporter_id}`;
    const reportedUserName =
      this.report.reported_user?.name ||
      this.report.reported_user_name ||
      `User #${this.report.reported_user_id}`;

    if (this.report.reporter_id) {
      this.recipientOptions.push({
        value: "reporter",
        label: `Reporter (${reporterName})`,
      });
    }

    if (this.report.reported_user_id) {
      this.recipientOptions.push({
        value: "reported_user",
        label: `Reported User (${reportedUserName})`,
      });
    }

    if (this.report.reporter_id && this.report.reported_user_id) {
      this.recipientOptions.push({
        value: "both",
        label: "Both (Reporter & Reported User)",
      });
    }

    // Set default recipient if options are available
    if (this.recipientOptions.length > 0) {
      this.adminMessageForm.patchValue({
        recipient: this.recipientOptions[0].value,
      });
    }
  }

  async sendAdminMessage() {
    if (this.adminMessageForm.invalid || !this.adminMessage.trim()) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please enter a message");
      } else {
        this.alertService.showAlert("warning", "يرجى إدخال رسالة");
      }
      return;
    }

    if (!this.chatId) {
      this.alertService.showAlert("warning", "Chat ID is missing");
      return;
    }

    const recipient = this.adminMessageForm.value.recipient;
    const receiverIds: number[] = [];

    // Determine receiver IDs based on selected recipient
    if (recipient === "reporter" && this.report.reporter_id) {
      receiverIds.push(this.report.reporter_id);
    } else if (recipient === "reported_user" && this.report.reported_user_id) {
      receiverIds.push(this.report.reported_user_id);
    } else if (recipient === "both") {
      if (this.report.reporter_id) {
        receiverIds.push(this.report.reporter_id);
      }
      if (this.report.reported_user_id) {
        receiverIds.push(this.report.reported_user_id);
      }
    }

    if (receiverIds.length === 0) {
      this.alertService.showAlert("warning", "No valid recipient selected");
      return;
    }

    // Send message to each recipient
    const sendPromises = receiverIds.map((receiverId) => {
      const formData = new FormData();
      formData.append("message", this.adminMessage.trim());
      formData.append("chat_id", this.chatId.toString());
      formData.append("receiver_id", receiverId.toString());
      return this.http.sendAdminMessage(formData).toPromise();
    });

    try {
      await Promise.all(sendPromises);

      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("success", "Message sent successfully");
      } else {
        this.alertService.showAlert("success", "تم إرسال الرسالة بنجاح");
      }

      this.adminMessage = "";
      this.adminMessageForm.patchValue({ message: "" });
      // Keep the recipient selection

      // Reload chat to get updated messages
      await this.loadChatDetails();
    } catch (err: any) {
      if (err && err.error) {
        const errorMessage =
          err.error.message || err.error.error || "Error sending message";
        this.alertService.showAlert("warning", errorMessage);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error sending message. Please try again",
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى",
          );
        }
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
