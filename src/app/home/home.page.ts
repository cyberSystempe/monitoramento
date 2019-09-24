import { Component } from '@angular/core';
import { Funcionario } from '../model/Funcionario';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  exibirConfig = true
  PATH ='PATH'
  configuracao = ''
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  listaFuncionarios: Funcionario[] = new Array<Funcionario>();
  constructor(public storage: Storage, private http: HttpClient ) {
    this.storage.get(this.PATH).then(data => { 
      if(data){
        this.configuracao = data
        this.exibirConfig = false
        this.listar()
      }
    })
  }

  salvarConfig(){
    if(this.configuracao){
      this.storage.set(this.PATH , this.configuracao)
      this.configuracao
      this.exibirConfig = false
      this.listar()
    }
    
  }
  listar(){
    console.log('Listar TODOS')
    setTimeout( () => {
      this.listaFuncionarios = new Array<Funcionario>() 
        this.listar()
      }, 30000)

    this.getList().subscribe(response => {
      for(let data of response) {
        console.log(data)
        this.listaFuncionarios.push(data)
      }
     
     // console.log(response)
    })
    
  }
   // Get students data
   getList(): Observable<Funcionario[]> {
    return this.http
      .get<Funcionario[]>(this.configuracao+'findAll')
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }


  // Handle API errors
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


}
