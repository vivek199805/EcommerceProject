import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  btnDisabled = false;
  handler: any;

  quantities:any = [];

  constructor(
    private data: DataService,
    private rest: RestApiService,
    private router: Router,
  ) {}

  trackByCartItems(index: number, item: any) {
    return item._id;
  }

  get cartItems() {
    return this.data.getCart();
  }

  get cartTotal() {
    let total = 0;
    this.cartItems.forEach((data:any, index:any) => {
      total += data['price'] * this.quantities[index];
    });
    return total;
  }

  removeProduct(index:any, product:any) {
    this.quantities.splice(index, 1);
    this.data.removeFromCart(product);
  }

  ngOnInit() {
    this.cartItems.forEach((data:any) => {
      this.quantities.push(1);
    });

    // this.handler = StripeCheckout.configure({
    //   key: environment.stripeKey,
    //   image: 'assets/img/logo.png',
    //   locale: 'auto',
    //   token: async (stripeToken:any) => {
    //     let products:any;
    //     products = [];
    //     this.cartItems.forEach((d:any, index:any) => {
    //       products.push({
    //         product: d['_id'],
    //         quantity: this.quantities[index],
    //       });
    //     });

    //     try {
    //       const data:any = await this.rest.post('http://localhost:3030/api/payment',
    //         {
    //           totalPrice: this.cartTotal,
    //           products,
    //           stripeToken,
    //         },
    //       );
    //       data['success']
    //         ? (this.data.clearCart(), this.data.success('Purchase Successful.'))
    //         : this.data.error(data['message']);
    //     } catch (error:any) {
    //       this.data.error(error['message']);
    //     }
    //   },
    // });

  }

  validate() {
    if (!this.quantities.every((data:any) => data > 0)) {
      this.data.warning('Quantity cannot be less than one.');
    } else if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']).then(() => {
        this.data.warning('You need to login before making a purchase.');
      });
    } else if (!this.data.user['address']) {
      this.router.navigate(['/profile/address']).then(() => {
        this.data.warning('You need to fill address before making a purchase.');
      });
    } else {
      this.data.message = '';
      return true;
    }

    return null
  }

  checkout() {
    this.btnDisabled = true;
    try {
      if (this.validate()) {
        this.handler.open({
          name: 'Amazono',
          description: 'Checkout Payment',
          amount: this.cartTotal * 100,
          closed: () => {
            this.btnDisabled = false;
          },
        });
      } else {
        this.btnDisabled = false;
      }
    } catch (error) {
      this.data.error(error);
    }
  }

}
