import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { InventoryService } from './inventory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  categorySub!: Subscription;
  items: NbMenuItem[] = []

  constructor(private inventoryService: InventoryService){}
  ngOnDestroy(): void {
    this.categorySub.unsubscribe()
  }
  title = 'Fresh';

  async ngOnInit(){
    // this.categorySub = this.categoryService.getCategoryUpdateListener().subscribe()
    this.loadCategories()
  }

  private loadCategories(){
    // this.isLoading = true;
    this.inventoryService.getAllCategories()
    this.categorySub = this.inventoryService.getCategoryUpdateListener()
      .subscribe((categories: any) => {
        this.items = categories[0]
        // this.isLoading = false;
      });
  }
}
