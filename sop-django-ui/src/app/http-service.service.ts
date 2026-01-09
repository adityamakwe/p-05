// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class HttpServiceService {

//   constructor(private httpClient: HttpClient) { }

//   post(endpoint: any, bean: any, callback: any) {
//     return this.httpClient.post(endpoint, bean).subscribe((data: any) => {
//       callback(data);
//     })
//   }

//   get(endpoint: any, callback: any) {
//     return this.httpClient.get(endpoint).subscribe((data: any) => {
//       callback(data);
//     })
//   }

// }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private httpClient: HttpClient) { }

  /**
   * POST request
   * @param endpoint - API URL
   * @param bean - Request body
   * @param callback - Success callback
   * @param errorCallback - Error callback (optional)
   */
  post(endpoint: any, bean: any, callback: any, errorCallback?: any) {
    this.httpClient.post(endpoint, bean).subscribe(
      (data: any) => {
        callback(data);
      },
      (error: any) => {
        if (errorCallback) {
          errorCallback(error);
        } else {
          console.error('HTTP POST Error:', error);
        }
      }
    );
  }

  /**
   * GET request
   * @param endpoint - API URL
   * @param callback - Success callback
   * @param errorCallback - Error callback (optional)
   */
  get(endpoint: any, callback: any, errorCallback?: any) {
    this.httpClient.get(endpoint).subscribe(
      (data: any) => {
        callback(data);
      },
      (error: any) => {
        if (errorCallback) {
          errorCallback(error);
        } else {
          console.error('HTTP GET Error:', error);
        }
      }
    );
  }
}

