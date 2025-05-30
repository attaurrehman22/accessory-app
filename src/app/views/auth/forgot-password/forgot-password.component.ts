import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/users/user.service';
import { notsame1, userEmailExists } from '../../validator/string.validator';
import { HttpClient } from '@angular/common/http';
import { HttpService } from 'src/services/http/http.service';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  emailForm: FormGroup;
  isSendEmail:boolean=false;

  hidepass: boolean = true;
  togglePasswordVisibilityofFirstLogin() {
    this.hidepass = !this.hidepass;
  }

  hideconfirmpass: boolean = true;
  toggleConfirmPassword(){
   this.hideconfirmpass = !this.hideconfirmpass;
  }

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  resetPasswordForm: FormGroup;
    
    email = new FormControl("", {
      validators: [Validators.required, Validators.email],
    });
  
    token = new FormControl("", [ Validators.required]);

    password = new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]);
  
    password_confirmation = new FormControl("", {
      validators: [Validators.required, notsame1()],
    });

  constructor(public translateService: TranslateService, private router:Router,
    private fb: FormBuilder,private alertService:AlertsServicesService,
    private formBuilder: FormBuilder,private userService: UserService,private http:HttpService){
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();
    this.currentLanguage = browserlang;

    this.resetPasswordForm = this.formBuilder.group(
      {
        email: this.email,
        token: this.token,
        password: this.password,
        password_confirmation: this.password_confirmation
      },
      {
        validators: this._passwordMatchValidator()
      }
    );


    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

   private _passwordMatchValidator() {
    return (control: AbstractControl) => {
      const password = control.get('password');
      const confirmPassword = control.get('password_confirmation');

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

  afterSendingEmailToken:any;
  resetURL:any;

  sendEmail(){
    
    if(this.emailForm.valid){
      this.http.sendEmail(this.emailForm.value).subscribe(
        (res)=>{
          this.alertService.showAlert('success',`${res.message}`)
          this.afterSendingEmailToken = res.token;
          this.resetURL= res.reset_url;
          this.resetPasswordForm.get('token').setValue(this.afterSendingEmailToken)
          this.resetPasswordForm.get('email').setValue(this.emailForm.get('email').value)
        }
      )
    }else{
       if(this.translateService.currentLang == 'en'){
         this.alertService.showAlert('warning','Please enter valid email')
       }else{
        this.alertService.showAlert('warning', 'يرجى إدخال بريد إلكتروني صحيح');
       }
    }
  }

  isOpenResetForm:boolean= false;

  openResetForm(){
    this.isSendEmail=true;
    this.isOpenResetForm =true;
  }

  resetPassword(){
    if(this.resetPasswordForm.valid){
      this.http.resetPassword(this.resetPasswordForm.value).subscribe(
        (res)=>{
          this.router.navigate(['/login'])
        }
      )
    }else{
       if(this.translateService.currentLang == 'en'){
        this.alertService.showAlert('warning','Please enter valid form values')
       }else{
        this.alertService.showAlert('warning', 'يرجى إدخال قيم صحيحة في النموذج');
       }
    }
  }

}
