import { Component } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";

interface Active {
  value: boolean;
  viewValue: string;
}

@Component({
  selector: 'app-admin-brands-product',
  templateUrl: './admin-brands-product.component.html',
  styleUrls: ['./admin-brands-product.component.css']
})
export class AdminBrandsProductComponent {
  form: any;
  isDisplayed = true;
  submitted = false;
  paramval: any = "";
  userStatus: string = "";
  isBlockUserHide: boolean = false;
  name = new FormControl("", [
    Validators.required,
    Validators.pattern("^[^\\s]+(\\s+[^\\s]+)*$"),
  ]);
  userName = new FormControl("", [
    Validators.required,
    Validators.pattern("^[a-zA-Z0-9/s]+"),
  ]);
  email = new FormControl("", [Validators.required, Validators.email]);
  password = new FormControl("", [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern("^[^\\s]+(\\s+[^\\s]+)*$"),
  ]);
  createdBy = new FormControl("", [Validators.required]);
  activeController = new FormControl("");

  selectedValue: string;
  activeUser: any = [
    { value: true, viewValue: "Blocked" },
    { value: false, viewValue: "Unblocked" },
  ];

  data: any;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private toast: AlertsServicesService
  ) {}
  ngOnInit(): void {
    this.paramval = history.state.param;

    this.form = new FormGroup({
      name: this.name,
      userName: this.userName,
      email: this.email,
      password: this.password,
      active: this.activeController,
    });

    if (this.paramval === "Edit") {
      this.data = history.state.data;
      if (this.data) {
        this.userStatus = "Edit User";
        this.isDisplayed = true;
        this.form.controls["active"].setValue(
          this.data.isBlocked ? true : false
        );
        this.form.controls["name"].setValue(this.data.name);

        this.form.controls["userName"].setValue(this.data.userName);
        this.form.controls["email"].setValue(this.data.email);

        this.form.controls["password"].setValue(this.data.password);
        this.form.controls["createdBy"].disable();
        this.form.controls["createdBy"].setValue(this.data.password);
      }
    }
  }
  save() {}
  cancel() {}
}
