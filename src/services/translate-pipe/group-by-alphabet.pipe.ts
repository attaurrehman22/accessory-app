import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByAlphabet',
  standalone: true
})
export class GroupByAlphabetPipe implements PipeTransform {

  transform(brands: any[]): any {
    const grouped = brands.reduce((acc, brand) => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = [];
      }
      acc[firstLetter].push(brand);
      return acc;
    }, {});
    return Object.keys(grouped).sort().map(key => ({ key, value: grouped[key] }));
  }

}
