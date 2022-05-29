import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { InventoryService } from 'src/app/inventory.service';
import { OrderModel } from 'src/app/order.model';
import { OrderService } from 'src/app/order.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  cartId: string;
  userId: string;
  status?: string;
}

@Component({
  selector: 'app-manage-orders',
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.scss']
})
export class ManageOrdersComponent implements OnInit, OnDestroy {
  allColumns = [ 'cartId', 'userId', 'status'];
  data: TreeNode<FSEntry>[] = []

  dataSource!: NbTreeGridDataSource<FSEntry>

  sortColumn!: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  orders: OrderModel[] = []
  ordersSub!: Subscription

  /**
   * @param {OrderService} orderService - This is the service that will be used to get the data from the server.
   * @param dataSourceBuilder - NbTreeGridDataSourceBuilder<FSEntry>
   */
  constructor(private orderService: OrderService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {
  }

  /**
   * The ngOnInit() function is a lifecycle hook that is called after Angular has initialized all
   * data-bound properties of a directive
   */
  ngOnInit(){
    this.loadOrders()
    this.reloadTable()
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
            cartId: order.cartId,
            userId: order.userId,
            status: order.status || "unknown"
          }})
        })
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

}
