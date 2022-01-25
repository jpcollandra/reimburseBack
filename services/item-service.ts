import { itemReimbursement} from "../entities";

export interface ItemReimburseService{
    [x: string]: any;
    
    retrieveAllItemReimburse(): Promise<itemReimbursement[]>

    registerItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>

    retreiveItemReimburseById(id: string): Promise<itemReimbursement>

    updateItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>

}