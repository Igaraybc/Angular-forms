import { Component, Input, OnInit } from '@angular/core';
import { FormValidations } from '../services/form-validations';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.css']
})
export class ErrorMsgComponent implements OnInit {

  @Input() control: any;
  @Input() label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  get errorMessage(){
    for(const propertyName in this.control?.errors){
      if(this.control?.errors.hasOwnProperty(propertyName) && 
      this.control.dirty){
        return FormValidations.getErrorMsg(this.label, propertyName);
      }
    }
    return null;
  }

}
