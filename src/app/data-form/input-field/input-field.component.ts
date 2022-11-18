import { Component, forwardRef, Input} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const INPUT_FIELD_VALUE_ACCESSOR: any ={
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputFieldComponent),
  multi: true
};

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
  providers: [INPUT_FIELD_VALUE_ACCESSOR]
})
export class InputFieldComponent implements ControlValueAccessor {
  /*Control Value Acessor é a interface que vai garantir transformar o campo em input*/

  @Input() classeCss: any;
  @Input() control: any;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() isReadOnly: boolean = false;

  /*Valor que será utilizado somente no escopo dessa classe*/
  private innerValue: any;

  get value(){
    return this.innerValue;
  }

  set value(v: any){
    if(v !== this.innerValue){
      this.innerValue = v;
      this.onChangeCb(v);
    }
  }

  constructor() { }

  onChangeCb: (_:any)=> void = () => {};
  onTouchedCb: (_:any)=> void = () => {};

  writeValue(obj: any): void {
    /*Responsável por setar o valor*/
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    /*Fala pro angular toda vez que o valor mudar*/
    this.onChangeCb = fn
  }
  registerOnTouched(fn: any): void {
    /*Fala pro angular toda vez que o campo ganhar foco*/
    this.onTouchedCb = fn;
  }

  setDisabledState(isDisabled: boolean): void{
    this.isReadOnly = isDisabled;
  }
  

}
