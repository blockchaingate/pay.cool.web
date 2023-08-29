import { Component, OnInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";


@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => OwnersComponent),
    multi: true
  }] 
})
export class OwnersComponent implements ControlValueAccessor, OnInit{
  owners: any;

  constructor() { }

  ngOnInit(): void {
  }

  onChange: (_: any) => void = (_: any) => {};
 
  /**
   * Invoked when the model has been touched
   */
  onTouched: () => void = () => {};

    //get accessor
    get value(): any {
        return this.owners;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.owners) {
            this.owners = v;
            this.onChange(v);
        }
    }


    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.owners) {
            this.owners = value;
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
      this.onChange = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
      this.onTouched = fn;
    }

  addOwner() {
    this.owners.push(
      {
        name: '',
        address: ''
      }
    );
  }

  delete(index: number) {
    if(index >= 2) {
      this.owners.splice(index, 1);
    }
    
  }
}
