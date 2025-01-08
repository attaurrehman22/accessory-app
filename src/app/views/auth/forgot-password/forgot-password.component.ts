import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/services/users/user.service';
import { notsame1, userEmailExists } from '../../validator/string.validator';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  userEmail:any;
  isSendEmail:boolean=false;

  resetPasswordForm: FormGroup;
    
    email = new FormControl("", {
      validators: [Validators.required, Validators.email],
    });
  
    currentPassword = new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]);

    password = new FormControl("", [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(30),
    ]);
  
    confirmpassword = new FormControl("", {
      validators: [Validators.required, notsame1()],
    });

  constructor(public translateService: TranslateService, private formBuilder: FormBuilder,private userService: UserService){
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();
    this.currentLanguage = browserlang;

    this.resetPasswordForm = this.formBuilder.group(
      {
        email: this.email,
        currentPassword: this.currentPassword,
        password: this.password,
        confirmpassword: this.confirmpassword
      },
      {
        validators: notsame1(),
      }
    );

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

  sendEmail(){
     this.isSendEmail=true
  }

}
