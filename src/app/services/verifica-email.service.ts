import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VerificaEmailService {

  constructor(private http: HttpClient) { }

  /*SERVIÇO PARA VERFICAR SE O EMAIL JÁ EXISTE NO SERVIDOR*/
  verificarEmail(email: string){
    /*Esse json contém emails para simular um backend com vários emails e verficar se já existe*/
    return this.http.get('assets/dados/verificarEmail.json').pipe(
      //Necessário colocar o delay para otimizar o código porque a cada letra digitada faz requisição no servidor o que não é muito legal
      delay(1000),
      map((dados: any) => dados.emails),
      tap(console.log),
      map((dados: {email: string}[]) => dados.filter(v => v.email === email)),
      //tap(console.log),
      map((dados: any[]) => dados.length > 0),
      //tap(console.log)
    );
  }
}
