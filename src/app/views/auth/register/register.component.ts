import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { usernameExists, notsame ,userEmailExists} from "../../validator/string.validator";
import { UserService } from "src/services/users/user.service";
import { HttpService } from "src/services/http/http.service";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrl: "./register.component.css",
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  username = new FormControl("", 
    {validators: [Validators.required],
    asyncValidators: [usernameExists(this.userService)],updateOn: "blur",});
  // email: FormControl = new FormControl("", {validators: [Validators.required,Validators.email],asyncValidators: [userEmailExists(this.userService)],updateOn: "blur",});
  email = new FormControl("", {
    validators: [Validators.required, Validators.email],
    asyncValidators: [userEmailExists(this.userService)], // Async validator
    updateOn: "blur", // Validate on blur
  });
  
  // email: FormControl = new FormControl("", [Validators.required,Validators.email]);
  password: FormControl = new FormControl("", [
    Validators.required,
    Validators.minLength(6),
    Validators.maxLength(30)
  ]);  
  confirmpassword: FormControl = new FormControl("", [Validators.required, notsame(this.password),]);


  constructor(private alertService:AlertsServicesService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private http: HttpService,
    public router: Router
  ) {}
  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: this.username,
      email: this.email,
      password: this.password,
      confirmpasword: this.confirmpassword,
    });
  }

  gotologin() {
    this.router.navigateByUrl("login");
  }

  register() {
    this.registerForm.markAllAsTouched();
    console.log(this.registerForm.valid);
    if (this.registerForm.valid) {
      this.http.register(this.registerForm).subscribe(
        (response) => {
          console.log("Registration successful", response);
          this.router.navigateByUrl("login");
        },
        (error) => {
          console.error("Registration error", error);
        }
      );
    }else{
      this.alertService.showAlert('warning', 'Enter Form Values');
    }
  }
  
}
