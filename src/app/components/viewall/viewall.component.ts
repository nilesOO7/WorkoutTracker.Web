import { Component, OnInit } from '@angular/core';
import { Collection } from '../../models/collection';
import { Active } from '../../models/active';
import { ActiveCollection } from '../../models/activecollection';

import { DataService } from '../../services/data.service';
import { CustomToastyService } from '../../services/customToasty.service';

import { DatePipe } from '@angular/common';

import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-viewall',
  templateUrl: './viewall.component.html',
  styleUrls: ['./viewall.component.css'],
  providers: [DataService, CustomToastyService, DatePipe]
})

export class ViewAllComponent implements OnInit {

  public activeCollections: ActiveCollection[];
  public isActStartModalOpen: boolean;

  public activeCollectionToEdit: ActiveCollection;

  @ViewChild('activeModalClose') activeModalCloseBtn: ElementRef;

  constructor(
    private _dataService: DataService,
    private _customToastyService: CustomToastyService,
    private _datePipe: DatePipe) {

    this.activeCollectionToEdit = {
      workoutId: 0,
      categoryId: 0,
      workoutTitle: '',
      workoutNote: '',
      caloriesBurntPerMin: 0,
      comment: '',
      status: false,
      endDate: '',
      endTime: '',
      startDate: '',
      startTime: '',
      hasActiveRecord: false
    };

  }

  ngOnInit() {
    this._dataService
      .getAll<ActiveCollection[]>('ActiveCollection')
      .subscribe(
        (data: ActiveCollection[]) => this.activeCollections = data,
        error => () => {
          this.activeCollections = [];
        });
  }

  private closeActiveEditModal(): void {
    this.activeModalCloseBtn.nativeElement.click();
  }

  deleteWorkoutCollection(workoutId: number) {

    this._dataService
      .delete<Collection>('Collection', workoutId).subscribe(
        (data: any) => {
          if (data && data > 0) {
            this._customToastyService.showMessage('success', 'Workout Removed Successfully !');

            this._dataService
              .getAll<ActiveCollection[]>('ActiveCollection')
              .subscribe(
                (data: ActiveCollection[]) => this.activeCollections = data,
                error => () => {
                  this.activeCollections = [];
                });
          }
          else {
            this._customToastyService.showMessage('error', 'Failed to Remove Selected Workout !');
          }
        },
        error => {
          this._customToastyService.showMessage('error', 'Failed to Remove Selected Workout !');
          //console.log(error);
        }
      );
  }

  actStartOpen(col: ActiveCollection) {
    this.isActStartModalOpen = true;
    this.activeCollectionToEdit = Object.assign({}, col);

    var currentTimestamp = new Date().toISOString();
    this.activeCollectionToEdit.startDate = this._datePipe.transform(currentTimestamp, 'yyyy-MM-dd');
    this.activeCollectionToEdit.startTime = this._datePipe.transform(currentTimestamp, 'HH:mm:ss');
  }

  actEndOpen(col) {
    this.isActStartModalOpen = false;
    this.activeCollectionToEdit = Object.assign({}, col);

    var currentTimestamp = new Date().toISOString();
    this.activeCollectionToEdit.endDate = this._datePipe.transform(currentTimestamp, 'yyyy-MM-dd');
    this.activeCollectionToEdit.endTime = this._datePipe.transform(currentTimestamp, 'HH:mm:ss');
  }

  startWorkout() {

    if (
      this.activeCollectionToEdit && this.activeCollectionToEdit.workoutId != 0
      && this.activeCollectionToEdit.comment && this.activeCollectionToEdit.comment.trim() !== ''
      && this.activeCollectionToEdit.startDate && this.activeCollectionToEdit.startDate.trim() !== '' && !isNaN(Date.parse(this.activeCollectionToEdit.startDate))
      && this.activeCollectionToEdit.startTime && this.activeCollectionToEdit.startTime.trim() !== '' && !isNaN(Date.parse('1970-01-01T' + this.activeCollectionToEdit.startTime + 'Z'))
    ) {

      this.activeCollectionToEdit.endDate = null;
      this.activeCollectionToEdit.endTime = null;
      this.activeCollectionToEdit.status = true;

      if (this.activeCollectionToEdit.hasActiveRecord) {
        this._dataService
          .update<Collection>('Collection', this.activeCollectionToEdit)
          .subscribe((data: any) => {
            if (data && data > 0) {
              this._dataService
                .update<Active>('Active', this.activeCollectionToEdit)
                .subscribe((data: any) => {
                  if (data && data > 0) {

                    this.workoutStartSuccess();
                    this.closeActiveEditModal();

                    this._dataService
                      .getAll<ActiveCollection[]>('ActiveCollection')
                      .subscribe(
                        (data: ActiveCollection[]) => this.activeCollections = data,
                        error => {
                          this.activeCollections = [];
                        });
                  }
                  else { this.workoutStartFail(); }
                }, error => {
                  this.workoutStartFail();
                  //console.log(error);
                });
            }
            else { this.workoutStartFail(); }
          },
            error => {
              this.workoutStartFail();
              //console.log(error);
            });
      }
      else {
        this._dataService
          .update<Collection>('Collection', this.activeCollectionToEdit)
          .subscribe((data: any) => {
            if (data && data > 0) {
              this._dataService
                .add<Active>('Active', this.activeCollectionToEdit)
                .subscribe((data: any) => {
                  if (data && data > 0) {

                    this.workoutStartSuccess();
                    this.closeActiveEditModal();

                    this._dataService
                      .getAll<ActiveCollection[]>('ActiveCollection')
                      .subscribe(
                        (data: ActiveCollection[]) => this.activeCollections = data,
                        error => {
                          this.activeCollections = [];
                        });
                  }
                  else { this.workoutStartFail(); }
                },
                  error => {
                    this.workoutStartFail();
                    //console.log(error);
                  });
            }
            else { this.workoutStartFail(); }
          }, error => {
            this.workoutStartFail();
            //console.log(error);
          });
      }
    }
    else {
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }

  }

  endWorkout() {

    if (
      this.activeCollectionToEdit && this.activeCollectionToEdit.workoutId != 0
      && this.activeCollectionToEdit.comment && this.activeCollectionToEdit.comment.trim() !== ''
      && this.activeCollectionToEdit.endDate && this.activeCollectionToEdit.endDate.trim() !== '' && !isNaN(Date.parse(this.activeCollectionToEdit.endDate))
      && this.activeCollectionToEdit.endTime && this.activeCollectionToEdit.endTime.trim() !== '' && !isNaN(Date.parse('1970-01-01T' + this.activeCollectionToEdit.endTime + 'Z'))
    ) {

      this.activeCollectionToEdit.status = false;

      this._dataService
        .update<Collection>('Collection', this.activeCollectionToEdit)
        .subscribe((data: any) => {
          if (data && data > 0) {
            this._dataService
              .update<Active>('Active', this.activeCollectionToEdit)
              .subscribe((data: any) => {
                if (data && data > 0) {

                  this.workoutEndSuccess();
                  this.closeActiveEditModal();

                  this._dataService
                    .getAll<ActiveCollection[]>('ActiveCollection')
                    .subscribe(
                      (data: ActiveCollection[]) => this.activeCollections = data,
                      error => {
                        this.activeCollections = [];
                      });
                }
                else { this.workoutEndFail(); }
              }, error => {
                this.workoutEndFail();
                //console.log(error);
              });
          }
          else { this.workoutEndFail(); }
        },
          error => {
            this.workoutEndFail();
            //console.log(error);
          });
    }
    else {
      this._customToastyService.showMessage('warning', 'Please Provide All Necessary Inputs Correctly !');
    }
  }

  workoutStartSuccess() {
    this._customToastyService.showMessage('success', 'Workout Started !');
  }
  workoutStartFail() {
    this._customToastyService.showMessage('error', 'Failed to Start Workout !');
  }
  workoutEndSuccess() {
    this._customToastyService.showMessage('success', 'Workout Ended !');
  }
  workoutEndFail() {
    this._customToastyService.showMessage('error', 'Failed to End Workout !');
  }
}
