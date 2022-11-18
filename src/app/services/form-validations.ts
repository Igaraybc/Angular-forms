import { FormArray, FormControl, FormGroup } from '@angular/forms';

/*Classe de validação para formulário, porém tem várias classes prontas na internet que podem ser utilizadas como por exemplo ng2-validation*/


export class FormValidations {

  /*VALIDAÇÃO PARA O FORM ARRAY: o usuário necessita marcar pelo menos um do grupo de checkboxes*/
  //static só tem uma instancia para cada chamada então não precisainstanciar a classe para fazer a chamada
  static requiredMinCheckbox(min = 1): any{
    const validator=(formArray: FormArray) =>{
      /*(const values = formArray.controls;
      let totalChecked = 0;
      for(let i=0; i<values.length;i++){
        if(values[i].value){
          totalChecked++;
        }
      }*/
      const totalChecked = formArray.controls.map(v => v.value).reduce((total, current) => current ? total+current: total, 0);
      return totalChecked >= min ? null: { required: true};
    }
    //Passa qual tipo de campo está validando FormGroup, FormArray, FormControls
    return validator;
  }

  /*VALIDAÇÃO DE CEP*/
  static cepValidator(control: FormControl){
    let cep = control.value;
    if(cep && cep !== ''){
      const validacep = /[0-9]{5}-?[0-9]{3}/;
      //Se o test for valido retorna nulo porque significa que o valor está válido;
      return validacep.test(cep) ? null : { cepInvalido : true };
    }

    return null;
  }

  /*VALIDAÇÃO EMAIL*/
  static emailValidator(control: FormControl){
    let email = control.value;

    if(email && email !== ''){
      const validaemail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      return validaemail.test(email)? null: {emailInvalido: true};
    }
    return null;
  }

  /*VALIDAÇÃO ENTRE DOIS CAMPOS: compara o email e o confirmar email para ver se são iguais*/
  static equalsTo(otherField: string){
    const validator = (formControl: FormControl) => {
      if(otherField == null){
         throw new Error('É necessário informar um campo');
      }
      if(!formControl.root || !(<FormGroup>formControl.root).controls){
        return null;
      }
      const field = (<FormGroup>formControl.root).get(otherField);
      if(!field){
        throw new Error('É necessário informar um campo válido');
      }
      if(field.value !== formControl.value){
        return { equalsTo: otherField};
      }
      return null
    };
    return validator;
  }

  static getErrorMsg(fieldName: string, validatorName: string){
    const config: any = {
      'required': `Campo obrigatório.`,
      'cepInvalido': 'Cep Inválido.',
      'emailExistente': 'Esse email já existe.',
      'emailInvalido': 'Email inválido.',
      'equalsTo': 'Os emails não são iguais.'
    }
    return config[validatorName];
  }

}
