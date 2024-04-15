import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordReg } from 'src/app/common/passoerd-reg';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  currentSettings: boolean = false;
  settingForm:any = FormGroup;

  constructor(private data: DataService,
    private rest: RestApiService,
    private fb:FormBuilder
    ) {
    this.settingForm = this.fb.group({
         name: ['', [Validators.required]],
         isSeller: [false],
         email: ['', [Validators.required]],
         newPwd: ['', [Validators.required]],
         pwdConfirm: ['', [Validators.required]],
      },
      {
        validator: [PasswordReg.passwordMatchValidator],
      }
    );
  }

  async ngOnInit() {
    try {
      if (!this.data.user) {
        await this.data.getProfile();
      }
      this.settingForm.patchValue({
        name:this.data?.user?.name,
        isSeller:this.data?.user?.isSeller,
        email:this.data?.user?.email,
      });
      this.currentSettings = true;
    } catch (error) {
      this.data.error(error);
    }
  }


  async update() {
    if (!this.settingForm.valid) {
      return;
    } else {
        const payload = {
          name: this.settingForm.get('name').value,
          email: this.settingForm.get('email').value,
          password: this.settingForm.get('newPwd').value,
          isSeller: this.settingForm.get('isSeller').value
        }

        const data:any = await this.rest.post('http://localhost:3030/api/accounts/profile',payload);

      data['success'] ? (this.data.getProfile(), this.data.success(data['message'])): this.data.error(data['message']);
    }

  }

  get f() {
    return this.settingForm.controls;
  }
}
