import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatRadioModule} from '@angular/material/radio';
import {FormBuilder, FormGroup, FormsModule, Validators} from '@angular/forms';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm:FormGroup;

  constructor(
    public router: Router,
    private fb:FormBuilder
  ){
    this.registerForm=this.fb.group({
      email:['',[Validators.email,Validators.required]],
      password:['',Validators.required],
      conirmPassword:['',Validators.required]
    })
  }
  gotologin(){
    this.router.navigateByUrl('login')
  }

  login(){
    this.registerForm.markAllAsTouched();
    if(this.registerForm.valid){
      this.router.navigateByUrl('login')
    }
  }
}
