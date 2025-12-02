import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { notsame1 } from "../../validator/string.validator";
import { StringValidator } from "../../validator/string.validator";
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { UserService } from "src/services/users/user.service";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.css"],
})
export class ChangePasswordComponent implements OnInit{
  changePassForm: FormGroup;
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  hidepass: boolean = true;
  resetEmail: string | null = null;
  resetToken: string | null = null;
  togglePasswordVisibilityofFirstLogin() {
    this.hidepass = !this.hidepass;
  }
  hideconfirmpass: boolean = true;
  toggleConfirmPassword() {
    this.hideconfirmpass = !this.hideconfirmpass;
  }
   hidenewpass: boolean = true;
  toggleNewPassword() {
    this.hidenewpass = !this.hidenewpass;
  }
  old_password = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30),
  ]);
   new_password = new FormControl("", [
    Validators.required,
    Validators.minLength(10),
    Validators.maxLength(30),
    StringValidator.hasUpperCase,
    StringValidator.hasDigit,
    StringValidator.hasSpecialChar,
  ]);
  new_password_confirmation = new FormControl("", {
    validators: [Validators.required, notsame1()],
  });

  constructor(
    public translateService: TranslateService,
    private router: Router,
    private fb: FormBuilder,
    private alertService: AlertsServicesService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private http: HttpService,
    private route: ActivatedRoute
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");
    const browserlang = this.translateService.getBrowserLang();
    this.currentLanguage = browserlang;
 
    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.resetEmail = params['email'] || null;
      this.resetToken = params['token'] || null;

      // Optional: log or store to localStorage if you want persistence
      if (this.resetEmail && this.resetToken) {
        localStorage.setItem('reset_email', this.resetEmail);
        localStorage.setItem('reset_token', this.resetToken);
      }
    });

    if (this.resetEmail && this.resetToken) {
      this.changePassForm = this.formBuilder.group(
        {
          new_password: this.new_password,
          new_password_confirmation: this.new_password_confirmation
        },
        {
          validators: this._passwordMatchValidator()
        }
      );
    }else{
      this.changePassForm = this.formBuilder.group(
        {
          old_password: this.old_password,
          new_password: this.new_password,
          new_password_confirmation: this.new_password_confirmation
        },
        {
          validators: this._passwordMatchValidator()
        }
      );
    }
  }

   private _passwordMatchValidator() {
      return (control: AbstractControl) => {
        const password = control.get('new_password');
        const confirmPassword = control.get('new_password_confirmation');
        if (!password || !confirmPassword) {
          return null;
        }
        if (confirmPassword.errors && !confirmPassword.errors['mismatch']) {
          // If there's another error, skip overwriting it.
          return null;
        }
        if (password.value !== confirmPassword.value) {
          confirmPassword.setErrors({ mismatch: true });
        } else {
          confirmPassword.setErrors(null);
        }

        return null;
      };
    }

    changePassword(){
      if(this.changePassForm.valid){
          //  this.http.changePassword(this.changePassForm.value).subscribe(
          //   (res)=>{
          //     if(this.translateService.currentLang == 'en'){
          //       this.alertService.showAlert('success','Password change successfully')
          //     }else{
          //       this.alertService.showAlert('success', 'تم تغيير كلمة المرور بنجاح');
          //     }
          //     this.router.navigate(['/myListing'])
          //   }
          //  )

          if (this.resetEmail && this.resetToken) {
            const payload = {
              email: this.resetEmail,
              token: this.resetToken,
              password: this.changePassForm.get('new_password')?.value,
              password_confirmation: this.changePassForm.get('new_password_confirmation')?.value,
            };
      
            this.http.resetPassword(payload).subscribe({
              next: () => {
                if(this.translateService.currentLang == 'en'){
                  this.alertService.showAlert('success','Password change successfully')
                }else{
                  this.alertService.showAlert('success', 'تم تغيير كلمة المرور بنجاح');
                }
                this.router.navigate(['/login']);
              },
              error: (err) => {
                console.error('Reset password error', err);
              },
            });
          } else {
            // 🧩 Case 2: Normal change password (your existing API)
            this.http.changePassword(this.changePassForm.value).subscribe({
              next: () => {
                if(this.translateService.currentLang == 'en'){
                  this.alertService.showAlert('success','Password change successfully')
                }else{
                  this.alertService.showAlert('success', 'تم تغيير كلمة المرور بنجاح');
                }
                this.router.navigate(['/myprofile/shipping']);
              },
              error: (err) => {
                console.error('Change password error', err);
              },
            });
          }
      }else{
        if(this.translateService.currentLang == 'en'){
          this.alertService.showAlert('warning','Please Enter Valid form Fields')
        }else{
          this.alertService.showAlert('warning', 'يرجى إدخال حقول نموذج صالحة');
        }
      }
    }
}
