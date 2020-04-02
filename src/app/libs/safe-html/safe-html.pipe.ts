import { Pipe, PipeTransform } from '@angular/core';
import { Util } from '../util';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  transform(value: string): string {
    return Util.safeHtml(value);
  }

}
