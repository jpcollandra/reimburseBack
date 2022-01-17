import { ItemReimburseDaoAzure, ItemReimburseDao} from "../daos/itemReimburse-dao";
import { itemReimbursement } from "../entities";

const itemReimburseDao: ItemReimburseDao = new ItemReimburseDaoAzure();
let testID: string = "";

describe('ItemReimburse Spec Test', () => {

    it('should create item', async () => {
        const item: itemReimbursement = await itemReimburseDao.createItemReimburse({
            id: "",
            itemName: "test",
            itemPrice: 1,
            itemQuantity: 1,
            itemDescription: "test",
            status: "test",
            username: "test"
        });
        expect(item.itemName).toBe("test");
        testID = item.id
    
    })

    it('should get all items', async () => {
        const items: itemReimbursement[] = await itemReimburseDao.getAllItemReimburse();
        expect(items.length).toBeGreaterThanOrEqual(1);
    })

    it('should get item by id', async () => {
        const item: itemReimbursement = await itemReimburseDao.getItemReimburseById(testID);
        expect(item.id).toBeDefined
    })

    it('should get item by status', async () => {
        const items: itemReimbursement[] = await itemReimburseDao.getAllItemReimburseByStatus("test");
        expect(items.length).toBeGreaterThanOrEqual(1);
    })

    it('should get item by username', async () => {
        const items: itemReimbursement[] = await itemReimburseDao.getAllItemReimburseByUsername("test");
        expect(items.length).toBeDefined
    })

    it('should update item', async () => {
        const item: itemReimbursement = await itemReimburseDao.updateItemReimburse({
            id: testID,
            itemName: "test",
            itemPrice: 1,
            itemQuantity: 1,
            itemDescription: "test",
            status: "test",
            username: "test"
        });
        expect(item.itemName).toBe("test");
    })

    it('should delete item', async () => {
        const response = await itemReimburseDao.deleteItemReimburseById(testID);
        expect(response.id).toBeNull
    })


});