import { Component } from "@angular/core";

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"],
})
export class ChatComponent {
  isActive: any = "All";

  newMessage: string = "";
  messages = [
    { text: "Hello!", timestamp: new Date(), sent: false },
    { text: "Hi there!", timestamp: new Date(), sent: true },
    { text: "How are you?", timestamp: new Date(), sent: false },
  ];

  activeOption(option) {
    this.isActive = option;
  }

  chats = [
    {
      name: "Muhamad Kamran",
      modelName:"Rolex Speedmaster in a Good Condition...",
      message: "Hello, is this watch available? If it is available, I’ve...",
      time: "Just now",
      image: "assets/images/interested-watches-2.png",
      unread: 1,
    },
    {
      name: "Ali Imran",
      modelName:"Rolex Speedmaster in a Good Condition...",
      message: "Hello, is this watch available? If it is available, I’ve...",
      time: "3d ago",
      image: "assets/images/interested-watches-2.png",
      unread: 0,
    },
    {
      name: "Asgar Ali",
      modelName:"Rolex Speedmaster in a Good Condition...",
      message: "Please share payment receipt...",
      time: "12h ago",
      image: "assets/images/interested-watches-2.png",
      unread: 0,
    },
  ];

  sendMessage(): void {
    if (this.newMessage.trim()) {
      this.messages.push({
        text: this.newMessage,
        timestamp: new Date(),
        sent: true,
      });
      this.newMessage = "";
    }
  }
}
