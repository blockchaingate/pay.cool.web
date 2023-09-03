import { Pipe, PipeTransform } from '@angular/core';
/*
 * Format long string to avoid overflow
 * Usage:
 *   value | overflow
 * Example:
 *   {{ '003c5d20c41c1f2a881684ad50e004d8bf1ed4c8d9a279757b71c17fdff721b3' | overflow }}
 *   formats to: 0x3c5...1b3
*/
@Pipe({name: 'overflow'})
export class OverflowPipe implements PipeTransform {
  transform(value: string): string {
    if(!value) {
      return value;
    }
    let startLength = 3;
    const endLength = 3;

    if(value.indexOf('0x') === 0) {
        startLength = 5;
    }
    if(value.length <= startLength + endLength) {
        return value;
    }
    return value.substring(0, startLength) + '...' + value.substring(value.length - endLength);
  }
}