import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit {
  apiUrl = environment.apipath + "/";
  filteredChats: any;
  chats: any;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  ngOnInit(): void {
    this.getLatestMessages();
  }
  
  constructor(
    private http: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService,
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

  getLatestMessages() {
    this.http.getChatsWithLatestMessage().subscribe((res) => {
      this.chats = res.chats.map(
        (chat) => {
          chat.product.main_image = chat?.product?.main_image.replace(/\\/g, "/");
          return chat;
        },
        (err) => {
          if (err && err.error) {
            this.alertService.showAlert("warning", `${err.error.message}`);
          } else {
            if (this.translateService.currentLang == "en") {
              this.alertService.showAlert(
                "warning",
                "Error in getting message Please try again"
              );
            } else {
              this.alertService.showAlert(
                "warning",
                "حدث خطأ أثناء جلب الرسالة، يرجى المحاولة مرة أخرى"
              );
            }
          }
        }
      );
      this.filteredChats = this.chats;
    });
  }

  getMesageDetails(chat) {
    const chatDetails = {
      id: chat.chat_id,
    };

    const productDetails = {
      id: chat.product_id,
    };

    this.router.navigate(["/chat"], {
      state: {
        fromRoute: "gotToChat",
        data: productDetails,
        chatDetails:chat,
        productID: chat.product_id,
        chatID: chat.chat_id,
      },
    });
  }
}
