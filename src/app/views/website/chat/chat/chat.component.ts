import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/services/http/http.service";
import * as timeago from "timeago.js";
import { AfterViewChecked } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CustomOfferComponent } from "src/app/views/modal/custom-offer/custom-offer.component";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { AddShippingComponent } from "src/app/views/modal/add-shipping/add-shipping.component";

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
  isActive: any = "All";
  newMessage: string = "";
  productDeatils: any;
  detailsWithLatestMessages: any;
  messages: any;
  chats: any;
  getProductDetails: any;
  chat_id: any;
  noImageName: any = "Kamran Ghulam";
  noMessageDetails: any;
  constructor(
    private http: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private alertService:AlertsServicesService
  ) {}

  ngOnInit(): void {
    if (history.state.data) {
      this.productDeatils = history.state.data;
      this.noMessageDetails = this.productDeatils.created_by;
    }
    if (this.productDeatils) {
      this.getLatestMessage();
      this.getDetailsofProduct(this.productDeatils.id);
    } else {
      this.getLatestMessage();
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

  unreadFilter(){
    this.chats=this.chats.filter((item:any)=>item.unread_count>0)
    console.log("Chats List",this.chats)
  }

  getLatestMessage() {
    this.http.getChatsWithLatestMessage().subscribe((res) => {
      this.chats = res.chats.map((chat) => {
        chat.product.main_image = chat.product.main_image.replace(/\\/g, "/");
        return chat;
      });
    });
  }

  reciever_ID: any;
  isShowBuyNowOffer:boolean=false;
  isBuyerUser:boolean=false;

  getMesageDetails(param: any) {
    this.chat_id = param.chat_id;
    this.getProductDetails = param.product;
    this.getChatDetails() 
  }

  isOfferShowToUserandDealer:boolean=false;
  isShowPaymentMethod:boolean=false;
  isShowMarkAsSold:boolean=false;
  isShowCancelOffertoBuyer:boolean=false;
  offerTypeStatus:boolean=false;
  isExistMakePayment:boolean=true;
  isActionTypeMakePaymentToHideCustomOffer:boolean=false;

  getChatDetails(){
    let S_T_B='';
    let B_T_S='';
    this.http.getChatsDetails(this.chat_id).subscribe((res) => {
      this.messages = res.messages;
      if(res.messages.length > 0 && !this.reciever_ID){
        let useridd=localStorage.getItem('userID')
        console.log("let useridd",useridd)
        // this.reciever_ID = res.messages[1]?.receiver_id;
          if(useridd == res.messages[0]?.sender_id){
            console.log("hellollllllllll")
            this.reciever_ID = res.messages[0]?.receiver_id;
          }else if (res.messages[0]?.receiver_id === null){
            this.reciever_ID = res.messages[1]?.receiver_id;
          }
          else{
            this.reciever_ID = res.messages[0]?.sender_id;
          }
          console.log("reciever ID",this.reciever_ID)
      }
      this.messages.forEach((message) => {
        if (message.attachments) {
          try {
            message.attachments = JSON.parse(message.attachments);
          } catch (error) {
            console.error("Error parsing attachments:", error);
          }
        }

        if(message.action_type === 'make_payment'){
          this.isExistMakePayment=false
        }
        
        if(message.valid_until){
          this.isCancelOfferBuyer=true
        }

        if(message.direction === 'STB'){
          S_T_B='yes'
        }
        if(message.direction === 'BTS'){
          B_T_S='yes'
        }
        if(message.offer_price >= 1){
          this.isOfferShowToUserandDealer=true;
        }
         let useridd=localStorage.getItem('userID')

        if(useridd == message.receiver_id){
          if( message.direction == 'STB'){
            this.isBuyerUser=true
          }else{
            this.isBuyerUser=false
          }
        }
        
        if(!this.isBuyerUser){
          if(message.direction === 'BTB' && useridd === message.sender_id){
              this.isBuyerUser=true
          }else{
            this.isBuyerUser=false
          }
        }
        if(message.action_type === 'buy_now'){
          this.isBuyNowFromChatCheck=true;
        }

        if(message.action_type === 'add_shipping'){
          this.isShowPaymentMethod=true;
        }

        if(message.action_type === 'mark_sold'){
          this.isShowMarkAsSold=true;
        }

        if(message.action_type === 'update_offer'){
          this.isShowCancelOffertoBuyer=true;
        }

        if(message.action_type === 'offer'){
          this.isCustomOffer=true;
        }

        if(message.action_type === 'make_payment'){
          this.isActionTypeMakePaymentToHideCustomOffer=true;
        }

      });
      if(S_T_B === 'yes' && B_T_S === 'yes'){
        this.isShowBuyNowOffer=true
      }
      this.getCustomOffer();
    });
  }

  editOffer(customOfferDetails:any){
    console.log("customOfferDetails",customOfferDetails)
    const dialogRef = this.dialog.open(CustomOfferComponent, {
      width: "600px",
      data: { customOfferDetails: customOfferDetails, param: "editComp" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result){
        const formData ={
          chat_id:customOfferDetails.chat_id,
          product_id :this.messages[0].product_id,
          action_type:'update_offer',
          receiver_id :this.reciever_ID.toString()
        }
        this.http.sendMessage(formData).subscribe(
          (res)=>{
            this.getChatDetails()
            this.getLatestMessage();
          },(err)=>{
          }
        )   
      }
    });
  }

  isCustomOffer:boolean=false;
  customOfferDetails:any;
  isOfferStatusAccepted:boolean=false;
  isProductReserved:boolean=false;
  getCustomOffer(){
  
    this.http.offerByFilter(this.getProductDetails.id,this.chat_id).subscribe(
      (res)=>{
       
        this.isCustomOffer=true;
        this.customOfferDetails=res.offer;
        if(res.offer.offers_status === 'accepted'){
          this.isOfferStatusAccepted=true
        }
        if(res.offer.offers_status !== 'accepted' && !this.isBuyNowFromChatCheck || !this.isActionTypeMakePaymentToHideCustomOffer && res.offer.product.sale_status === 'reserved'){
          this.isProductReserved=true
        }
        else{
          this.isProductReserved=false
        }
      }
    )
  }

  isArray(attachments: any): boolean {
    return Array.isArray(attachments);
  }

  getDetailsofProduct(ID: any) {
    this.http.getProductsByID(ID).subscribe((res) => {
      if (res.data.main_image) {
        res.data.main_image = res.data.main_image.replace(/\\/g, "");
      }
      this.getProductDetails = res.data;
    });
  }

  activeOption(option: any) {
    this.isActive = option;
    if(option === 'All'){
      this.getLatestMessage()
    }
  }
  

  formatTime(date: string): string {
    return timeago.format(new Date(date));
  }
  get reversedMessages() {
    return this.messages ? [...this.messages].reverse() : [];
  }

  sendMessage(): void {
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
      formData.append("product_id", this.productDeatils.id);
    }

    if (this.chat_id) {
      formData.append("chat_id", this.chat_id.toString());
    }

    if (this.reciever_ID) {

      formData.append("receiver_id", this.reciever_ID.toString());
    } 
    else if (!this.reciever_ID && this.productDeatils) {
      this.reciever_ID=this.productDeatils.created_by.id
      console.log("this.reciever_ID=this.productDeatils.created_by.id",this.reciever_ID=this.productDeatils.created_by.id)
      formData.append(
        "receiver_id",
        this.productDeatils.created_by.id.toString()
      );
    }

    if (this.buyNowStatus) {
      formData.append("action_type", "buy_now");
    }

    this.http.sendMessage(formData).subscribe((res) => {
      this.chat_id = res.data.chat_id;
        this.getChatDetails();
        this.getLatestMessage();
    });
    this.newMessage = "";
    this.buyNowStatus = false;
    this.selectedImages = [];
  }
  @ViewChild("fileInput") fileInput!: ElementRef;

  selectedImages: File[] = [];

  uploadImages() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.selectedImages = Array.from(files);
      this.sendMessage();
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
      (chat) => chat.product_id === this.productDeatils.id
    );
  }

  isBuyNow: any = false;
  buyNowStatus: any = false;
  buyNow() {
    this.isBuyNow = true;
  }

  buyNowProduct() {
    this.buyNowStatus = true;
    this.sendMessage();
  }

  customOffer() {
    const datawithChat_ID = {
      reciever_ID: this.reciever_ID,
      chat_ID: this.chat_id,
      product_ID: this.messages[0].product_id,
    };
    const dialogRef = this.dialog.open(CustomOfferComponent, {
      width: "600px",
      data: { datawithChat_ID: datawithChat_ID, param: "chatComp" },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getChatDetails()
      this.getLatestMessage();
    });
  }


  cancelOfferStatus(){
    const formData={
      offer_id:this.customOfferDetails.id,
      offers_status:'canceled',
      sender_id:localStorage.getItem('userID'),
      receiver_id:this.reciever_ID,
      chat_id:this.chat_id
    }

    this.http.editOfferStatus(formData).subscribe(
      (res)=>{
        this.alertService.showAlert('success','Offer Canceled Succesfully')
        this.getChatDetails()
        this.getLatestMessage()
      },(err)=>{
        this.alertService.showAlert('danger','Error in Offer Canceling')
      }
    );
  }


  acceptOffer(){
    const formData={
      offer_id:this.customOfferDetails.id,
      offers_status:'accepted',
      sender_id:localStorage.getItem('userID'),
      receiver_id:this.reciever_ID,
      chat_id:this.chat_id
    }

    this.http.editOfferStatus(formData).subscribe(
      (res)=>{
        this.alertService.showAlert('success','Product Sold Succesfully')
        this.getChatDetails()
        this.getLatestMessage()
      },(err)=>{
        this.alertService.showAlert('danger','Error in Product Sold')
      }
    );
  }

// assign this object true when click buyer 'Buy Now' and dealer get option 'Add Shipping' when this object is true also update this when buyer buy product
  isBuyNowFromChatCheck:boolean=false;

  buyNowFromChat(){
      const formData ={
        product_id:this.messages[0].product_id,
        chat_id:this.chat_id,
        receiver_id:this.reciever_ID,
        action_type:'buy_now'

      }
    this.http.sendMessage(formData).subscribe(
      (res)=>{
        this.chat_id = res.messages.chat_id;
        if(res.messages.action_type === 'buy_now'){
          this.isBuyNowFromChatCheck=true;
          this.getChatDetails();
          this.getLatestMessage();
        }else{
          this.getChatDetails();
          this.getLatestMessage();
        }
      }
    )
  }


  createOfferFromChat(){
     this.customOffer()
  }


  MarkAsSoldfromChat(){
    const formData ={
      product_id:this.messages[0].product_id,
      chat_id:this.chat_id,
      receiver_id:this.reciever_ID,
      action_type:'mark_sold'

    }
    this.http.sendMessage(formData).subscribe(
      (res)=>{
        this.chat_id = res.messages.chat_id;
        // if(res.messages.action_type === 'buy_now'){
        //   this.isBuyNowFromChatCheck=true;
        // }
        if(this.chat_id){
          this.getChatDetails();
          this.getLatestMessage();
        }
      }
    )
  }

  isCancelOfferBuyer:boolean=false;

  addShippingFromChat(){
    const dialogRef = this.dialog.open(AddShippingComponent, {
      width: "600px",
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if(result){
        const formData = {
          chat_id: this.chat_id,
          ship_price: result.formData.ship_price,
          product_id: this.messages[0].product_id,
          sender_id: localStorage.getItem('userID'),
          receiver_id: this.reciever_ID,
          validity_days: result.formData.validity_days
        }
        this.http.sendShipmenttoBuyer(formData).subscribe(
          (res)=>{
            this.isCancelOfferBuyer=true
            this.getChatDetails();
            this.getLatestMessage();
          }
        )
      }
    });
  }
  cancelOffer(){
    const formData ={
      product_id:this.messages[0].product_id,
      chat_id:this.chat_id,
      receiver_id:this.reciever_ID,
      action_type:'cancel_order'

    }
    this.http.sendMessage(formData).subscribe(
      (res)=>{
        this.chat_id = res.messages.chat_id;
        if(this.chat_id){
          this.getChatDetails();
          this.getLatestMessage();
        }
      }
    )
  }


  makePayment(){
    const formData ={
      product_id:this.messages[0].product_id,
      chat_id:this.chat_id,
      receiver_id:this.reciever_ID,
      action_type:'make_payment'
    }
    this.http.sendMessage(formData).subscribe(
      (res)=>{
        this.chat_id = res.messages.chat_id;
          this.getChatDetails();
          this.getLatestMessage();
      }
    )
  }
}
