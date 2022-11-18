import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-base-form',
  templateUrl: './base-form.component.html'
})
export abstract class BaseFormComponent implements OnInit {

  formulario: FormGroup = new FormGroup({});

  constructor() { }

  ngOnInit(): void {
  }

  abstract submit(): any;

  onSubmit(){
    if(this.formulario.valid){
      this.submit();
    }
    else{
      this.verificaValidacoesForm(this.formulario);
    }
  }

  //Função recursiva que verifica as validações nos formulários que apresentam aninhamento como é o caso de endereço
  verificaValidacoesForm(formGroup: FormGroup | FormArray){
    //Lógica de validação para quando o formulário é inválido
      Object.keys(formGroup.controls).forEach((campo) => {
        // esse campo apresenta as chaves dos formularios [nome, email, endereco];
        const controle = formGroup.get(campo);
        controle?.markAsDirty();
        //Marca os controles como dirty;
        controle?.markAsTouched();
        if(controle instanceof FormGroup || controle instanceof FormArray){
          this.verificaValidacoesForm(controle);
        }
      });
  }

  resetar(){
    this.formulario.reset();
  }

  verificaRequired(campo: string){
    return this.formulario.get(campo)?.hasError('required');
  }

  verificaTouched(campo: any){
    return this.formulario.get(campo)?.touched;
  }

  mostrarErro(campo: any){;
    // Verifica se o campo foi tocado ou modificado:
    if(this.verificaTouched(campo) || this.formulario.get(campo)?.dirty){
      if(!this.formulario.get(campo)?.valid){
        return 'is-invalid';
      }
      else if(this.formulario.get(campo)?.valid){
        return 'is-valid';
      }
    }
    return 'is-nothing';
  }

  verificaEmailExiste(){
    return this.formulario.get('email')?.hasError('emailExistente');
  }

}

