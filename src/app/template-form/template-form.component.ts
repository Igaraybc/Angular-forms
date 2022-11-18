import { ConsultarCepService } from './../services/consultar-cep.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any = {
    nome: null,
    email: null,
    cep: null,
    numero: null,
    complemento: null,
    rua: null,
    bairro: null,
    cidade: null,
    estado: null
    }
  readonly: boolean = false;

  constructor(private http: HttpClient,
    private cepService: ConsultarCepService) { }

  ngOnInit(): void {
  }

  onSubmit(form: any){
    this.http.post("enderecoserver", JSON.stringify(form.value));
  }

  mostrarErro(campo: any){
    if(campo.touched && campo.invalid && !campo.value){
      return true;
    }
    return false;
  }

  consultarCep(cep: any, form: any){
    cep = cep.value;

    if(cep != null && cep !== ''){
      this.cepService.consultarCep(cep)?.subscribe((dados) =>{
        this.preencheCep(dados, form);
      })
    }

    /*cep = cep.value;
    cep = cep.replace(/\D/g, '');

    if(cep != ''){
      let validcep = /^[0-9]{8}$/;
      if(validcep.test(cep)){
        this.http.get("https://viacep.com.br/ws/"+ cep + "/json").subscribe((dados) =>{
          this.preencheCep(dados, form);
        })
      }
    }*/
  }

  preencheCep(dados: any, form:any){
    /*form.setValue({
      nome: null,
      email: null,
      address:{
        cep: dados.cep,
        numero: null,
        complemento: null,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })*/

    form.form.patchValue({
      address:{
        cep: dados.cep,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
    this.readonly = true;
  }


}
