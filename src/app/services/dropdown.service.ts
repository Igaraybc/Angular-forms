import { EstadoBr } from './estado-br.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cidade } from './cidade';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropdownService {

  constructor(private http: HttpClient) { }

  getEstadosBr(){
    return this.http.get<EstadoBr[]>('assets/dados/estados-br.json')
  }

  getCidadesBr(idEstado: any){
    return this.http.get<Cidade[]>('assets/dados/cidades-br.json')
    .pipe(
      map((cidades: Cidade[]) => cidades.filter(v => v.estado == idEstado))
    )
  }

  /*apredendo a selecionar o objeto completo pelo select e não só um valor simples*/
  getCargos(){
    return [
      {nome: 'dev', nivel: 'junior', desc: 'dev jr'},
      {nome: 'dev', nivel: 'pleno', desc: 'dev pl'},
      {nome: 'dev', nivel: 'senior', desc: 'dev sr'}
    ]
  }

  getTecnologias(){
    return [
      {nome: 'Java', desc:'java'},
      {nome: 'JavaScript', desc:'javaScript'},
      {nome: 'php', desc:'php'},
      {nome: 'ruby', desc:'ruby'},
      {nome: 'nada', desc:'nada'}
    ]
  }

  /* Fazendo o botão rádio mais dinâmico colocando as opções atrvés do ngFor*/
  getNewsletter(){
    return [
      {valor:'s', desc: 'Sim'},
      {valor: 'n', desc: 'Não'}
    ]
  }

}
