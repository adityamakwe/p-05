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


import { HttpClient } from '@angular/common/http';
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
    // Clear previous messages
    this.form.message = '';
    this.form.error = false;
    this.form.inputerror = {};

    // Call backend
    this.httpService.post(
      this.endpoint,
      this.form.data,
      (res: any) => {
        // ✅ Success response from Django
        if (res.success) {
          this.form.message = "Login successful";
          this.form.error = false;

          // Save user data and token
          localStorage.setItem("firstName", res.result.data.firstName);
          localStorage.setItem("roleName", res.result.data.roleName);
          localStorage.setItem("loginId", res.result.data.loginId);
          localStorage.setItem("id", res.result.data.id);
          localStorage.setItem('token', 'Bearer ' + res.result.token);

          // Navigate to dashboard
          this.router.navigateByUrl('dashboard');
        } else {
          // ✅ Handle validation or login errors
          this.form.error = true;

          if (res.result.inputerror) {
            this.form.inputerror = res.result.inputerror;
          }

          if (res.result.message) {
            this.form.message = res.result.message;
          }
        }
      },
      (err: any) => {
        // 🔥 Handle server errors (DB down, 500 etc.)
        this.form.error = true;

        if (err.error && err.error.result && err.error.result.message) {
          this.form.message = err.error.result.message;
        } else {
          this.form.message = "
