import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { config } from 'src/app/services/config';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categoryId: any;
  category: any;
  page = 1;

  constructor(
    private data: DataService,
    private activatedRoute: ActivatedRoute,
    private rest: RestApiService,
    private _AuthService:AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.categoryId = res['id'];
      this.getProducts();
    });
  }

  get lower() {
    return 10 * (this.page - 1) + 1;
  }

  get upper() {
    return Math.min(10 * this.page, this.category.totalProducts);
  }

  async getProducts(event?: any) {
    if (event) {
      this.category = null;
    }
    try {
      let payload:any = {
        categoryId:this.categoryId,
        page:this.page - 1
      }

        this._AuthService.postdata(payload, config.categorybyId).subscribe((res:any) => {
          if( res['success']){
            this.category = res;
            this.data.success(res['message'])
          }else{
            this.data.error(res['message']);
          }
      })
    } catch (error:any) {
      this.data.error(error['message']);
    }
  }

}
