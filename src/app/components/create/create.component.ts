import { Component, OnInit, OnDestroy } from '@angular/core';
import { Collection } from '../../models/collection';
import { Category } from '../../models/category';

import { DataService } from '../../services/data.service';
import { CustomToastyService } from '../../services/customToasty.service';

import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ActiveCollection } from '../../models/activecollection';

import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  providers: [DataService, CustomToastyService]
})

export class CreateComponent implements OnInit, OnDestroy {

  private sub: any;
  private workoutIdforEdit: number;
  private workoutModelforEdit: Collection;

  public isEditMode: boolean;
  public collectionToAdd: Collection;

  public calories: number;
  public categories: Category[];
  public newCategory: string;

  public selectedCategory: Category;

  @ViewChild('addCatCloseBtn') addCatModalCloseBtn: ElementRef;

  constructor(
    private _dataService: DataService,
    private _customToastyService: CustomToastyService,
    private route: ActivatedRoute,
    private router: Router) {

    this.categories = [];
    this.categories.push({ categoryId: 0, categoryName: "Select Category" });
    this.selectedCategory = this.categories[0];

    this.calories = 0.0;

    this.collectionToAdd = {
      workoutId: 0,
      workoutTitle: '',
      workoutNote: '',
      caloriesBurntPerMin: 0,
      categoryId: 0
    };
  }

  ngOnInit() {

    if (this.router.url.includes('edit')) {
      this.isEditMode = true;
    }
    else {
      this.isEditMode = false;
    }

    this._dataService
      .getAll<Category[]>('Category')
      .subscribe(
        (data: Category[]) => {
          this.categories = data;
          this.categories.unshift({ categoryId: 0, categoryName: "Select Category" });
          this.selectedCategory = this.categories[0];

          if (this.isEditMode) {
            this.sub = this.route.params.subscribe(params => {
              if (params['id'] && Number.isInteger(+params['id'])) {
                this.workoutIdforEdit = + params['id'];

                this._dataService
                  .getSingle<Collection>('Collection', this.workoutIdforEdit)
                  .subscribe((data: Collection) => {

                    this.collectionToAdd = data;
                    this.workoutModelforEdit = Object.assign({}, data);

                    this.calories = data.caloriesBurntPerMin;
                    var index = this.categories.findIndex(cat => cat.categoryId == data.categoryId);
                    if (index) this.selectedCategory = this.categories[index];
                  },
                    error => () => {
                      //console.log(error);
                    }
                  );
              }
              else {
                this.workoutIdforEdit = -1;
              }
            });
          }
        },
        error => () => {
          this.categories = [];
        });
  }

  ngOnDestroy() {
    if (this.isEditMode) this.sub.unsubscribe();
  }

  private closeAddCatModal(): void {
    this.addCatModalCloseBtn.nativeElement.click();
  }

  addCalory() {
    if (this.calories || this.calories == 0) {
      this.calories = this.calories + 0.1;
    }
    else this.calories = 0.0;

    this.calories = +(this.calories.toFixed(1));
  }

  subtractCalory() {
    if (this.calories > 0.0) {
      this.calories = this.calories - 0.1;
    }

    this.calories = +(this.calories.toFixed(1));
  }

  addCategory() {
    if (this.newCategory && this.newCategory.trim() !== '') {
      //console.log(this.newCategory);

      let newInputCat = {
        categoryId: 0,
        categoryName: this.newCategory
      };

      this._dataService
        .add<Category>('Category', newInputCat)
        .subscribe(
          (data: any) => {
            if (data && data > 0) {
              
              this._customToastyService.showMessage('success', 'Category Added Successfully !');
              this.closeAddCatModal();

              this.newCategory = '';
              this._dataService
                .getAll<Category[]>('Category')
                .subscribe(
                  (data: Category[]) => {
                    this.categories = data;
                    this.categories.unshift({ categoryId: 0, categoryName: "Select Category" });
                    var index = this.categories.findIndex(cat => cat.categoryName == newInputCat.categoryName);
                    if (index) this.selectedCategory = this.categories[index];
                  },
                  error => () => {
                    this.categories = [];
                    this.categories.unshift({ categoryId: 0, categoryName: "Select Category" });
                    this.selectedCategory = this.categories[0];
                  });
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
    else {
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }
  }

  addWorkout() {
    //console.log('add wko');

    this.collectionToAdd.workoutId = 0;
    this.collectionToAdd.categoryId = this.selectedCategory.categoryId;
    this.collectionToAdd.caloriesBurntPerMin = this.calories;

    if (this.collectionToAdd.workoutTitle && this.collectionToAdd.workoutTitle.trim() !== ''
      && this.collectionToAdd.workoutNote && this.collectionToAdd.workoutNote.trim() !== ''
      && this.collectionToAdd.categoryId && this.collectionToAdd.categoryId != 0
      && this.collectionToAdd.caloriesBurntPerMin && this.collectionToAdd.caloriesBurntPerMin != 0) {

      this.collectionToAdd.workoutTitle = this.collectionToAdd.workoutTitle.trim();
      this.collectionToAdd.workoutNote = this.collectionToAdd.workoutNote.trim();

      this._dataService
        .add<Collection>('Collection', this.collectionToAdd)
        .subscribe(
          (data: any) => {
            if (data && data > 0) {
              this._customToastyService.showMessage('success', 'Workout Created Successfully !');

              this.collectionToAdd = {
                workoutId: 0,
                workoutTitle: '',
                workoutNote: '',
                caloriesBurntPerMin: 0,
                categoryId: 0
              };

              this.selectedCategory = this.categories[0];
              this.calories = this.collectionToAdd.caloriesBurntPerMin;
            }
            else {
              this._customToastyService.showMessage('error', 'Failed to Create New Workout !');
            }
          },
          error => {
            this._customToastyService.showMessage('error', 'Failed to Create New Workout !');
            //console.log(error);
          }
        );

    }
    else {
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }
  }

  editWorkout() {

    this.collectionToAdd.categoryId = this.selectedCategory.categoryId;
    this.collectionToAdd.caloriesBurntPerMin = this.calories;

    if (
      this.collectionToAdd
      && this.collectionToAdd.categoryId && this.collectionToAdd.categoryId != 0
      && this.collectionToAdd.workoutTitle && this.collectionToAdd.workoutTitle.trim() !== ''
      && this.collectionToAdd.workoutNote && this.collectionToAdd.workoutNote.trim() !== ''
      && this.collectionToAdd.caloriesBurntPerMin && this.collectionToAdd.caloriesBurntPerMin != 0
      && (this.collectionToAdd.categoryId != this.workoutModelforEdit.categoryId
        || this.collectionToAdd.workoutTitle != this.workoutModelforEdit.workoutTitle
        || this.collectionToAdd.workoutNote != this.workoutModelforEdit.workoutNote
        || this.collectionToAdd.caloriesBurntPerMin != this.workoutModelforEdit.caloriesBurntPerMin)
    ) {

      this.collectionToAdd.workoutTitle = this.collectionToAdd.workoutTitle.trim();
      this.collectionToAdd.workoutNote = this.collectionToAdd.workoutNote.trim();

      this._dataService
        .update<Collection>('Collection', this.collectionToAdd)
        .subscribe((data: any) => {
          if (data && data > 0) {
            this._customToastyService.showMessage('success', 'Workout Updated Successfully !');
            this.router.navigate(['']);
          }
          else {
            this._customToastyService.showMessage('error', 'Failed to Update Selected Workout !');
          }
        },
          error => {
            this._customToastyService.showMessage('error', 'Failed to Update Selected Workout !');
            //console.log(error);
          }
        );

    }
    else {
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }
  }

}
