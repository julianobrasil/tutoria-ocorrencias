import {NativeDateAdapter} from '@angular/material';

// retirar quando for reito o merge da data por mmalerba
const SUPPORTS_INTL_API = typeof Intl !== 'undefined';

export class CustomDateAdapter extends NativeDateAdapter {
  useUtcForDisplay = true;

  parse(value: any): Date | null {
    if (typeof value === 'string' && value.indexOf('/') > -1) {
      const str = value.split('/');

      if (str.length > 3) {
        return null;
      }

      try {
        const year = Number(str[2]);
        const month = Number(str[1]) - 1;
        const date = Number(str[0]);

        return new Date(year, month, date);
      } catch (error) {
        return null;
      }
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}
