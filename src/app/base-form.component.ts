import { Component } from '@angular/core';
import {FormGroup,AbstractControl } from '@angular/forms'
@Component({
  selector: 'app-base-form',
  template: ``,
  styles: []
})
export class BaseFormComponent {
  form!: FormGroup;
  constructor() { }

 
  getErrors(control: AbstractControl,
    displayName: string,
    customMessages: {[key:string]:string} | null=null): string[] {
    var errors: string[] = [];
    Object.keys(control.errors || {}).forEach(key => {
      switch (key) {
        case 'required':
          errors.push(`${displayName} ${customMessages?.[key]?? "is required."}`);
          break;
        case 'pattern':
          errors.push(`${displayName} ${customMessages?.[key] ?? "contains contains invalid characters."} `);
          break;
        case 'isDupeField':
          errors.push(`${displayName} ${customMessages?.[key] ?? "already exists: please choose another."}`);
          break;
        default:
          errors.push(`${displayName} is invalid.`);
          break;
      }
    })
      return errors;
  }
}
