import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private BASE_URL = "http://localhost:8080";
  private LOGIN_API_URL = `${this.BASE_URL}\\auth\\login`;

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string) {
    this.http.post(this.LOGIN_API_URL, {email: email,password: password})
      .subscribe((resp : any) => {

        this.router.navigate(['/']);
        localStorage.setItem('auth_token', resp);
      });
  }


  logout() {
    localStorage.removeItem('auth_token');
  }

  public get logIn(): boolean {
    return (localStorage.getItem('auth_token') != null);
  }

}
