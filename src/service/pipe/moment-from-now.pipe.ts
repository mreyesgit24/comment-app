    import { Pipe, PipeTransform } from '@angular/core';
    import moment from 'moment';

    @Pipe({
      name: 'momentFromNow'
    })
    export class MomentFromNowPipe implements PipeTransform {
      transform(value: moment.Moment | Date | string): string {
        if (!value) {
          return '';
        }
        return moment(value).fromNow();
      }
    }