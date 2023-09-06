import { Pipe, PipeTransform } from '@angular/core';
import BigNumber from 'bignumber.js';
/*
 * Format long string to avoid amount
 * Usage:
 *   value | amount
 * Example:
 *   {{ '1234500000000000000' | amount : 18 }}
 *   formats to: 1.2345
*/
@Pipe({name: 'amount'})
export class AmountPipe implements PipeTransform {
  transform(value: any, decimals = 18): number {
    if(!value) {
      return value;
    }
    
    return new BigNumber(value).shiftedBy(-decimals).toNumber();
  }
}