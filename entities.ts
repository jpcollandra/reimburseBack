export interface itemReimbursement {
    id:string
    itemName:string
    itemPrice:number
    itemQuantity:number
    itemDescription:string
    status:string
    username:string
}

export interface Employee {
    id:string
    username:string
    password:string
    firstName:string
    lastName:string
    isAuthorized:boolean
    isAdmin:boolean
}