import { Injectable } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

@Injectable()
export class CustomToastyService {

    constructor(private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
        // Assign the selected theme name to the `theme` property of the instance of ToastyConfig. 
        // Possible values: default, bootstrap, material

        // this.toastyConfig.theme = 'material';
        // this.toastyConfig.position = 'center-center';
    }

    showMessage(type: string, message: string) {

        var toastOptions: ToastOptions = {
            title: '',
            msg: message,
            showClose: true,
            timeout: 2000,
            theme: 'material'
        };

        if (type === 'success') {
            this.toastyService.success(toastOptions);
        }
        else if (type === 'error') {
            this.toastyService.error(toastOptions);
        }
        else if (type === 'warning') {
            this.toastyService.warning(toastOptions);
        }
        else {
            this.toastyService.info(toastOptions);
        }
    }

    //   addToast() {
    //     // Just add default Toast with title only
    //     this.toastyService.default('Hi there');
    //     // Or create the instance of ToastOptions
    //     var toastOptions: ToastOptions = {
    //       title: "My title",
    //       msg: "The message 12345",
    //       showClose: true,
    //       timeout: 2000,
    //       theme: 'material',
    //       onAdd: (toast: ToastData) => {
    //         console.log('Toast ' + toast.id + ' has been added!');
    //       },
    //       onRemove: function (toast: ToastData) {
    //         console.log('Toast ' + toast.id + ' has been removed!');
    //       }
    //     };
    //     // Add see all possible types in one shot
    //     this.toastyService.info(toastOptions);
    //     this.toastyService.success(toastOptions);
    //     this.toastyService.wait(toastOptions);
    //     this.toastyService.error(toastOptions);
    //     this.toastyService.warning(toastOptions);
    //   }
}
