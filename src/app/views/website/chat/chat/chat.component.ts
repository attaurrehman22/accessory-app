import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/services/http/http.service";
import * as timeago from "timeago.js";
import { AfterViewChecked } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CustomOfferComponent } from "src/app/views/modal/custom-offer/custom-offer.component";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { AddShippingComponent } from "src/app/views/modal/add-shipping/add-shipping.component";
import { ConfirmationModelComponent } from "src/app/views/modal/confirmation-model/confirmation-model.component";
import { ModelLoginComponent } from "src/app/views/auth/model-login/model-login.component";
import { ReportChatComponent } from "src/app/views/modal/report-chat/report-chat.component";
import { TranslateService } from "@ngx-translate/core";
import { LanguageService } from "src/services/lang-service/language.service";
import { environment } from "src/environments/environment";

interface MessageFormData {
  product_id?: any;
  message: string;
  attachments: any[];
  receiver_id?: any;
  chat_id?: string;
}

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  apiUrl = environment.apipath + "/";
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  isActive: any = "All";
  newMessage: string = "";
  productDeatils: any;
  detailsWithLatestMessages: any;
  messages: any;
  userID: string | null;
  filteredChats: any[] = [];
  chats: any;
  getProductDetails: any;
  chat_id: any;
  noImageName: any = "Kamran Ghulam";
  noMessageDetails: any;
  isLoading: boolean = true;

  constructor(
    private http: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService
  ) {
    this.translateService.addLangs(this.supportLanguages);
    const savedLang = this.languageService.getCurrentLanguage();
    if (this.supportLanguages.includes(savedLang)) {
      this.translateService.use(savedLang);
    } else {
      const browserLang = this.translateService.getBrowserLang();
      this.currentLanguage = browserLang;

      if (this.supportLanguages.includes(browserLang)) {
        this.translateService.use(browserLang);
        this.languageService.setLanguage(browserLang);
      }
    }
  }

  UserNameOFMessenger: any;

  getNameOfMessenger(chat) {
    return (chat?.product?.created_by?.id == this.userID ? chat?.buyer : chat.seller) || 'N/A'
  }

  getCityOfMessenger(chat) {
    return (chat?.product?.created_by?.id == this.userID ? chat.buyer_city : chat.seller_city) || 'N/A'
  }

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "dialog-box" },
    });

    dialogRef.afterClosed().subscribe((result) => { });
  }

  personProfile: any;

  async getProfileDetails() {
    try {
      const res: any = await this.http.gtUserDetails().toPromise();
      this.personProfile = res.user;
      this.personProfile.profile_image = this.personProfile?.profile_image?.replace(/\\/g, "");
    } catch (err) {
      console.error("Error getting profile details:", err);
    }
  }

  private intervalId: any;

  async ngOnInit(): Promise<void> {
    this.user_id = localStorage.getItem("userID");
    this.userID = localStorage.getItem('userID');
    if (!this.user_id) {
      this.loginFirst();
      this.isLoading = false; // Mark loading as complete if user not logged in
      return;
    }
    
    try {
      // Initialize profile and chats first
      this.isLoading = true; // Set loading to true before fetching data
      console.log("history", history)
      await this.getProfileDetails();
      await this.getLatestMessage(true); // Pass true to indicate initial load

      if(history?.state?.firstMessage){
        await this.getDetailsofProduct(history?.state?.product_ID);
        this.productDeatils = this.getProductDetails;
        const exists = this.filteredChats.find(
          (chat: any) => chat.product_id == history?.state?.product_ID
        );
        if(exists){
         this.getMesageDetails(exists)
        }else{
          console.log("history.state.product_Details.chats",history?.state?.product_Details?.chats)
          this.filteredChats.unshift(history.state.product_Details.chats);
        }
        console.log("NEW FILTERED CHATS",this.filteredChats)
      }

      if (history?.state?.fromRoute == "gotToChat") {
        if (history?.state?.chatID) {
          this.chat_id = history?.state?.chatID;
          this.chat_id_for_remove_unread_count = this.chat_id;
        }
        
        if (history?.state?.data?.id) {
          console.log("calling this line 130")
          await this.getDetailsofProduct(history.state.data.id);
        } 
        
        if(history?.state?.fromRoute == "gotToChat" && !history?.state?.chatID && history?.state?.data?.id){
          if(this.filteredChats.length > 0){  
            this.chat_id = this.filteredChats.find(chat => chat.product_id == history?.state?.data?.id)?.chat_id;
            this.chat_id_for_remove_unread_count = this.chat_id;
            console.log("calling this line 138")
            await this.getChatDetails();
          }
        }
        
        if (history?.state?.productID) {
          console.log("calling this line 144")
          await this.getDetailsofProduct(history?.state?.productID);
        }
        
        if (history?.state?.chatDetails) {
          console.log("calling this line 149")
          await this.getMesageDetails(history?.state?.chatDetails)
        }
        
        if (!history?.state?.chatDetails && history?.state?.data && history?.state?.chatID) {
          try {
            console.log("calling this line 155")
            const res: any = await this.http.getChatsWithLatestMessage().toPromise();
            const chatList = res.chats.map(
              (chat) => {
                chat.product.main_image = chat?.product?.main_image?.replace(/\\/g, "/");
                return chat;
              }
            );
            const getFilterdChat = chatList.filter(
              (chat: any) => chat.chat_id == history?.state?.chatID)
            if (getFilterdChat && getFilterdChat.length > 0) {
              await this.getMesageDetails(getFilterdChat[0])
            }
          } catch (err) {
          }
        }
        else {
          if (!this.chat_id && history?.state?.chatID) {
            this.chat_id = history?.state?.chatID
          }
          console.log("calling this line 175")
          await this.getChatDetails();
        }
      }
      
      if (history?.state?.data && history?.state?.fromRoute != "gotToChat") {
        this.productDeatils = history.state.data;
        this.noMessageDetails = this.productDeatils.created_by;
      }

      if(history?.state?.chatID && history?.state?.chatRouteFrom == "orderDetails"){
        this.chat_id = history?.state?.chatID;
        this.chat_id_for_remove_unread_count = this.chat_id;
      }
      
      if (history?.state?.chat) {
        console.log("calling this line 185")
        await this.getLatestMessage(false); // Not initial load
        await this.getDetailsofProduct(history?.state?.chat.product_id);
        this.chat_id = history?.state?.chat.chat_id;
        await this.getChatDetails();
      }

      if (history?.state?.chatRouteFrom) {

        const data = history.state.productDetailsFromOrder
        this.UserNameOFMessenger = (data?.order?.product?.created_by == this.userID ? data?.order?.buyer?.name : data?.order?.buyer?.name)
        this.userCity = (data?.order?.product?.created_by == this.userID ? data?.order?.buyer?.city : data?.order?.buyer?.city)
        if(history?.state?.chat_ID){
          this.chat_id_for_remove_unread_count = history?.state?.chat_ID;
        }
        this.sellerProductID = history.state.productID;
        this.sellerID = data?.order?.product?.created_by;
        this.user_id = localStorage.getItem("userID");

        if (this.sellerID == this.user_id) {
          this.isBuyerUser = false;
        } else {
          this.isBuyerUser = true;
        }

        this.chat_id = history?.state?.chat_ID;
        this.getProductDetails = data?.order?.product;
        await this.getChatDetails();
      }

      if (this.productDeatils) {
        console.log("calling this line 215")
        if(history?.state?.firstMessage){

        }else{
          await this.getLatestMessage(false); // Not initial load
          await this.getDetailsofProduct(this.productDeatils?.id);
        }
      } else {
        console.log("calling this line 218")
        await this.getLatestMessage(false); // Not initial load
      }

      // Set up interval for periodic updates
      this.intervalId = setInterval(async () => {
        try {
          await this.getLatestMessage();
          if (this.chat_id) {
            await this.getChatDetails()
          }
        } catch (err) {
          console.error("Error in interval update:", err);
        }
      }, 10000);

    } catch (err) {
      console.error("Error in ngOnInit:", err);
      this.isLoading = false; // Mark loading as complete even on error
    }
  }

  ngOnDestroy(): void {
    // Clear interval when component destroyed
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  @ViewChild("chatContainer") chatContainer: ElementRef;

  ngAfterViewChecked() {
    if (this.chatContainer?.nativeElement) {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    const container = this.chatContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  unreadFilter() {
    console.log("Before Calling",this.filteredChats)
    // this.chats = this.chats.filter((item: any) => item.unread_count > 0);
    const filteredChats = this.chats.filter((item: any) => item.unread_count > 0);
    this.filteredChats = filteredChats
    console.log("After Calling",this.filteredChats)
    // Only update this.chats if filteredChats has at least one item
    // if (filteredChats.length == 0) {
    //   this.chats = [...this.chats, ...filteredChats];
    // }
  }

  showAllMessages(){
    console.log("Before Calling",this.filteredChats)
    this.filteredChats = this.chats
    console.log("After Calling",this.filteredChats)
  }

  async checkReportChatAvailability(): Promise<void> {
    try {
      // First, fetch order ID from chat_id
      if (this.chat_id) {
        const orderRes: any = await this.http.getOrderByChatId(this.chat_id).toPromise();
        console.log("Order Response:", orderRes);
        
        if (orderRes && orderRes.id) {
          this.orderId = orderRes.id;
          console.log("Order ID found:", this.orderId);
          
          // Now check allowed methods
          try {
            const methodsRes: any = await this.http.getAllowedMethods(this.orderId).toPromise();
            console.log("Allowed Methods Response:", methodsRes);
            
            if (methodsRes && methodsRes.data) {
              this.allowedMethods = Array.isArray(methodsRes.data) ? methodsRes.data : 
                                   (methodsRes.data.methods || methodsRes.data.allowed_methods || []);
              
              console.log("Allowed Methods Array:", this.allowedMethods);
              
              // Check if report_chat is in allowed methods
              // Support multiple response formats
              this.isReportChatEnabled = 
                this.allowedMethods.includes('report_chat') || 
                this.allowedMethods.some((method: any) => {
                  if (typeof method === 'string') {
                    return method === 'report_chat' || method.toLowerCase().includes('report');
                  } else if (typeof method === 'object') {
                    return method.name === 'report_chat' || 
                           method.method === 'report_chat' ||
                           method.type === 'report_chat';
                  }
                  return false;
                });
              
              console.log("Is Report Chat Enabled:", this.isReportChatEnabled);
            } else {
              // If allowed methods API doesn't return data, enable report chat if order exists
              console.log("Allowed methods data not found, enabling report chat by default");
              this.isReportChatEnabled = true;
            }
          } catch (methodsErr) {
            console.error("Error fetching allowed methods:", methodsErr);
            // If allowed methods API fails, enable report chat if order exists
            // This allows report chat to work even if allowed methods API is not working
            console.log("Allowed methods API failed, enabling report chat by default");
            this.isReportChatEnabled = true;
          }
        } else {
          this.orderId = null;
          this.isReportChatEnabled = false;
          console.log("Order ID not found in response");
        }
      } else {
        this.orderId = null;
        this.isReportChatEnabled = false;
        console.log("Chat ID not available");
      }
    } catch (err) {
      console.error("Error checking report chat availability:", err);
      this.orderId = null;
      this.isReportChatEnabled = false;
      // Don't show error to user, just disable the feature
    }
  }

  async reportChat(){
    // If orderId is available, allow report chat even if isReportChatEnabled is false
    // This ensures modal opens if order exists
    if (!this.isReportChatEnabled && !this.orderId) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Report chat is not available for this order.");
      } else {
        this.alertService.showAlert("warning", "تقرير الدردشة غير متاح لهذا الطلب.");
      }
      return;
    }
    
    // If orderId exists but isReportChatEnabled is false, try to enable it
    if (this.orderId && !this.isReportChatEnabled) {
      console.log("Order ID exists but report chat is disabled, enabling it");
      this.isReportChatEnabled = true;
    }

    // Get the reported user ID - the opposite party in the chat
    let reportedUserId = this.reciever_ID;
    const currentUserId = localStorage.getItem("userID");
    
    // Try to get reportedUserId from order if available
    if (!reportedUserId && this.orderId && this.chat_id) {
      try {
        const orderRes: any = await this.http.getOrderByChatId(this.chat_id).toPromise();
        if (orderRes) {
          // If current user is buyer, report seller (product owner)
          // If current user is seller, report buyer
          if (orderRes.buyer_id && orderRes.buyer_id.toString() === currentUserId) {
            // Current user is buyer, so report seller (product owner)
            if (this.getProductDetails && this.getProductDetails.created_by) {
              reportedUserId = this.getProductDetails.created_by.id;
            }
          } else if (orderRes.buyer_id) {
            // Current user is seller, so report buyer
            reportedUserId = orderRes.buyer_id;
          }
        }
      } catch (err) {
        console.error("Error fetching order for reportedUserId:", err);
      }
    }
    
    // If reciever_ID is not available, try to get it from UserNameOFMessenger
    if (!reportedUserId && this.UserNameOFMessenger) {
      reportedUserId = this.UserNameOFMessenger?.id || this.UserNameOFMessenger;
    }
    
    // If still not available, try to get from current chat context
    if (!reportedUserId && this.messages && this.messages.length > 0) {
      const firstMessage = this.messages[0];
      reportedUserId = firstMessage.sender_id === currentUserId 
        ? firstMessage.receiver_id 
        : firstMessage.sender_id;
    }

    // If still not available, try to get from product details
    if (!reportedUserId && this.getProductDetails) {
      if (this.getProductDetails.created_by) {
        const productOwnerId = this.getProductDetails.created_by.id;
        if (productOwnerId && productOwnerId.toString() !== currentUserId) {
          reportedUserId = productOwnerId;
        }
      }
    }

    if(reportedUserId == currentUserId){
      if(this.reciever_ID && this.reciever_ID != currentUserId){
        reportedUserId = this.reciever_ID;
      }
    }

    console.log("Report Chat - Current User ID:", currentUserId);
    console.log("Report Chat - Reported User ID:", reportedUserId);
    console.log("Report Chat - Order ID:", this.orderId);

    if (!reportedUserId) {
      console.error("Unable to identify reported user ID");
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Unable to identify the user to report. Please try again later.");
      } else {
        this.alertService.showAlert("warning", "تعذر تحديد المستخدم للإبلاغ عنه. يرجى المحاولة مرة أخرى لاحقًا.");
      }
      return;
    }

    const dialogRef = this.dialog.open(ReportChatComponent, {
      width: "600px",
      data: {
        reportedUserId: reportedUserId,
        orderId: this.orderId,
        chatId: this.chat_id,
        productId: this.messages[0]?.product_id,
        allowedMethods: this.allowedMethods,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Report was submitted successfully
        console.log("Report submitted successfully");
      }
    });
  }

  async getLatestMessage(isInitialLoad: boolean = false) {
    try {
      const res: any = await this.http.getChatsWithLatestMessage().toPromise();
      this.chats = res.chats.map((chat) => {
        chat.product.main_image = chat?.product?.main_image?.replace(/\\/g, "/");
        return chat;
      });
      this.filteredChats = this.chats;
      // Only update loading state on initial load, not on interval updates
      if (isInitialLoad) {
        this.isLoading = false;
      }
      return res;
    } catch (err: any) {
      // Only update loading state on initial load, not on interval updates
      if (isInitialLoad) {
        this.isLoading = false;
      }
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("warning", "Error in getting message. Please try again");
        } else {
          this.alertService.showAlert("warning", "حدث خطأ أثناء جلب الرسالة، يرجى المحاولة مرة أخرى");
        }
      }
      throw err;
    }
  }


  reciever_ID: any;
  isShowBuyNowOffer: boolean = false;
  isBuyerUser: boolean = false;

  sellerProductID: any;
  sellerID: any;

  user_id: any;
  chat_id_for_remove_unread_count: any;
  userCity: any;
  
  // Report chat related
  orderId: number | null = null;
  isReportChatEnabled: boolean = false;
  allowedMethods: any[] = [];

  getInitialsofUsername(name) {
    if (!name) {
      return '';
    }

    const words = name.trim().split(' ');

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    } else {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
  }

  async getMesageDetails(param: any) {
    console.log("Param",param)
    this.UserNameOFMessenger = (param?.product?.created_by?.id == this.userID ? param.buyer : param.seller)
    this.userCity = (param.product.created_by?.id == this.userID ? param.buyer_city : param.seller_city)
    this.chat_id_for_remove_unread_count = param.chat_id;
    this.sellerProductID = param.product_id;
    this.sellerID = param?.product?.created_by?.id;
    this.user_id = localStorage.getItem("userID");

    if (this.sellerID == this.user_id) {
      this.isBuyerUser = false;
    } else {
      this.isBuyerUser = true;
    }

    this.chat_id = param.chat_id;
    this.getProductDetails = param.product;
    await this.getChatDetails();
  }

  isOfferShowToUserandDealer: boolean = false;
  isShowPaymentMethod: boolean = false;
  isShowMarkAsSold: boolean = false;
  isShowCancelOffertoBuyer: boolean = false;
  offerTypeStatus: boolean = false;
  isExistMakePayment: boolean = true;
  isActionTypeMakePaymentToHideCustomOffer: boolean = false;
  userProfile: any;
  isProductSold: boolean = false;
  async getChatDetails() {
    let actionTypeforCallingCustomOffer = false;
    if (history?.state?.data) {
      history?.replaceState({ data: null }, document.title);
    }
    if (history?.state?.chatRouteFrom) {
      this.chat_id = history?.state?.chatID
    }
    
    try {
      const res: any = await this.http.getChatsDetails(this.chat_id).toPromise();
      this.userProfile = res.profile;
      if (res.is_product_sold == 1) {
        this.isProductSold = true
      } else {
        this.isProductSold = false
      }
      this.userProfile.profile_image = this.userProfile?.profile_image?.replace(/\\/g, '');
      this.messages = res.messages;
      
      // Set isBuyerUser based on product owner if getProductDetails is available
      if (this.getProductDetails?.created_by?.id) {
        const useridd = localStorage.getItem("userID");
        if (this.getProductDetails.created_by.id == useridd) {
          this.isBuyerUser = false; // User is the seller
        } else {
          this.isBuyerUser = true; // User is the buyer
        }
      }
      
      if (res.messages.length > 0) {
        let useridd = localStorage.getItem("userID");
        // this.reciever_ID = res.messages[1]?.receiver_id;
        if (useridd == res.messages[0]?.sender_id) {
          this.reciever_ID = res.messages[0]?.receiver_id;
        } else if (res.messages[0]?.receiver_id === null) {
          this.reciever_ID = res.messages[1]?.receiver_id;
        } else {
          this.reciever_ID = res.messages[0]?.sender_id;
        }

      }

      // Fetch order ID and check allowed methods for report chat
      if (this.chat_id) {
        await this.checkReportChatAvailability();
      }
      let count_sen_rec = 0;
      // Reset isBuyNowFromChatCheck and check all messages
      this.isBuyNowFromChatCheck = false;
      this.isActionTypeMakePaymentToHideCustomOffer = false;
      this.messages.forEach((message) => {
        if (message.attachments) {
          try {
            message.attachments = JSON.parse(message.attachments);
          } catch (error) {
            console.error("Error parsing attachments:", error);
          }
        }

        if (message.action_type == "offer") {
          actionTypeforCallingCustomOffer = true;
        }

        if (message.action_type === "make_payment") {
          this.isExistMakePayment = false;
        }

        if (message.valid_until) {
          this.isCancelOfferBuyer = true;
        }

        if (message.offer_price >= 1) {
          this.isOfferShowToUserandDealer = true;
        }
        let useridd = localStorage.getItem("userID");

        if (message.sender_id == useridd) {
          count_sen_rec++;
        }

        if (message.sender_id != useridd) {
          count_sen_rec++;
        }

        // Check if any message has buy_now action_type
        if (message.action_type == "buy_now") {
          this.isBuyNowFromChatCheck = true;
        }

        if (message.action_type === "add_shipping") {
          this.isShowPaymentMethod = true;
        }

        if (message.action_type === "mark_sold") {
          this.isShowMarkAsSold = true;
        }

        if (message.action_type === "update_offer") {
          this.isShowCancelOffertoBuyer = true;
        }

        if (message.action_type === "offer") {
          this.isCustomOffer = true;
        }

        if (message.action_type === "make_payment") {
          this.isActionTypeMakePaymentToHideCustomOffer = true;
        }
      });

      if (this.messages[0]?.message == "Buyer have start the Order Process") {
        count_sen_rec++;
      }
      if (count_sen_rec >= 2) {
        this.isShowBuyNowOffer = true;
      }

      if (actionTypeforCallingCustomOffer) {
        await this.getCustomOffer();
      }
      return res;
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error in getting chat Details. Please try again"
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء جلب تفاصيل الدردشة، يرجى المحاولة مرة أخرى"
          );
        }
      }
      throw err;
    }
  }


  hasCancelOffer() {
    return this.reversedMessages.some(msg => msg.action_type === 'cancel_order');
  }

  hasBuyNow(): boolean {
    if (!this.reversedMessages) return false;

    // 1. Direct check for buy_now
    if (this.reversedMessages.some(msg => msg.action_type === 'buy_now')) {
      return true;
    }

    // 2. Check for both BTS and STB with null action_type
    const hasBTS = this.reversedMessages.some(msg => msg.direction === 'BTS' && msg.action_type === null);
    const hasSTB = this.reversedMessages.some(msg => msg.direction === 'STB' && msg.action_type === null);

    if (hasBTS && hasSTB) {
      return true;
    }

    // 3. Default
    return false;
  }



  editOffer(customOfferDetails: any) {
    const dialogRef = this.dialog.open(CustomOfferComponent, {
      width: "600px",
      data: {
        customOfferDetails: customOfferDetails,
        param: "editComp",
        userCategory: this.isBuyerUser,
        header: "Edit Offer",
        headerPara: "Edit custom offer.",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formData = {
          chat_id: customOfferDetails.chat_id,
          product_id: this.messages[0].product_id,
          action_type: "update_offer",
          receiver_id: this.reciever_ID.toString(),
        };
        this.http.sendMessage(formData).subscribe(
          async (res) => {
            await this.getChatDetails();
            await this.getLatestMessage();
          },
          (err) => {
            if (err && err.error) {
              this.alertService.showAlert("warning", `${err.error.message}`);
            } else {
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in sending message. Please try again"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى"
                );
              }
            }
          }
        );
      }
    });
  }

  isCustomOffer: boolean = false;
  customOfferDetails: any;
  isOfferStatusAccepted: boolean = false;
  isProductReserved: boolean = false;
  isCancelOffer: boolean = false;

  async getCustomOffer() {
    try {
      const res: any = await this.http.offerByFilter(this.getProductDetails?.id, this.chat_id).toPromise();
      this.isCustomOffer = true;
      this.customOfferDetails = res.offer;
      if (res.offer.offers_status == "canceled") {
        this.isCancelOffer = true;
      }
      if (res.offer.offers_status === "accepted") {
        this.isOfferStatusAccepted = true;
      }
      if (
        res.offer.offers_status !== "accepted" &&
        res.offer.product.sale_status === "reserved"
      ) {
        this.isProductReserved = true;
      } else {
        this.isProductReserved = false;
      }
      return res;
    } catch (err) {
      console.error("Error getting custom offer:", err);
      throw err;
    }
  }

  isArray(attachments: any): boolean {
    return Array.isArray(attachments);
  }

  async getDetailsofProduct(ID: any) {
    try {
      const res: any = await this.http.getProductsByID(ID).toPromise();
      if (res.data.main_image) {
        res.data.main_image = res?.data?.main_image?.replace(/\\/g, "");
      }
      this.getProductDetails = res.data;
      return res;
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error in getting product details"
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء جلب تفاصيل المنتج"
          );
        }
      }
      throw err;
    }
  }

  activeOption(option: any) {
    this.isActive = option;
    if (option === "All") {
      this.filteredChats = this.chats;
    } else if (option == "Buy") {
      this.filteredChats = this.chats.filter((item: any) => {
        return item?.product?.created_by?.id != localStorage.getItem("userID");
      });
    } else if (option == "Sell") {
      this.filteredChats = this.chats.filter((item: any) => {
        return item?.product?.created_by?.id == localStorage.getItem("userID");
      });
    }

    if (this.chats.length === 0) {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert(
          "warning",
          "No Chats Available for this filter"
        );
      } else {
        this.alertService.showAlert(
          "warning",
          "لا توجد محادثات متاحة لهذا الفلتر"
        );
      }
    }
  }

  formatTime(date: string): string {
    return timeago.format(new Date(date));
  }
  get reversedMessages() {
    return this.messages ? [...this.messages].reverse() : [];
  }

  //  isArray(attachments: any): boolean {
  //     return Array.isArray(attachments);
  //   }

  getAttachmentType(attachment: string): 'image' | 'video' | 'unknown' {
    const lower = attachment.toLowerCase();
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.png') || lower.endsWith('.gif')) {
      return 'image';
    }
    if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.endsWith('.ogg')) {
      return 'video';
    }
    return 'unknown';
  }



  async sendMessage(): Promise<void> {
    const trimmedMessage = this.newMessage?.trim();
    if (!trimmedMessage && !this.selectedImages) {
      return; // Don't send API request if message is only spaces or empty
    }
    console.log("Sending message:", trimmedMessage);
    const formData = new FormData();
    if (this.newMessage.trim()) {
      formData.append("message", this.newMessage);
    }

    if (this.selectedImages.length > 0) {
      this.selectedImages.forEach((file) => {
        formData.append("attachments[]", file);
      });
    }

    if (this.messages && this.messages.length > 0) {
      formData.append("product_id", this.messages[0].product_id);
    } else if (this.productDeatils) {
      formData.append("product_id", this.productDeatils?.id);
    }

    if (this.chat_id) {
      formData.append("chat_id", this.chat_id.toString());
    }

    if (this.reciever_ID) {
      formData.append("receiver_id", this.reciever_ID.toString());
    } else if (!this.reciever_ID && this.productDeatils) {
      this.reciever_ID = this.productDeatils?.created_by?.id;
      formData.append(
        "receiver_id",
        this.productDeatils.created_by?.id.toString()
      );
    }

    if (this.buyNowStatus) {
      formData.append("action_type", "buy_now");
    }

    try {
      const res: any = await this.http.sendMessage(formData).toPromise();
      this.chat_id = res?.data?.chat_id;
      await this.getChatDetails();
      await this.getLatestMessage();
    } catch (err: any) {
      // Handle pending report blocking
      if (err && err.error) {
        const errorMessage = err.error.message || err.error.error || '';
        // Check if error is due to pending report blocking
        if (errorMessage.toLowerCase().includes('pending report') || 
            errorMessage.toLowerCase().includes('action blocked') ||
            err.error.error === 'Action blocked') {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("warning", 
              "Cannot perform this action. There is a pending report on this order. Please wait until the report is resolved.");
          } else {
            this.alertService.showAlert("warning", 
              "لا يمكن تنفيذ هذا الإجراء. يوجد تقرير معلق على هذا الطلب. يرجى الانتظار حتى يتم حل التقرير.");
          }
        } else {
          this.alertService.showAlert("warning", errorMessage);
        }
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error in sending message. Please try again"
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء إرسال الرسالة، يرجى المحاولة مرة أخرى"
          );
        }
      }
      throw err;
    }
    
    this.newMessage = "";
    this.buyNowStatus = false;
    this.selectedImages = [];
  }
  @ViewChild("fileInput") fileInput!: ElementRef;

  selectedImages: File[] = [];

  uploadImages() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: any): Promise<void> {
    const files = event.target.files;
    console.log("files", files)
    if (files && files.length > 0) {
      this.selectedImages = Array.from(files);
      console.log("selectedImages", this.selectedImages)
      await this.sendMessage();
    }
  }

  viewAdd() {
    this.router.navigate(["/buy-product"], {
      state: { data: this.getProductDetails },
    });
  }

  shouldHideDiv(): boolean {
    if (!this.chats || this.chats.length === 0) {
      return false;
    }
    return this.chats.some(
      (chat) => chat?.product_id === this.productDeatils?.id
    );
  }

  isBuyNow: any = false;
  buyNowStatus: any = false;
  buyNow() {
    this.isBuyNow = true;
  }

  async buyNowProduct() {
    this.buyNowStatus = true;
    await this.sendMessage();
  }

  customOffer() {
    const datawithChat_ID = {
      reciever_ID: this.reciever_ID,
      chat_ID: this.chat_id,
      product_ID: this.messages[0].product_id,
    };

    const dialogRef = this.dialog.open(CustomOfferComponent, {
      width: "600px",
      data: {
        datawithChat_ID: datawithChat_ID,
        param: "chatComp",
        productDetailsfromChat: this.getProductDetails,
      },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      await this.getChatDetails();
      await this.getLatestMessage();
    });
  }

  cancelOfferStatus() {
    const formData = {
      offer_id: this.customOfferDetails?.id,
      offers_status: "canceled",
      sender_id: localStorage.getItem("userID"),
      receiver_id: this.reciever_ID,
      chat_id: this.chat_id,
    };
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "700px",
      data: { message: "Are you sure you want to cancel offer" },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result == true) {
        this.http.editOfferStatus(formData).subscribe(
          async (res) => {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "success",
                "Offer Canceled Successfully"
              );
            } else {
              this.alertService.showAlert("success", "تم إلغاء العرض بنجاح");
            }

            await this.getChatDetails();
            await this.getLatestMessage();
          },
          (err) => {
            if (err && err.error) {
              this.alertService.showAlert("warning", `${err.error.message}`);
            } else {
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in Offer Canceling"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إلغاء العرض"
                );
              }
            }
          }
        );
      }
    });
  }

  acceptOffer() {
    const formData = {
      offer_id: this.customOfferDetails?.id,
      offers_status: "accepted",
      sender_id: localStorage.getItem("userID"),
      receiver_id: this.reciever_ID,
      chat_id: this.chat_id,
    };

    this.http.editOfferStatus(formData).subscribe(
      async (res) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Product Sold Successfully");
        } else {
          this.alertService.showAlert("success", "تم بيع المنتج بنجاح");
        }

        this.isOfferStatusAccepted = true;
        await this.getChatDetails();
        await this.getLatestMessage();
      },
      (err) => {
        if (err && err.error) {
          this.alertService.showAlert("warning", `${err.error.message}`);
        } else {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("warning", "Error in Product Sold");
          } else {
            this.alertService.showAlert("warning", "حدث خطأ في بيع المنتج");
          }
        }
      }
    );
  }

  // assign this object true when click buyer 'Buy Now' and dealer get option 'Add Shipping' when this object is true also update this when buyer buy product
  isBuyNowFromChatCheck: boolean = false;

  hasBuyNowMessage(): boolean {
    return this.reversedMessages?.some((message: any) => message.action_type === 'buy_now') || false;
  }

  async buyNowFromChat() {
    const formData = {
      product_id: this.messages[0].product_id,
      chat_id: this.chat_id,
      receiver_id: this.reciever_ID,
      action_type: "buy_now",
    };
    try {
      const res: any = await this.http.sendMessage(formData).toPromise();
      this.chat_id = res.data.chat_id;
      if (res.data.action_type === "buy_now") {
        this.isBuyNowFromChatCheck = true;
      }
      await this.getChatDetails();
      await this.getLatestMessage();
    } catch (err: any) {
      console.error("Error in buyNowFromChat:", err);
      // Handle pending report blocking
      if (err && err.error) {
        const errorMessage = err.error.message || err.error.error || '';
        if (errorMessage.toLowerCase().includes('pending report') || 
            errorMessage.toLowerCase().includes('action blocked') ||
            err.error.error === 'Action blocked') {
          if (this.translateService.currentLang == "en") {
            this.alertService.showAlert("warning", 
              "Cannot perform this action. There is a pending report on this order. Please wait until the report is resolved.");
          } else {
            this.alertService.showAlert("warning", 
              "لا يمكن تنفيذ هذا الإجراء. يوجد تقرير معلق على هذا الطلب. يرجى الانتظار حتى يتم حل التقرير.");
          }
        } else {
          this.alertService.showAlert("warning", errorMessage);
        }
      }
    }
  }

  createOfferFromChat() {
    this.customOffer();
  }

  async MarkAsSoldfromChat() {
    const formData = {
      product_id: this.messages[0].product_id,
      chat_id: this.chat_id,
      receiver_id: this.reciever_ID,
      action_type: "mark_sold",
    };
    try {
      const res: any = await this.http.sendMessage(formData).toPromise();
      this.chat_id = res?.data?.chat_id;
      if (this.chat_id) {
        await this.getChatDetails();
        await this.getLatestMessage();
      }
    } catch (err) {
      console.error("Error in MarkAsSoldfromChat:", err);
    }
  }

  isCancelOfferBuyer: boolean = false;

  addShippingFromChat() {
    const dialogRef = this.dialog.open(AddShippingComponent, {
      width: "900px",
      data: { isShowMarkAsSold: this.isShowMarkAsSold },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const formData = {
          chat_id: this.chat_id,
          ship_price: result.formData.ship_price,
          product_id: this.messages[0].product_id,
          sender_id: localStorage.getItem("userID"),
          receiver_id: this.reciever_ID,
          validity_days: result.formData.validity_days,
        };
        this.http.sendShipmenttoBuyer(formData).subscribe(
          async (res) => {
            this.isCancelOfferBuyer = true;
            await this.getChatDetails();
            await this.getLatestMessage();
          },
          (err) => {
            if (err && err.error) {
              this.alertService.showAlert("warning", `${err.error.message}`);
            } else {
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in adding shipment. Please try again with correct form data"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إضافة الشحنة. يرجى المحاولة مرة أخرى مع بيانات النموذج الصحيحة"
                );
              }
            }
          }
        );
        if (result?.soldMark == true) {
          const formData = {
            product_id: this.messages[0].product_id,
            chat_id: this.chat_id,
            receiver_id: this.reciever_ID,
            action_type: "mark_sold",
          };
          this.http.sendMessage(formData).subscribe(async (res) => {
            this.chat_id = res?.data?.chat_id;
            await this.getChatDetails();
            await this.getLatestMessage();
          });
        } else {
          await this.getChatDetails();
          await this.getLatestMessage();
        }
      }
    });
  }

  cancelOffer() {
    const formData = {
      product_id: this.messages[0].product_id,
      chat_id: this.chat_id,
      receiver_id: this.reciever_ID,
      action_type: "cancel_order",
    };
    const dialogRef = this.dialog.open(ConfirmationModelComponent, {
      width: "700px",
      data: { message: "Are you sure you want to cancel offer" },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == true) {
        this.http.sendMessage(formData).subscribe(
          async (res) => {
            this.chat_id = res?.data?.chat_id;
            if (this.chat_id) {
              await this.getChatDetails();
              await this.getLatestMessage();
            }
          },
          (err) => {
            if (err && err.error) {
              this.alertService.showAlert("warning", `${err.error.message}`);
            } else {
              if (this.translateService.currentLang == "en") {
                this.alertService.showAlert(
                  "warning",
                  "Error in Cancel Order. Please try again"
                );
              } else {
                this.alertService.showAlert(
                  "warning",
                  "حدث خطأ أثناء إلغاء الطلب. يرجى المحاولة مرة أخرى"
                );
              }
            }
          }
        );
      }
    });
  }

  async makePayment() {
    const formData = {
      product_id: this.messages[0].product_id,
      chat_id: this.chat_id,
      receiver_id: this.reciever_ID,
      action_type: "make_payment",
    };
    try {
      const res: any = await this.http.sendMessage(formData).toPromise();
      this.chat_id = res?.data?.chat_id;
      await this.getChatDetails();
      await this.getLatestMessage();
    } catch (err: any) {
      if (err && err.error) {
        this.alertService.showAlert("warning", `${err.error.message}`);
      } else {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert(
            "warning",
            "Error in Making payment. Please try again"
          );
        } else {
          this.alertService.showAlert(
            "warning",
            "حدث خطأ أثناء إجراء الدفع. يرجى المحاولة مرة أخرى"
          );
        }
      }
    }
  }
}
