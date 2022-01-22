import { ItemReimburseDao } from "../daos/itemReimburse-dao";
import { EmployeeDAO } from "../daos/login-dao";
import { itemReimbursement, Employee } from "../entities";
import { ItemReimburseService } from "./item-service";

export class ItemReimburseImpl implements ItemReimburseService{

    private itemReimburseDao: ItemReimburseDao;
    private employeeDao: EmployeeDAO;

    constructor(itemReimburseDao: ItemReimburseDao, employeeDao: EmployeeDAO){
        this.itemReimburseDao = itemReimburseDao;
        this.employeeDao = employeeDao;
    }

    retrieveAllItemReimburse(): Promise<itemReimbursement[]>{
        return this.itemReimburseDao.getAllItemReimburse();
    }

    registerItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>{
        return this.itemReimburseDao.createItemReimburse(itemReimburse);
    }

    retreiveItemReimburseById(id: string): Promise<itemReimbursement>{
        return this.itemReimburseDao.getItemReimburseById(id);
    }

    updateItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>{
        return this.itemReimburseDao.updateItemReimburse(itemReimburse);
    }

}
