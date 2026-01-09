// import { HttpClient } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { HttpServiceService } from '../http-service.service';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html'
// })
// export class LoginComponent {

//   endpoint = "http://localhost:8000/orsapi/Login/auth/";

//   form: any = {
//     error: false,
//     message: '',
//     data: {},
//     inputerror: {},
//   };

//   constructor(private httpService: HttpServiceService, private router: Router) {
//   }

//   signIn() {
//     var _self = this;
//     this.httpService.post(this.endpoint, this.form.data, function (res: any) {

//       _self.form.message = '';
//       _self.form.inputerror = {};

//       if (res.result.message) {
//         _self.form.message = res.result.message;
//       }

//       _self.form.error = !res.success;
//       if (_self.form.error && res.result.inputerror) {
//         _self.form.inputerror = res.result.inputerror;
//       }

//       if (res.success) {
//         localStorage.setItem("firstName", res.result.data.firstName);
//         localStorage.setItem("roleName", res.result.data.roleName);
//         localStorage.setItem("loginId", res.result.data.loginId);
//         localStorage.setItem("id", res.result.data.id);
//         localStorage.setItem('token', 'Bearer ' + res.result.token)

//         _self.router.navigateByUrl('dashboard');
//         console.log(res.result.data.loginId);
//         console.log(res.result.token)
        
//       }
//     });
//   }

//   signUp() {
//     this.router.navigateByUrl('signup');
//   }
// }

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpServiceService } from '../http-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  endpoint = "http://localhost:8000/orsapi/Login/auth/";

  form: any = {
    error: false,
    message: '',
    data: {},
    inputerror: {},
  };

  constructor(private httpService: HttpServiceService, private router: Router) { }

  signIn() {
    const _self = this;

    // Clear previous messages
    _self.form.message = '';
    _self.form.inputerror = {};

    this.httpService.post(this.endpoint, this.form.data, function (res: any) {

      _self.form.error = !res.success;

      // Handle message
      if (res.result?.message) {
        _self.form.message = res.result.message;
      }

      // Handle input errors
      if (_self.form.error && res.result?.inputerror) {
        _self.form.inputerror = res.result.inputerror;
      }

      // Handle success
      if (res.success) {
        localStorage.setItem("firstName", res.result.data.firstName);
        localStorage.setItem("roleName", res.result.data.roleName);
        localStorage.setItem("loginId", res.result.data.loginId);
        localStorage.setItem("id", res.result.data.id);
        localStorage.setItem('token', 'Bearer ' + res.result.token);

        _self.router.navigateByUrl('dashboard');
      }

    });
  }

  // signUp method exists so template button works
  signUp() {
    this.router.navigateByUrl('signup');
  }
}
