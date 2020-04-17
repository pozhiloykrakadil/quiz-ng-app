import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user";
import {ProfileService} from "../../service/profileService/profile.service";
import {Gender} from "../../models/gender.enum";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})

export class UserInformationComponent implements OnInit {
  public changePasswordForm: FormGroup;
  public profile: User;
  public genders = Gender;
  public static isShowComponent: boolean = false;
  public isEditForm = false;
  submitted = false;
  newPassword: string;

  constructor(private profileService: ProfileService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.getProfile();

    this.changePasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() { return this.changePasswordForm.controls; }

  public isVisableComponent(){
    return UserInformationComponent.isShowComponent;
  }

  closeEditForm() {
    this.isEditForm = false;
  }

  ngSubmit(){
    this.closeEditForm();
    this.saveProfile();
  }

  public getProfile(){
    this.profileService.getProfile(JSON.parse(localStorage.getItem('currentUser')).id).subscribe(
      (resp:any) => {
        this.profile = resp;
      },
      error => {
        console.log(error);
        alert("Something wrong with downloading profile");
      }
    );
  }

  saveProfile() {
    this.profileService.updateProfile(this.profile).subscribe(
      (resp:any) => {
        this.profile = resp;
      },
      error =>{
        alert("Something wrong while updating profile");
      }
    );
  }

  changePassword() {
    this.profileService.updatePassword(this.newPassword).subscribe(
      (resp: any) => {
        alert("Password was changed")
      },
      error => {
        alert("Something wrong while save password")
      }
    );
  }
}

export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors.mustMatch) {
      return;
    }

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  }
}
