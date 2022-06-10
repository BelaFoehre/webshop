import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest, NbDialogService, NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { InventoryModel } from 'src/app/models/inventory.model';
import { InventoryService } from 'src/app/services/inventory.service';
import { EditProductComponent } from '../edit-product/edit-product.component';

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
  Bestand: number;
  Tags?: string[];
  Bild: string;
  Beschreibung: string;
}

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrls: ['./manage-products.component.scss']
})
export class ManageProductsComponent implements OnInit, OnDestroy {
  allColumns = [ 'Bild', 'Name', 'Beschreibung', 'Marke', 'Hauptkategorie', 'Unterkategorie', 'Preis', 'Bestand', 'Tags', 'Bearbeiten', 'ID' ];
  data: TreeNode<FSEntry>[] = []

  dataSource!: NbTreeGridDataSource<FSEntry>

  sortColumn!: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  products: InventoryModel[] = []
  productsSub!: Subscription

  private dialogRef!: NbDialogRef<EditProductComponent>;

/**
 * We're injecting the InventoryService, NbTreeGridDataSourceBuilder, and NbDialogService into the
 * constructor
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
 * It loads all products from the database and pushes them into the data array
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
            Bestand: prod.availableQty,
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
 * It opens a dialog with the EditProductComponent, passing in the id of the product to be edited, and
 * whether or not the product is new
 * @param {string} id - The id of the product to be edited.
 * @param {boolean} isNew - boolean - This is a boolean value that determines whether the dialog is for
 * a new product or an existing product.
 */
 editProduct(id: string, isNew: boolean){
    this.dialogRef = this.dialogService.open(EditProductComponent, {
      context: { id, isNew }, hasBackdrop: true, closeOnBackdropClick: true
    })

    this.dialogRef.onClose.subscribe(() => {
      window.location.reload();
    })
  }
}
