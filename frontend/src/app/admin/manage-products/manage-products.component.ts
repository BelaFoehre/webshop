import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest, NbDialogService, NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { InventoryModel } from 'src/app/inventory.model';
import { InventoryService } from 'src/app/inventory.service';
import { EditProductComponent } from '../edit-product/edit-product.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  ID: string
  Bezeichnung: string;
  Marke: string;
  Hauptkategorie: string;
  Unterkategorie: string;
  Preis: number;
  Bestand: number;
  Tags?: string[];
  Img: any
}

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  allColumns = [ 'Bezeichnung', 'Marke', 'Hauptkategorie', 'Unterkategorie', 'Preis', 'Bestand', 'Tags', 'Bearbeiten', 'ID' ];
  data: TreeNode<FSEntry>[] = []

  dataSource!: NbTreeGridDataSource<FSEntry>

  sortColumn!: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  products: InventoryModel[] = []
  productsSub!: Subscription

  private dialogRef!: NbDialogRef<EditProductComponent>;

  /**
   * @param {InventoryService} inventoryService - This is the service that will be used to get the data from the server.
   * @param dataSourceBuilder - NbTreeGridDataSourceBuilder<FSEntry>
   */
  constructor(private inventoryService: InventoryService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private dialogService: NbDialogService) {
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
        this.products = products[0]
        products[0].map((prod: InventoryModel) => {
          this.data.push({data: {
            ID: prod._id || 'null',
            Bezeichnung: prod.name,
            Marke: prod.brand,
            Hauptkategorie: prod.category.main,
            Unterkategorie: prod.category.sub1,
            Preis: prod.price,
            Bestand: prod.availableQty,
            Tags: prod.tags,
            Img: prod.imgBase64
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
   * This function is called when the user clicks the edit button on a product. It takes the product id
   * as a parameter and calls the openEditProductDialog function, passing the product id as a parameter
   * @param {string} selectedProductId - string - this is the id of the product that was selected by
   * the user.
   */
  editProduct(selectedProductId: string){
    this.openEditProductDialog(selectedProductId)
  }

  /**
   * This function opens the EditProductComponent in a dialog box, and when the dialog box is closed,
   * it reloads the page
   * @param {string} id - string - The id of the product to be edited.
   */
  openEditProductDialog(id: string){
    this.dialogRef = this.dialogService.open(EditProductComponent, {
      context: {
        id: id
      }, hasBackdrop: true, closeOnBackdropClick: true
    })

    this.dialogRef.onClose.subscribe(() => {
      window.location.reload();
    })
  }
}
