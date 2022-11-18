import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarCepService {

constructor(private http: HttpClient) { }

consultarCep(cep: string){
  if(cep != ''){
    cep = cep.replace(/\D/g, '');
    let validcep = /^[0-9]{8}$/;
    if(validcep.test(cep)){
      return this.http.get("https://viacep.com.br/ws/"+ cep + "/json");
    }
  }
  return of({}); //retorna um observable vazio;
}

}
