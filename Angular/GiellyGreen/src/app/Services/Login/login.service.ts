import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  Token ="https://localhost:44389/Token";
  constructor(private http: HttpClient) { }

  LoginUser(email:any, password:any) {
    let body = new URLSearchParams();
    body.set('username', email);
    body.set('password', password);
    body.set('grant_type', "password");

    let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    return this.http.post(this.Token, body, options).pipe(
      map((data:any)=>{
        return data;
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }
}
