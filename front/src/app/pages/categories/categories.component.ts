import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { config } from 'src/app/services/config';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categories: any;

  newCategory = '';
  btnDisabled = false;

  constructor(
    public data: DataService,
    private rest: RestApiService,
    private _AuthService:AuthService
  ) { }

  async ngOnInit() {
    this._AuthService.getdata(config.categories).subscribe((res:any) => {
      if( res['success']){
        this.categories = res['categories']
      }else{
        this.data.error(res['message']);
      }
  })
  }

  async addCategory(value:any) {
    this.btnDisabled = true;
    const payload = { category: value }
    this._AuthService.postdata(payload, config.categories).subscribe((res:any) => {
        if( res['success']){
          this.data.success(res['message'])
        }else{
          this.data.error(res['message']);
        }
    })
    this.btnDisabled = false;
  }

}
