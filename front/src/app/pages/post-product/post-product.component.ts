import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-post-product',
  templateUrl: './post-product.component.html',
  styleUrls: ['./post-product.component.css']
})
export class PostProductComponent implements OnInit {
  postProduct:any = FormGroup
  product:any = {
    title: '',
    price: 0,
    categoryId: '',
    description: '',
    product_picture: null
  };

  categories: any;
  btnDisabled = false;

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
    private fb:FormBuilder
  ) {
    this.postProduct = this.fb.group({
			title:["", [Validators.required]],
      price: ["", [Validators.required]],
      categoryId: ["", [Validators.required]],
			description: ["", [Validators.required]],
      product_picture: ["", [Validators.required]],
		});
   }

  async ngOnInit() {
    try {
      const data:any = await this.rest.get('http://localhost:3030/api/categories');
      data['success']
        ? (this.categories = data['categories'])
        : this.data.error(data['message']);
    } catch (error:any) {
      this.data.error(error['message']);
    }
  }

  fileChange(event: any) {
    // this.postProduct.get("product_picture"). = event.target.files[0];
    this.postProduct.patchValue({product_picture: event.target.files[0]})
  }

  async post() {
    this.btnDisabled = true;
    // try {
    //   if (this.validate(this.product)) {
    //     const form = new FormData();
    //     for (const key in this.product) {
    //       if (this.product.hasOwnProperty(key)) {
    //         if (key === 'product_picture') {
    //           form.append('product_picture',this.product.product_picture,this.product.product_picture.name);
    //         } else {
    //           form.append(key, this.product[key]);
    //         }
    //       }
    //     }
    //     const data:any = await this.rest.post('http://localhost:3030/api/seller/products',form);
    //     data['success']
    //       ? this.router.navigate(['/profile/myproducts'])
    //         .then(() => this.data.success(data['message']))
    //         .catch(error => this.data.error(error))
    //       : this.data.error(data['message']);
    //   }
    // } catch (error:any) {
    //   this.data.error(error['message']);
    // }
    const form = new FormData();
    form.append('title',this.postProduct.get('title').value);
       form.append('price',this.postProduct.get('price').value);
       form.append('categoryId',this.postProduct.get('categoryId').value);
       form.append('description',this.postProduct.get('description').value);
       form.append('product_picture',this.postProduct.get('product_picture').value);
    // form.append('product_picture',this.product.product_picture,this.product.product_picture.name);
    const data:any = await this.rest.post('http://localhost:3030/api/seller/products',form);
    data['success']
      ? this.router.navigate(['/profile/myproducts'])
        .then(() => this.data.success(data['message']))
        .catch(error => this.data.error(error))
      : this.data.error(data['message']);

    this.btnDisabled = false;
  }

}
