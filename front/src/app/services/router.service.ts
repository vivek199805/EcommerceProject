import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterService {

  constructor(private route: Router) { }

	home(){
		this.route.navigate(['/home'])
	}

	login(){
		this.route.navigate(['/login'])
	}

	infoQuestion(id:any){
		this.route.navigate(['/info'],{ queryParams: { question: id } });
	}

	infoUser(id:any){
		this.route.navigate(['/info'],{ queryParams: { user: id } });
	}
}
