import { Component, OnInit } from '@angular/core';
import { Category } from '../../models/category';

import { DataService } from '../../services/data.service';
import { CustomToastyService } from '../../services/customToasty.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
  providers: [DataService, CustomToastyService]
})

export class CategoryComponent implements OnInit {

  public categories: Category[];
  private newCategory: string;
  private selectedCat: Category;
  private catBeforeEdit: string;

  constructor(private _dataService: DataService, private _customToastyService: CustomToastyService) {
    this.selectedCat = {
      categoryId: 0,
      categoryName: ''
    };
  }

  ngOnInit() {
    this._dataService
      .getAll<Category[]>('Category')
      .subscribe(
        (data: Category[]) => this.categories = data,
        error => () => {
          this.categories = [];
        });
  }

  addCategory() {

    if (this.newCategory && this.newCategory.trim() !== '') {

      let newInputCat = {
        categoryId: 0,
        categoryName: this.newCategory.trim()
      };

      this._dataService
        .add<Category>('Category', newInputCat)
        .subscribe(
          (data: any) => {
            if (data && data > 0) {
              this._customToastyService.showMessage('success', 'Category Added Successfully !');

              this.newCategory = '';
              this._dataService
                .getAll<Category[]>('Category')
                .subscribe(
                  (data: Category[]) => this.categories = data,
                  error => () => { },
                  () => { });
            }
            else {
              this._customToastyService.showMessage('error', 'Failed to Add New Category !');
            }
          },
          error => {
            this._customToastyService.showMessage('error', 'Failed to Add New Category !');
            //console.log(error);
          }
        );
    }
    else{
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }
  }

  deleteCategory(cateGoryId) {

    this._dataService
      .delete<Category>('Category', cateGoryId).subscribe(
        (data: any) => {
          if (data && data > 0) {
            this._customToastyService.showMessage('success', 'Category Removed Successfully !');

            this._dataService
              .getAll<Category[]>('Category')
              .subscribe(
                (data: Category[]) => this.categories = data,
                error => () => { },
                () => { });
          }
          else {
            this._customToastyService.showMessage('error', 'Failed to Remove Selected Category !');
          }
        },
        error => {
          this._customToastyService.showMessage('error', 'Failed to Remove Selected Category !');
          //console.log(error);
        }
      );
  }

  catModOpen(selectedcategory) {
    //console.log('catModOpen()' + selectedcategory);
    //this.selectedCat = selectedcategory;
    this.selectedCat = Object.assign({}, selectedcategory);
    this.catBeforeEdit = selectedcategory.categoryName;
  }

  updateCategory(updatedCategory) {
    if (updatedCategory.categoryName
      && updatedCategory.categoryName.trim() !== ''
      && updatedCategory.categoryName !== this.catBeforeEdit) {

      updatedCategory.categoryName = updatedCategory.categoryName.trim();
      //console.log('updateCategory()' + updatedCategory.categoryName);

      this._dataService
        .update<Category>('Category', updatedCategory).subscribe(
          (data: any) => {
            if (data && data > 0) {
              this._customToastyService.showMessage('success', 'Category Updated Successfully !');

              this._dataService
                .getAll<Category[]>('Category')
                .subscribe(
                  (data: Category[]) => this.categories = data,
                  error => () => { this.categories = []; });
            }
            else {
              this._customToastyService.showMessage('error', 'Failed to Update Selected Category !');
            }
          },
          error => {
            //console.log(error);
            this._customToastyService.showMessage('error', 'Failed to Update Selected Category !');
          }
        );

    }
  }

}
