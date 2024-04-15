import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordReg } from 'src/app/common/passoerd-reg';
import { AuthService } from 'src/app/services/auth.service';
import { config } from 'src/app/services/config';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  name = '';
  email = '';
  password = '';
  password1 = '';
  isSeller = false;

  btnDisabled = false;
	registerForm:any = FormGroup;
  constructor(
    private router: Router,
    private data: DataService,
    private rest: RestApiService,
    private fb: FormBuilder,
    private authService:AuthService
  ) {
    this.registerForm = this.fb.group({
			name:["", [Validators.required]],
      email: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.required]],
			confirmPassword: ["", [Validators.required]],
      isSeller: [false],
		},{
      validator: [PasswordReg.passwordMatchValidator],
    }
    );
  }

  ngOnInit() {}

   register() {
    if (!this.registerForm.valid) {
      return;
    } else {
      const data =           {
        name: this.registerForm.get('name').value,
        email: this.registerForm.get('email').value,
        password: this.registerForm.get('password').value,
        isSeller: this.registerForm.get('isSeller').value,
      }
      this.authService.postdata(data, config.register).subscribe((res: any) => {
          if(res.statusCode == 200){
            localStorage.setItem('token', res.token)
             this.data.getProfile();
            //  this.router.navigate(['/']);
            }else {
              this.data.error(res['message']);
          }
        },
        (err) => {
          alert("We got an error in Login...");
          }
        );
    }
  }

}
