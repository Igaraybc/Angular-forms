import { FormValidations } from './../services/form-validations';
import { Cargo } from './../services/cargo';
import { ConsultarCepService } from './../services/consultar-cep.service';
import { EstadoBr } from './../services/estado-br.model';
import { DropdownService } from './../services/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { observable, Observable, of } from 'rxjs';
import { VerificaEmailService } from '../services/verifica-email.service';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { BaseFormComponent } from '../base-form/base-form.component';
import { Cidade } from '../services/cidade';

declare var $:any;
@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent extends BaseFormComponent implements OnInit {

  cargos: any[] = [];
  estados: EstadoBr[] = [];
  cidades: Cidade[] = [];
  //estados: Observable<EstadoBr[]> | undefined;
  readonly: boolean = false;
  tecnologias: any[] = [];
  newsletterop: any = [];
  frameworks = ['angular', 'react', 'vue', 'sencha'];

  constructor(private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultarCepService,
    private verificaEmailService: VerificaEmailService) {
      super();
     }

  ngOnInit(): void {

    this.cargos = this.dropdownService.getCargos();
    this.tecnologias = this.dropdownService.getTecnologias();
    this.newsletterop = this.dropdownService.getNewsletter();

    // this.dropdownService.getEstadosBr();
    this.dropdownService.getEstadosBr().subscribe((dados) => {
      this.estados = dados;
    })

    /*this.formulario = new FormGroup({
      Para fazer validações tem a classe validators do angular,
      Se tiver mais que uma validação colocar entre []
      nome: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
      //dentro dos parênteses coloca o valor inicial
    })*/

    //outra forma de criar:
    this.formulario = this.formBuilder.group({
      nome: [null, Validators.required],
      email: [null, [ Validators.required, FormValidations.emailValidator], [this.validarEmail.bind(this)]],
      //Confirmar email compara os dois emails para ver se está certo.
      confirmarEmail: [null, [ FormValidations.equalsTo('email'), Validators.required]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required]
      }),
      cargo: [null, Validators.required],
      tecnologia: [null],
      newsletter: ['s'], //valor padrão s
      termos: [null, [Validators.pattern('true'), Validators.required]],
      frameworks: this.buildFrameworks()
    })

    /*Reagindo a mudanças reativamente
    status e status change: observable que emite valores a cada mudança de status do formulário*/

    /*melhoria do cep: Só chama o método consultaCep() se o Cep for válido*/
    this.formulario.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(), //Só vamos capturar o valor quando ele for modificado nesse exemplo o status fica invalido até o cep ter 8 dígitos.
        tap(value => console.log('valor cep:',value)),
        switchMap(status => status === 'VALID' ? this.cepService.consultarCep(this.formulario.get('endereco.cep')?.value): of({}))
      )
      .subscribe(dados => dados? this.preencheCep(dados) : {});   

      this.formulario.get('endereco.estado')?.valueChanges
        .pipe(
          map(estado => this.estados.filter(v => v.sigla == estado)),
          map(estados => estados && estados.length > 0 ? estados[0].id : of({})),
          switchMap((estadoId) => this.dropdownService.getCidadesBr(estadoId)),
        ).subscribe(cidades => this.cidades = cidades);
    }


  /*submit(){
    let valueSubmit = Object.assign({}, this.formulario.value);
    //Mandar pro servidor apenas as opções que forem true, então vamos modificar o campo de frameworks
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks.map((v:any, i:any) => v? this.frameworks[i] : null)
      .filter((v:any) => v !== null)
    })
    
    Envia o formulário para o endereço do servidor
    this.http.post("https://httpbin.org/post", JSON.stringify(valueSubmit)).subscribe((dados)=>{
        //reseta o form quando receber os dados assim que enviar o usuário poderá preeencher o form novamente;
        //this.resetar();
        console.log(dados);
      },
      (error: any) => alert("erro")
      )
  }*/

  submit(){
    let valueSubmit = Object.assign({}, this.formulario.value);
    //Mandar pro servidor apenas as opções que forem true, então vamos modificar o campo de frameworks
    valueSubmit = Object.assign(valueSubmit, {
      frameworks: valueSubmit.frameworks.map((v:any, i:any) => v? this.frameworks[i] : null)
      .filter((v:any) => v !==null)
    })

    console.log(valueSubmit);

    if(this.formulario.valid){
      this.http.post("https://httpbin.org/post", JSON.stringify(valueSubmit)).subscribe((dados)=>{
        //reseta o form quando receber os dados assim que enviar o usuário poderá preeencher o form novamente;
        //this.resetar();
        console.log(dados);
      },
      (error: any) => alert("erro")
      )
    } else{
        this.verificaValidacoesForm(this.formulario);
      }
  }

  //Não é preciso passar o valor do cep nem o form porque a gente já tem essa info no próprio componente
  /*consultarCep(){
    let cep = this.formulario.get('endereco.cep')?.value;
    if(cep !== '' && cep != null){
      this.cepService.consultarCep(cep).subscribe((dados) => {
        this.preencheCep(dados);
      });

      cep = cep.replace(/\D/g, '');
      let validcep = /^[0-9]{8}$/;
      if(validcep.test(cep)){
        this.http.get("https://viacep.com.br/ws/"+ cep + "/json").subscribe((dados) =>{
          this.preencheCep(dados);
        })
      }

    }
  }*/

  preencheCep(dados: any){
    this.formulario.patchValue({
      endereco:{
        cep: dados.cep,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    })
    //Se for preciso popular apenas um valor dá pra utilizar o setValue do próprio fromControl:
  }

  setarCargo(){
    const cargo = {nome: 'dev', nivel: 'pleno', desc: 'dev pl'};
    this.formulario.get('cargo')?.setValue(cargo);
  }

  compararCargos(obj1: Cargo, obj2: Cargo){
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel): obj1 === obj2;
  }

  setarTecnologia(){
    this.formulario.controls.tecnologia.setValue(['java', 'php', 'ruby']);
  }

  buildFrameworks(){
    //Coloca um formcontrol para cada opção que tem no grupo de checkbox; porém colocar manualmente não dá certo tem que ser mais dinâmico;
    const values = this.frameworks.map(v => new FormControl(false)); //Para cada valor que existe no array de frameworks teremos um new FormControl;

    return this.formBuilder.array(values, FormValidations.requiredMinCheckbox(1));
  }

  get formData(){
    return <FormArray>this.formulario.get('frameworks');
  }

  validarEmail(formControl: FormControl){
    return this.verificaEmailService.verificarEmail(formControl.value)
    .pipe(map(emailExiste => emailExiste ? {emailExistente: true}: null))
  }
  
}
