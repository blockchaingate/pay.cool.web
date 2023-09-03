import { Pipe, PipeTransform } from '@angular/core';
import * as exaddr from '../../lib/exaddr';
import { UtilService } from 'src/app/services/util.service';
/*
 * Format long string to avoid tokb
 * Usage:
 *   value | tokb
 * Example:
 *   {{ '0xf929ef22498ee8523b904210f4082f6283c3fab3' | tokb }}
 *   formats to: 0x3c5...1b3
*/
@Pipe({name: 'tokb'})
export class TokbPipe implements PipeTransform {
  constructor(private utilServ: UtilService) {}
  transform(value: string): string {
    if(!value) {
      return value;
    }

    if(value.indexOf('0x') === 0) {
      value = this.utilServ.exgToFabAddress(value);
    }
    const kbaddr = exaddr.toKbpayAddress(value);
    return kbaddr;
  }
}