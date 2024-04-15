import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { config } from 'src/app/services/config';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  btnDisabled = false;

  currentAddress: any;

  constructor(private data: DataService,
    private rest: RestApiService,
    private _AuthService:AuthService
    ) { }

  async ngOnInit() {
    try {
      this._AuthService.getdata(config.getAccountsAddress).subscribe((res:any) => {
        if(res['success']){
          this.currentAddress = res['address'];
        }else{
          this.data.warning(res.message);
        }
    })

    } catch (error:any) {
      this.data.error(error['message']);
    }
  }

   updateAddress() {
    this.btnDisabled = true;
    try {
      this._AuthService.postdata(this.currentAddress, config.getAccountsAddress).subscribe((res:any) => {
        if(res['success']){
           this.data.getProfile();
          this.data.success(res['message'])
        }else{
          this.data.error(res['message']);
        }
    })
    } catch (error:any) {
      this.data.error(error['message']);
    }
    this.btnDisabled = false;
  }

}
