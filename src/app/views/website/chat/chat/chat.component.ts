import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/services/http/http.service";
// import { TimeAgoPipe } from 'time-ago-pipe';
import * as timeago from "timeago.js";
import { AfterViewChecked } from "@angular/core";

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

  constructor(private http: HttpService, private router: Router) {}

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

  getLatestMessage() {
    this.http.getChatsWithLatestMessage().subscribe((res) => {
      this.chats = res.chats.map(chat => {
        chat.product.main_image = chat.product.main_image.replace(/\\/g, '/');
        return chat;
      });
    });
  }
  

  reciever_ID: any;

  getMesageDetails(param: any) {
    console.log("param",param)
    this.chat_id = param.chat_id;
    this.getProductDetails=param.product;
    this.http.getChatsDetails(param.chat_id).subscribe(
      (res) => {
      this.messages = res.messages;
      this.reciever_ID = res.messages[0].sender_id;
      this.addRecID();
    }
    );
  }

  addRecID(){
    this.reciever_ID=this.messages[0].sender_id;
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
  }

  formatTime(date: string): string {
    return timeago.format(new Date(date));
  }
  get reversedMessages() {
    return this.messages ? [...this.messages].reverse() : [];
  }

  sendMessage(): void {
    console.log("calling form buyNowProduct");
      const formData = new FormData();
      if (this.newMessage.trim()) {
        formData.append("message", this.newMessage);
      }

      if (this.selectedImages.length > 0) {
        this.selectedImages.forEach((file) => {
          formData.append('attachments', file, file.name);
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
        formData.append("receiver_id",this.productDeatils.created_by.id.toString());
      }

      if (this.buyNowStatus) {
        formData.append("action_type", "buy_now");
      }

      this.http.sendMessage(formData).subscribe((res) => {
        this.chat_id = res.data.chat_id;

        if (this.chat_id) {
          this.http.getChatsDetails(this.chat_id).subscribe((res) => {
            this.messages = res.messages;
            this.getLatestMessage();
          });
        }
      });
      // this.reciever_ID=null;
      this.newMessage = "";
      this.buyNowStatus = false;
      this.selectedImages = [];
    
  }
  @ViewChild('fileInput') fileInput!: ElementRef;

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
}
