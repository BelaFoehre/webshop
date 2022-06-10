import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUpdated = new Subject<UserModel[]>();

/**
 * The constructor function is a default function that runs when the component is loaded. The private
 * http: HttpClient variable creates an instance of the HttpClient service and stores it in a private
 * variable called http
 * @param {HttpClient} http - HttpClient - This is the service that we're injecting into our service.
 */
  constructor(private http: HttpClient) { }

/**
 * We're using the http service to make a get request to the /api/users endpoint. We're then
 * subscribing to the observable that's returned from the get request. We're then passing the data
 * that's returned from the get request to the usersUpdated subject
 */
  getAllUsers() {
    this.http
      .get<UserModel>('/api/users')
      .subscribe((usersData: UserModel) => {
        this.usersUpdated.next([usersData]);
      })
  }

/**
 * It returns an observable that emits a value every time the usersUpdated subject emits a value
 * @returns Observable
 */
  getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }

/**
 * It takes an id, a lock boolean, and an optional reason string, and returns an observable of the
 * response
 * @param {string} id - The id of the user you want to lock
 * @param {Boolean} lock - Boolean - Whether to lock or unlock the user
 * @param {string} [reason] - The reason for locking the user.
 * @returns The user's id, username, email, and role.
 */
  lockUser(id: string, lock: Boolean, reason?: string) {
    return this.http.put<UserModel>(`/api/users/${id}/lock`, { lock, reason }, {observe:'response'})
  }

/**
 * This function takes an id as a parameter, and returns an observable of type any.
 * @param {string} id - the id of the user you want to delete
 * @returns The deleteUser method is returning an observable of type any.
 */
  deleteUser(id: string){
    return this.http.delete(`/api/users/${id}`)
  }

 /**
  * This function takes in an id as a string, and returns a user object from the database
  * @param {string} id - The id of the user you want to get.
  * @returns The user with the id of the parameter
  */
  getUser(id: string){
    return this.http.get<UserModel>(`/api/users/${id}`)
  }

/**
 * It takes an id, name, surname and email as arguments, creates an object with the data, and then
 * sends a PUT request to the server with the data and the id
 * @param {string} id - the id of the user you want to update
 * @param {string} name - string, surname: string , email: string
 * @param {string} surname - string - the surname of the user
 * @param {string} email - string - the email of the user
 * @returns The response from the server.
 */
  updateUser(id: string, name: string, surname: string , email: string){
    let data = { name, surname, email }
    return this.http.put<UserModel>(`/api/users/${id}`, data, {observe:'response'})
  }
}
