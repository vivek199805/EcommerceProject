import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  baseURL: string = 'http://localhost:3000'

	getMyAnswers(token?:any){
		return this.http.get(`${this.baseURL}/my-answers`)
	}

	getMyQuestion(token?:any){
		return this.http.get(`${this.baseURL}/my-questions`)
	}

	infoUser(id:any){
		return this.http.get(`${this.baseURL}/info-user/${id}`)
	}
}
