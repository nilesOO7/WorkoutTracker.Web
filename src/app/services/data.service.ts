import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Configuration } from '../app.constants';

@Injectable()
export class DataService {

  private actionUrl: string;

  constructor(private http: HttpClient, private _configuration: Configuration) {
    // this.actionUrl = _configuration.ServerWithApiUrl + 'Category';
    this.actionUrl = _configuration.ServerWithApiUrl;
  }

  public getAll<T>(actionName: string): Observable<T> {
    let serviceURL = this.actionUrl + actionName;
    return this.http.get<T>(serviceURL);
  }

  public getSingle<T>(actionName: string, id: number): Observable<T> {
    let serviceURL = this.actionUrl + actionName + "/";
    return this.http.get<T>(serviceURL + id);
  }

  public add<T>(actionName: string, item: T): Observable<T> {
    let serviceURL = this.actionUrl + actionName;
    let toAdd = JSON.stringify(item);
    return this.http.post<T>(serviceURL, toAdd);
  }

  public update<T>(actionName: string, item: T): Observable<T> {
    let serviceURL = this.actionUrl + actionName;
    let toUopdate = JSON.stringify(item);
    return this.http.put<T>(serviceURL, toUopdate);
  }

  public delete<T>(actionName: string, id: number): Observable<T> {
    let serviceURL = this.actionUrl + actionName + "/";
    return this.http.delete<T>(serviceURL + id);
  }
}
