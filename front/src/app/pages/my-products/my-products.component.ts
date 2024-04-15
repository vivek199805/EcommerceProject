import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.component.html',
  styleUrls: ['./my-products.component.css']
})
export class MyProductsComponent implements OnInit {

  products: any;

  constructor(private data: DataService, private rest: RestApiService) { }

  async ngOnInit() {
    try {
      const data:any = await this.rest.get('http://localhost:3030/api/seller/products');
      data['success']
        ? (this.products = data['products'])
        : this.data.error(data['message']);
    } catch (error:any) {
      this.data.error(error['message']);
    }
  }
}
