import { Component, OnInit } from '@angular/core';
import { NbTreeGridDataSource, NbSortDirection, NbTreeGridDataSourceBuilder, NbDialogService, NbSortRequest } from '@nebular/theme';
import { Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  ID: string
  Name: string;
  Nachname: string;
  Email: string;
  Rollen: string[];
  Gesperrt: string;
}

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  allColumns = [ 'Name', 'Nachname', 'Email', 'Rollen', 'Gesperrt', 'Bearbeiten', 'ID' ];
  data: TreeNode<FSEntry>[] = []
  dataSource!: NbTreeGridDataSource<FSEntry>
  sortColumn!: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  users: UserModel[] = []
  userSub!: Subscription

/**
 * The constructor function is used to inject the UserService and NbTreeGridDataSourceBuilder services
 * into the component
 * @param {UserService} userService - This is the service that we created in the previous step.
 * @param dataSourceBuilder - This is a service that is used to create a data source for the tree grid.
 * @param {NbDialogService} dialogService - This is the service that will be used to open the dialog.
 */
  constructor(private userService: UserService, private dataSourceBuilder: NbTreeGridDataSourceBuilder<FSEntry>, private dialogService: NbDialogService) { }

  /**
   * The ngOnInit() function is a lifecycle hook that is called after Angular has initialized all
   * data-bound properties of a directive
   */
  ngOnInit(): void {
    this.loadUsers()
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
   * It loads all users from the database and puts them into the table
   */
  private loadUsers(){
    this.userService.getAllUsers()
    this.userSub = this.userService.getUserUpdateListener()
      .subscribe((users: any) => {
        this.users = users[0]
        users[0].map((user: UserModel) => {
          let locked = 'Nein'
          if(user.locked) locked = 'Ja'
          this.data.push({data: {
              ID: user._id || '404',
              Name: user.name,
              Nachname: user.surname,
              Email: user.email,
              Rollen: user.roles,
              Gesperrt: locked,
            }})
          })
        this.reloadTable()
      })
  }

  /**
   * It creates a new data source from the data source builder, using the data that was passed in
   */
  private reloadTable(){
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  /**
   * The ngOnDestroy() function is called when the component is destroyed
   */
  ngOnDestroy(): void {
    this.userSub.unsubscribe()
  }

/**
 * It takes an id and a boolean value, and then it calls the lockUser function in the user service,
 * which takes an id and a boolean value, and then it reloads the page
 * @param {string} id - the id of the user you want to lock/unlock
 * @param {Boolean} lock - Boolean - This is the boolean value that will be passed to the backend to
 * lock or unlock the user.
 */
  lockUser(id: string, lock: Boolean){
    this.userService.lockUser(id, lock).subscribe(() => {
      window.location.reload()
    })
  }

/**
 * The deleteUser function takes an id as a parameter, and then calls the deleteUser function from the
 * user service, which takes an id as a parameter
 * @param {string} id - string - The id of the user you want to delete.
 */
  deleteUser(id: string){
    this.userService.deleteUser(id).subscribe(() => {
      window.location.reload()
    })
  }

}
