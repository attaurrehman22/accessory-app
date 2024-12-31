import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import {
  usernameExists,
  notsame1,
  userEmailExists,
} from "../../validator/string.validator";
import { UserService } from "src/services/users/user.service";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { TranslateService } from "@ngx-translate/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  supportLanguages = ["en", "ar", "fr", "ta", "hi"];
  currentLanguage: string;
  isDialog: any = "";
  registerForm: FormGroup;
  
  // Define form controls with conditional validators
  username = new FormControl("", {
    validators: [Validators.required],
    asyncValidators: [usernameExists(this.userService)],
    updateOn: "blur",
  });
  
  email = new FormControl("", {
    validators: [Validators.required, Validators.email],
    asyncValidators: [userEmailExists(this.userService)],
    updateOn: "blur",
  });

  password = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30),
  ]);

  confirmpassword = new FormControl("", {
    validators: [Validators.required, notsame1()],
  });

  country = new FormControl("", []);  
  city = new FormControl("", []); 

  constructor(
    private alertService: AlertsServicesService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    public router: Router,
    public translateService: TranslateService
  ) {
    this.translateService.addLangs(this.supportLanguages);
    this.translateService.setDefaultLang("ar");

    const browserlang = this.translateService.getBrowserLang();
    this.currentLanguage = browserlang;

    this.registerForm = this.formBuilder.group(
      {
        username: this.username,
        email: this.email,
        password: this.password,
        confirmpassword: this.confirmpassword,
        country: this.country,
        city: this.city,
      },
      {
        validators: notsame1(),
      }
    );

    if (this.supportLanguages.includes(browserlang)) {
      this.translateService.use(browserlang);
    }
  }

  ngOnInit(): void {}

  gotologin() {
    this.router.navigateByUrl("login");
  }

  register() {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.http
        .register(this.registerForm)
        .subscribe(
          (response) => {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("user_token", response.authorisation.token);
            localStorage.setItem('userType',response.user.type)
            localStorage.setItem("userID", response.user.id);
            // this.router.navigateByUrl("");
            this.router.navigateByUrl("").then(() => {
              window.location.reload();
            });
          },
          (error) => {
            console.error("Registration error", error);
          }
        );
    } else {
      this.alertService.showAlert("warning", "Enter Valid Form Values");
    }
  }
}

