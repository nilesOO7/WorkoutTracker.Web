import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})

export class FilterPipe implements PipeTransform {

  transform(value: any, args: any[])
    : any {

    var fType = args[0];
    var input = args[1];

    if (input) {
      input = input.toLowerCase();
      return value.filter(function (el: any) {
        if (fType === 'Category') {
          return el.categoryName.toLowerCase().indexOf(input) > -1;
        }
        else if (fType === 'ActiveCollection') {
          return el.workoutTitle.toLowerCase().indexOf(input) > -1;
        }
        else return [];
      })
    }

    return value;
  }

}
