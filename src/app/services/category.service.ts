import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Category } from '../models/category';

@Injectable()
export class CategoryService {

  constructor(private http: Http) {
    // console.log('CatServ Init ...');
  }

  getCategories() {
    return this.http
      .get('http://localhost:62112/api/Category')
      .map(res => res.json());
  }

  getCategory(categoryId: number) {
    return this.http
      .get('http://localhost:62112/api/Category/' + categoryId)
      .map(res => res.json());
  }

  addCategory(category: Category) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(category);
    return this.http
      .post('http://localhost:62112/api/Category', body, options)
      .map(res => res.json());
  }

  editCategory(category: Category) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify(category);
    return this.http
      .put('http://localhost:62112/api/Category', body, options)
      .map(res => res.json());
  }

  deleteCategory(categoryId: number) {
    return this.http
      .delete('http://localhost:62112/api/Category/' + categoryId)
      .map(res => res.json());
  }
}
