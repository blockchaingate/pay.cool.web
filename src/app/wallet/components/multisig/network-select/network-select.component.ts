import { Component, OnInit, Input, Output, forwardRef, EventEmitter } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-network-select',
  templateUrl: './network-select.component.html',
  styleUrls: ['./network-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NetworkSelectComponent),
    multi: true
  }] 
})
export class NetworkSelectComponent implements ControlValueAccessor, OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Holds the current value of the slider
   */
  value: any;
  /**
   * Invoked when the model has been changed
   */
  onChange: (_: any) => void = (_: any) => { };

  /**
   * Invoked when the model has been touched
   */
  onTouched: () => void = () => { };

  /**
   * Method that is invoked on an update of a model.
   */
  updateChanges() {
    this.onChange(this.value);
  }


  ///////////////
  // OVERRIDES //
  ///////////////

  /**
   * Writes a new item to the element.
   * @param value the value
   */
  writeValue(value: any): void {
    this.value = value;
    this.updateChanges();
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   * @param fn
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }


  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  changeChain(chain: string) {
    this.writeValue(chain);
  }

  showName(chain: string) {
    let name = '';
    switch(chain) {
      case 'KANBAN':
        name = 'KANBAN chain';
        break;
      case 'FAB':
        name = 'FAB chain';
        break;
      case 'ETH': 
        name = 'Ethereum chain';
        break;   
      case 'BNB': 
        name = 'BSC chain';
        break;               
    }
    return name;
  }
}
