import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { RestApiService } from 'src/app/services/rest-api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  query: any;
  page = 1;

  content: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private data: DataService,
    private rest: RestApiService,
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((res:any) => {
      this.query = res['query'];
      this.page = 1;
      this.getProducts();
    });
  }

  get lower() {
    return 1 + this.content.hitsPerPage * this.content.page;
  }

  get upper() {
    return Math.min(
      this.content.hitsPerPage * (this.content.page + 1),
      this.content.nbHits,
    );
  }

  async getProducts() {
    this.content = null;
    try {
      const data:any = await this.rest.get(`http://localhost:3030/api/search?query=${this.query}&page=${this.page -1}`,);
      data['success']
        ? (this.content = data['content'])
        : this.data.error(data['message']);
    } catch (error:any) {
      this.data.error(error['message']);
    }
  }
}
