export interface User {
  _id: string,
  type: string,
  userId: string,
  password: string,
  email: string,
  phone: number,
  firstName: string,
  lastName: string,
  address: string,
  city: string,
  company: string,
  isActive : any
}


export interface AuthState {
  adminUser: User | null
  adminToken: string | null
}