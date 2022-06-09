import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest, NbDialogService, NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';
import { DetailViewComponent } from '../detail-view/detail-view.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  ID: string
  Name: string;
  Marke: string;
  Hauptkategorie: string;
  Unterkategorie: string;
  Preis: number;
  Verfügbar: number;
  Tags?: string[];
  Bild: string;
  Beschreibung: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {
  allColumns = [ 'Bild', 'Name', 'Beschreibung', 'Marke', 'Hauptkategorie', 'Unterkategorie', 'Preis', 'Verfügbar', 'Tags', 'Aktion', 'ID' ];
  data: TreeNode<FSEntry>[] = []

  dataSource!: NbTreeGridDataSource<FSEntry>

  sortColumn!: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  products: InventoryModel[] = []
  productsSub!: Subscription

  private dialogRef!: NbDialogRef<DetailViewComponent>;


  /**
   * The constructor function is used to inject the InventoryService and NbTreeGridDataSourceBuilder
   * services into the component.
   * @param {InventoryService} inventoryService - This is the service that we created earlier.
   * @param dataSourceBuilder - NbTreeGridDataSourceBuilder<FSEntry>
   * @param {NbDialogService} dialogService - This is the service that will be used to open the dialog.
   */
  constructor(private inventoryService: InventoryService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private dialogService: NbDialogService) { }

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
        this.products = products[0]
        products[0].map((prod: InventoryModel) => {
          this.data.push({data: {
            ID: prod._id || 'null',
            Name: prod.name,
            Marke: prod.brand,
            Hauptkategorie: prod.category.main,
            Unterkategorie: prod.category.sub1,
            Preis: prod.price,
            Verfügbar: prod.availableQty,
            Tags: prod.tags,
            Bild: prod.imgBase64,
            Beschreibung: prod.description
          }})
        })
        this.reloadTable()
      });
  }

/**
 * It creates a new data source from the data that was passed in
 */
  private reloadTable(){
    this.dataSource = this.dataSourceBuilder.create(this.data)
  }

 /**
  * The ngOnDestroy() function is called when the component is destroyed
  */
  ngOnDestroy(): void {
      this.productsSub.unsubscribe()
  }

/**
 * The function takes a productId as a parameter, finds the product with that id in the products
 * array, and then opens a dialog with the DetailViewComponent, passing the product as a context
 * @param {string} productId - string - The product id of the product that was clicked on.
 */
  openDetails(productId: string){
    let product = this.products.find(product => product._id === productId)
    this.dialogRef = this.dialogService.open(DetailViewComponent, {
      context: {
        product: product
      }, hasBackdrop: true, closeOnBackdropClick: true
    })
  }

/**
 * The addToCart function takes a productId as an argument and calls the addToCart function in the
 * inventoryService
 * @param {string} productId - The id of the product to be added to the cart.
 */
  addToCart(productId: string){
    this.inventoryService.addToCart(productId, 1)
  }
}
