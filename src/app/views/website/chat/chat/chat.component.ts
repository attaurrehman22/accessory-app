import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { HttpService } from "src/services/http/http.service";
// import { TimeAgoPipe } from 'time-ago-pipe';
import * as timeago from 'timeago.js';
import { AfterViewChecked } from '@angular/core';

interface FormData {
  product_id?: any;
  message: string;
  attachments: any[];
  receiver_id: any;
  chat_id?: string; // chat_id is optional
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
  noImageName: any = 'Kamran Ghulam';
  noMessageDetails:any;

  constructor(private http: HttpService, private router: Router) {}

  ngOnInit(): void {
    this.productDeatils = history.state.data;
    this.noMessageDetails=this.productDeatils.created_by
    console.log("this.productDeatils ------ in chat ", this.productDeatils);
    if (this.productDeatils) {
      this.getLatestMessage();
      this.getDetailsofProduct(this.productDeatils.id);
    }
  }

  @ViewChild('messagesContainer') messagesContainer: ElementRef;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom() {
    const container = this.messagesContainer.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  getLatestMessage() {
    this.http.getChatsWithLatestMessage().subscribe((res) => {
      this.chats = res.chats;
    });
  }

  getMesageDetails(param: any) {
    this.chat_id = param.chat_id;
    this.http.getChatsDetails(param.chat_id).subscribe((res) => {
      this.messages = res.messages;
      if (this.messages) {
        this.getDetailsofProduct(this.messages[0].product_id);
      }
    });
  }

  getDetailsofProduct(ID: any) {
    this.http.getProductsByID(ID).subscribe((res) => {
      if (res.data.main_image) {
        res.data.main_image = res.data.main_image.replace(/\\/g, '');
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

  // Getter for reversed messages
  get reversedMessages() {
    return this.messages ? [...this.messages].reverse() : [];
  }

  sendMessage(): void {
    if (this.newMessage.trim()) {
      const formData: FormData = {
        message: this.newMessage,
        attachments: [],
        receiver_id: this.productDeatils.created_by.id,
      };

      if(this.messages){
        formData.product_id=this.messages[0].product_id
      }else{
        formData.product_id=this.productDeatils.id
      }

      if (this.chat_id) {
        formData.chat_id = this.chat_id;
      }

      this.http.sendMessage(formData).subscribe((res) => {
        this.chat_id = res.data.chat_id;
        if(this.chat_id){
          this.http.getChatsDetails(this.chat_id).subscribe(
            (res)=>{
              this.messages = res.messages;
              this.getLatestMessage();
          })
        }
      });
      this.newMessage = "";
    }
  }

  viewAdd() {
    this.router.navigate(['/buy-product'], {
      state: { data: this.getProductDetails },
    });
  }

  shouldHideDiv(): boolean {
    if (!this.chats || this.chats.length === 0) {
      return false;
    }
    return this.chats.some(chat => chat.product_id === this.productDeatils.id); // Hide div if product_id is 391
  }
}

