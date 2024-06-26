import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  myReview:any = {
    title: '',
    description: '',
    rating: 0,
  };
  btnDisabled = false;

  product: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe(res => {
      this.rest.get(`http://localhost:3030/api/product/${res['id']}`).then((data:any) => {
          data['success']
            ? (this.product = data['product'])
            : this.router.navigate(['/']);
        })
        .catch(error => this.data.error(error['message']));
    });
  }

  addToCart() {
    this.data.addToCart(this.product)
      ? this.data.success('Product successfully added to cart.')
      : this.data.error('Product has already been added to cart.');
  }

  async postReview() {
    this.btnDisabled = true;
    try {
      const data:any = await this.rest.post('http://localhost:3030/api/review', {
        productId: this.product._id,
        title: this.myReview.title,
        description: this.myReview.description,
        rating: this.myReview.rating,
      });
      data['success']
        ? this.data.success(data['message'])
        : this.data.error(data['message']);
      this.btnDisabled = false;
    } catch (error:any) {
      this.data.error(error['message']);
    }
  }

}
