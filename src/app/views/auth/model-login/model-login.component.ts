import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";
import { ModelRegisterComponent } from "../model-register/model-register.component";

@Component({
  selector: "app-model-login",
  templateUrl: "./model-login.component.html",
  styleUrls: ["./model-login.component.css"],
})
export class ModelLoginComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  isDialog: any = "";
  loginForm: FormGroup;
  email: FormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);
  password: FormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(30),
  ]);
  constructor(
    public alertService: AlertsServicesService,
    public router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private http: HttpService,
    public translateService: TranslateService,
    public dialogRef: MatDialogRef<ModelLoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();

    this.currentLanguage = browserlang;

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }

    if (data) {
      this.isDialog = data.message;
    }
  }

  hidepass: boolean = true;
  togglePasswordVisibilityofFirstLogin() {
    this.hidepass = !this.hidepass;
  }

  routeTo: any;
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: this.email,
      password: this.password,
    });
  }
  gotoHome() {
    console.log("LOG CALLING")
    this.loginForm.markAllAsTouched();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user_token");
    if (this.loginForm.valid) {
      this.http.login(this.loginForm.value).subscribe(
        (response) => {
          if (response.message === "" || response.status === "failure") {
            if(this.translateService.currentLang == 'en'){
              this.alertService.showAlert(
                "warning",
                "Please Enter your Email and Password"
              );
            }else{
               this.alertService.showAlert(
                "warning",
                "يرجى إدخال بريدك الإلكتروني وكلمة المرور"
              );
            }
          } else {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user_token", response.authorization.token);
            localStorage.setItem('userType',response.user.type)
            localStorage.setItem("userID", response.user.id);
            if (this.isDialog === "dialog-box") {
          
                window.location.reload();
          
              this.dialogRef.close(true);
            } else {
              // this.router.navigateByUrl("").then(() => {
              //   window.location.reload();
              // });
              window.location.reload();
              // this.router.navigateByUrl("");
            }
          }
        },
        (error) => {
          if (error.message === "Unauthorized") {
             if(this.translateService.currentLang == 'en'){
              this.alertService.showAlert(
                "warning",
                "You entered an incorrect email or password"
              );
            }else{
              this.alertService.showAlert(
                "warning",
                "لقد أدخلت بريدًا إلكترونيًا أو كلمة مرور غير صحيحة"
              );
            }
          }
          console.error("Login error", error);
        }
      );
    } else {
       if (this.translateService.currentLang == "en") {
        this.alertService.showAlert(
          "warning",
          "Please Enter your Email and Password"
        );
      } else {
        this.alertService.showAlert(
          "warning",
          "يرجى إدخال بريدك الإلكتروني وكلمة المرور"
        );
      }
    }
  }
  gotoRegister() {
    // this.dialogRef.close();
    // const dialogRef = this.dialog.open(ModelRegisterComponent, {
    //   width: "600px",
    //   data: { message: "dialog-box" },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.dialogRef.close();
    //   }
    // });
    // this.router.navigate(['register'])
    this.dialogRef.close('register');
  }

  closeAndMoveToLoginComp(){
    // this.router.navigate['/login']
    this.router.navigateByUrl("/login");
    this.dialogRef.close(false);
  }
}
