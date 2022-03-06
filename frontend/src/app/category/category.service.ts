import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from './category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private categoriesUpdated = new Subject<NbMenuItem[]>();

  constructor(private http: HttpClient){}

  getAllCategories(){
    this.http
      .get<{message: String, data: any}>('/api/kategories')
      .pipe(
        map((result) => {
        return result.data.map((category: Category) => {
          let level2 = category.sub1.map((input) => {
            return {
              title: input,
              /* Anzeige ist Buggy, deswegen pausiert TODO
              children: [
                {
                  title: "test1"
                }
              ]*/
            }
          })
          return {
            title: category.main,
            children: level2
          };
        });
      }))
      .subscribe((res: NbMenuItem) => {
        this.categoriesUpdated.next([res])
      })
  }

  getCategoryUpdateListener() {
    return this.categoriesUpdated.asObservable();
  }
}
