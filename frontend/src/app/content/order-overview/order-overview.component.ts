import { Component, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbSortRequest } from '@nebular/theme';
import { OrderModel } from 'src/app/order.model';
import { OrderService } from 'src/app/order.service';
import { CartService } from 'src/app/purchase/cart/cart.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  Summe?: Number;
  Status?: string;
}

@Component({
  selector: 'app-order-overview',
  templateUrl: './order-overview.component.html',
  styleUrls: ['./order-overview.component.scss']
})
export class OrderOverviewComponent implements OnInit {
  allColumns = ['Summe', 'Status'];
  data: TreeNode<FSEntry>[] = []

  dataSource!: NbTreeGridDataSource<FSEntry>

  sortColumn!: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  orders: OrderModel[] = []

/**
 * The constructor function is a special function that is called when an object is created from a class
 * @param {OrderService} orderService - This is the service that will be used to get the order data
 * from the server.
 * @param {CartService} cartService - This is the service that we created in the previous step.
 * @param dataSourceBuilder - NbTreeGridDataSourceBuilder<FSEntry>
 */
  constructor(private orderService: OrderService, private cartService: CartService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>) {
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

  private loadOrders(){
    this.orderService.getOwnOrders()
      .subscribe((orders: any) => {
        orders.map((order: OrderModel) => {
          this.data.push({
            data: {
              Summe: order.subTotal,
              Status: order.status
            }
          })
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

}
