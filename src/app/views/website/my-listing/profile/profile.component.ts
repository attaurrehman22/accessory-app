import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModelLoginComponent } from 'src/app/views/auth/model-login/model-login.component';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';
import { LanguageService } from 'src/services/lang-service/language.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  profileForm!: FormGroup;
  apiUrl = environment.apipath + "/";
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  profileImagePreview: string | null = null;
  selectedProfileImage: File | null = null;
  maxDate: string = new Date().toISOString().split('T')[0];
  constructor(private http: HttpService,
    private router: Router,
    private dialog: MatDialog,
    private alertService: AlertsServicesService,
    public translateService: TranslateService,
    private languageService: LanguageService,
    private fb: FormBuilder){
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

  getInitialsofUsername(name){
    if (!name) {
      return '';
    }

    const words = name.trim().split(' ');
    console.log("words", words);
    if (words?.length === 1 && words[0] !== "") {
      return words[0][0].toUpperCase();
    } else {
      const emailWord =this.profileForm.get('email').value;
      if(emailWord){
        return emailWord[0][0].toUpperCase();
      }
      // return (emailWord[0][0].toUpperCase());
      // return 'EM';
    }
  }

  getInitials(name: string | undefined | null): string {
    if (!name) {
      return "";
    }
    // Split name by space and get first letters
    const words = name.trim().split(" ");
    // words ['']0: ""length: 1[[Prototype]]: Array(0)

    if (words?.length === 1 && words[0] !== "" && words[0] !== undefined && words[0] !== null ) {
      return words[0][0].toUpperCase();
    } else {
      if(this.profileForm.get('email').value){
        const emailWord = this.profileForm.get('email').value
        if(emailWord[0][0]){
          return emailWord[0][0].toUpperCase();
        }else{
          return
        }
      }
      // return (emailWord[0][0].toUpperCase());
      // return 'EM';
    }
  }
  userID: any;
  
  ngOnInit(): void {
    this.userID = localStorage.getItem("userID");
    if (!this.userID) {
      this.loginFirst();
    }
    this.profileForm = this.fb.group({
      first_name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      last_name: [
        "",
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      gender: ["", Validators.required],
      date_of_birth: ["", Validators.required],
      countryCode: ["KSA"],
      phone_number: ["", [Validators.required, Validators.pattern(/^5\d{8}$/)]],
      language: ["english", Validators.required],
      occupation: ["", [Validators.required, Validators.minLength(2)]],
      about_me: ["", [Validators.maxLength(300)]],
      email: ["", [Validators.required, Validators.email]],
      password: [""],
      profile_image: [""]
    });
    this.fetchProfiling();
  }

  loginFirst() {
    const dialogRef = this.dialog.open(ModelLoginComponent, {
      width: "600px",
      data: { message: "dialog-box" },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      }
    });
  }

  onProfileImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedProfileImage = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  fetchProfiling() {
    this.http.getProfilingInformation().subscribe((res) => {
      this.profileForm.patchValue({
        first_name: res.first_name,
        last_name: res.last_name,
        gender: res.gender,
        city: res.city,
        country: 'Saudi Arabia',
        date_of_birth: res.date_of_birth,
        phone_number: res.phone_number,
        language: res?.language,
        occupation: res?.occupation,
        about_me: res?.about_me,
        email: res?.email,
        profile_image: res?.profile_image?.replace(/\\/g, ""),
        password: res?.password,
      });
    });
  }

  profileFormSubmit() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      const formData = new FormData();
      
      // Append all form fields to FormData
      Object.keys(this.profileForm.value).forEach(key => {
        if (key === 'profile_image' && this.selectedProfileImage) {
          formData.append('profile_image', this.selectedProfileImage);
        } else {
          formData.append(key, this.profileForm.get(key).value);
        }
      });

      this.http.saveProfilingInformation(formData).subscribe((res) => {
        if (this.translateService.currentLang == "en") {
          this.alertService.showAlert("success", "Profile Update Successfully");
        } else {
          this.alertService.showAlert("success", "تم تحديث الملف الشخصي بنجاح");
        }
        // Reset image selection after successful upload
        this.selectedProfileImage = null;
      });
    } else {
      if (this.translateService.currentLang == "en") {
        this.alertService.showAlert("warning", "Please add form values");
      } else {
        this.alertService.showAlert("warning", "يرجى إضافة قيم النموذج");
      }
    }
  }
}
