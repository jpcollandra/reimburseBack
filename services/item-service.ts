import { itemReimbursement} from "../entities";

export interface ItemReimburseService{
    
    retrieveAllItemReimburse(): Promise<itemReimbursement[]>

    registerItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>

    retreiveItemReimburseById(id: string): Promise<itemReimbursement>

    updateItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>

}