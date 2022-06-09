export interface UserModel {
  _id?: string
  name: string
  surname: string
  email: string
  roles: string[]
  locked: boolean
  locked_message?: string
}
