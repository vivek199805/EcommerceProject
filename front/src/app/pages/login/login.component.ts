import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { config } from 'src/app/services/config';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	loginForm:any = FormGroup;
  constructor(
    private router: Router,
    private rest: RestApiService,
    private data: DataService,
    private authService:AuthService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.email, Validators.required]),
      password: new FormControl("", [Validators.required])
		});
  }

  ngOnInit() {}

  async login() {

       const data =   {
        email: this.loginForm.get('email').value,
        password: this.loginForm.get('password').value,
          }
          const formData = new FormData();
          formData.append('email', this.loginForm.get('email').value);
          formData.append('password', this.loginForm.get('password').value)
    this.authService.postdata(formData, config.login).subscribe((res: any) => {
      if(res.statusCode == 200){
        localStorage.setItem('token', res.token)
         this.data.getProfile();
         this.router.navigate(['/']);
        }else {
          this.data.error(res['message']);
      }
    },
    (err) => {
      alert("We got an error in Login...");
      }
    );
  }

  get f() {
    return this.loginForm.controls;
  }

}
