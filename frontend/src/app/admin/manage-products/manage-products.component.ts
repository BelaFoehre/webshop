import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Bezeichnung: string;
  Marke: string;
  Hauptkategorie: string;
  Unterkategorie: string;
  Preis: number;
  Bestand: number;
  tags?: string[];
}

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  allColumns = [ 'Bezeichnung', 'Marke', 'Hauptkategorie', 'Unterkategorie', 'Preis', 'Bestand'];
  data: TreeNode<FSEntry>[] = []

  dataSource!: NbTreeGridDataSource<FSEntry>

  sortColumn!: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  productsSub!: Subscription

  /**
   * @param {InventoryService} inventoryService - This is the service that will be used to get the data from the server.
   * @param dataSourceBuilder - NbTreeGridDataSourceBuilder<FSEntry>
   */
  constructor(private inventoryService: InventoryService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {
    this.dataSource = this.dataSourceBuilder.create(this.data)
  }

  /**
   * The ngOnInit() function is a lifecycle hook that is called after Angular has initialized all
   * data-bound properties of a directive
   */
  ngOnInit(){
    this.loadProducts()
  }

  /**
   * The function takes a sort request object as a parameter, and then sets the sortColumn and
   * sortDirection properties to the values of the column and direction properties of the sort request
   * object
   * @param {NbSortRequest} sortRequest - NbSortRequest
   */
  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  /**
   * If the column is the same as the sortColumn, return the sortDirection, otherwise return
   * NbSortDirection.NONE
   * @param {string} column - The column name that we want to sort by.
   * @returns The sort direction of the column.
   */
  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

 /**
  * It returns the minimum width for multiple columns plus the next column step multiplied by the index
  * @param {number} index - The index of the column.
  * @returns the minimum width for multiple columns plus the next column step multiplied by the index.
  */
  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  /**
   * The function loads all products from the database and maps them onto the data for the table
   */
  private loadProducts(){
    this.inventoryService.getAllProducts()
    this.productsSub = this.inventoryService.getProductUpdateListener()
      .subscribe((products: any) => {
        products[0].map((prod: InventoryModel) => {
          // let test = formatCurrency(prod.price, 'EUR',)
          this.data.push({data: {
            Bezeichnung: prod.bezeichnung,
            Marke: prod.brand,
            Hauptkategorie: prod.category.main,
            Unterkategorie: prod.category.sub1,
            Preis: prod.price,
            Bestand: prod.availableQty
          }})
        })
        this.dataSource = this.dataSourceBuilder.create(this.data)
      });
  }

 /**
  * The ngOnDestroy() function is called when the component is destroyed
  */
  ngOnDestroy(): void {
      this.productsSub.unsubscribe()
  }

}
