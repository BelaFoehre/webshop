import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest, NbDialogService, NbDialogRef } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { InventoryService } from 'src/app/inventory.service';
import { OrderModel } from 'src/app/order.model';
import { OrderService } from 'src/app/order.service';
import { EditOrderStatusComponent } from '../edit-order-status/edit-order-status.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Summe?: Number;
  UserId: string;
  Status?: string;
  Produktanzahl: number;
  OrderId: string;
}

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
  allColumns = ['Produktanzahl', 'Summe', 'UserId', 'Status', 'OrderId'];
  data: TreeNode<FSEntry>[] = []

  dataSource!: NbTreeGridDataSource<FSEntry>

  sortColumn!: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  orders: OrderModel[] = []
  ordersSub!: Subscription

  private dialogRef!: NbDialogRef<EditOrderStatusComponent>

/**
 * The constructor function is used to inject the OrderService and NbTreeGridDataSourceBuilder services
 * into the component
 * @param {OrderService} orderService - This is the service that we created earlier.
 * @param dataSourceBuilder - NbTreeGridDataSourceBuilder<FSEntry>
 * @param {NbDialogService} dialogService - This is the service that will be used to open the dialog.
 */
  constructor(private orderService: OrderService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private dialogService: NbDialogService) {
  }

  /**
   * The ngOnInit() function is a lifecycle hook that is called after Angular has initialized all
   * data-bound properties of a directive
   */
  ngOnInit(){
    this.loadOrders()
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
   * The function loads all orders from the database and maps them onto the data for the table
   */
  private loadOrders(){
    this.orderService.getAllOrders()
    this.ordersSub = this.orderService.getOrderUpdateListener()
      .subscribe((orders: any) => {
        this.orders = orders[0]
        orders[0].map((order: OrderModel) => {
          this.data.push({data: {
            Produktanzahl: order.cartItems.length,
            Summe: order.subTotal,
            UserId: order.userId,
            Status: order.status || "unknown",
            OrderId: order._id || '404'
          }})
        })
        this.reloadTable()
      });
  }

/**
 * It creates a new data source from the data that was passed in
 */
  reloadTable(){
    this.dataSource = this.dataSourceBuilder.create(this.data)
  }

 /**
  * The ngOnDestroy() function is called when the component is destroyed
  */
  ngOnDestroy(): void {
      this.ordersSub.unsubscribe()
  }

/**
 * It opens a dialog box with the EditOrderStatusComponent component inside it, and passes the orderId
 * to the component
 * @param {string} orderId - string - this is the orderId that we are passing to the
 * EditOrderStatusComponent.
 */
  editOrderStatus(orderId: string){
    this.dialogRef = this.dialogService.open(EditOrderStatusComponent, {
      context: {
        orderId: orderId
      }, hasBackdrop: true, closeOnBackdropClick: true
    })

    this.dialogRef.onClose.subscribe(() => {
      window.location.reload();
    })
  }
}
