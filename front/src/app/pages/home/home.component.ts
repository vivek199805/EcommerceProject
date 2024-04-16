import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { config } from 'src/app/services/config';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  products: any;

  constructor(private data: DataService,
    private authService:AuthService
  ) {}

   ngOnInit() {
    try {
      this.authService.getdata(config.getProduct).subscribe((res:any) => {
        console.log(res);
         if(res['success']){
          this.products = res['products']
         }else{
          this.data.error('Could not fetch products.');
         }
      });
    } catch (error:any) {
      this.data.error(error['message']);
    }
  }

}
