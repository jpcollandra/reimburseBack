import { itemReimbursement } from "../entities";
import { CosmosClient } from "@azure/cosmos";
import {v4} from 'uuid';


export interface ItemReimburseDao{

        //Create
        createItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>
    
        //Read
        getItemReimburseById(id: string): Promise<itemReimbursement>
        getAllItemReimburse(): Promise<itemReimbursement[]>
        getAllItemReimburseByStatus(status: string): Promise<itemReimbursement[]>
        getAllItemReimburseByUsername(username: string): Promise<itemReimbursement[]>
    
        //Update
        updateItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>
        approveItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement>

        //Delete
        deleteItemReimburseById(id: string ): Promise<itemReimbursement>
    
    }
    
    export class ItemReimburseDaoAzure implements ItemReimburseDao{
    
        private itemReimburse = new CosmosClient(process.env.CosmosDBAUTH);
        private database = this.itemReimburse.database('Bank')
        private container = this.database.container('itemReimburse')
        
    
    async createItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement> {
        itemReimburse.id = v4();
        const response = await this.container.items.create<itemReimbursement>(itemReimburse)
        const {  id,
            itemName,
            itemPrice,
            itemQuantity,
            itemDescription,
            status,
            username,
            comment} = response.resource;
        return {id, itemName, itemPrice, itemQuantity, itemDescription, status, username, comment}
        }

    async getItemReimburseById(id: string): Promise<itemReimbursement> {
        const querySpec = {
            query: `SELECT * FROM c WHERE c.id = '${id}'`
        };
        const { resources } = await this.container.items.query<itemReimbursement>(querySpec).fetchAll();
        return resources[0];
        }
        
    async getAllItemReimburse(): Promise<itemReimbursement[]> {
        const querySpec = {
            query: 'SELECT * FROM c'
        };
        const { resources } = await this.container.items.query<itemReimbursement>(querySpec).fetchAll();
        return resources;
        }

    async getAllItemReimburseByStatus(status: string): Promise<itemReimbursement[]> {
        const querySpec = {
            query: `SELECT * FROM c WHERE c.status = '${status}'`
        };
        const { resources } = await this.container.items.query<itemReimbursement>(querySpec).fetchAll();
        return resources;
    }

    async getAllItemReimburseByUsername(username: string): Promise<itemReimbursement[]> {
        const querySpec = {
            query: `SELECT * FROM c WHERE c.username = '${username}'`
        };
        const { resources } = await this.container.items.query<itemReimbursement>(querySpec).fetchAll();
        return resources;
    }
    
    async updateItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement> {
        const querySpec = {
            query: `SELECT * FROM c WHERE c.id = '${itemReimburse.id}'`
        };
        const { resources } = await this.container.items.query<itemReimbursement>(querySpec).fetchAll();
        if(!resources[0]){
            throw new Error("ItemReimburse not found")
        }
        const response = await this.container.item(itemReimburse.id,itemReimburse.id).replace(itemReimburse)
        const {  id,
            itemName,
            itemPrice,
            itemQuantity,
            itemDescription,
            status,
            username,
            comment} = response.resource;
        return {id, itemName, itemPrice, itemQuantity, itemDescription, status, username, comment}
        }
    
    async approveItemReimburse(itemReimburse: itemReimbursement): Promise<itemReimbursement> {
        //only update status
        const querySpec = {
            query: `SELECT * FROM c WHERE c.status = '${itemReimburse.status}'`
        };
        const { resources } = await this.container.items.query<itemReimbursement>(querySpec).fetchAll();
        if(!resources[0]){
            throw new Error("ItemReimburse not found")
        }
        const response = await this.container.item(itemReimburse.id,itemReimburse.id).replace(itemReimburse)
        const {  id,
            itemName,
            itemPrice,
            itemQuantity,
            itemDescription,
            status,
            username,
            comment} = response.resource;
        return {id, itemName, itemPrice, itemQuantity, itemDescription, status, username,comment}
    }

    async deleteItemReimburseById(dId: string): Promise<itemReimbursement> {
        const itemReimburse = await this.getItemReimburseById(dId);
        const response = await this.container.item(itemReimburse.id,itemReimburse.id).delete();
        return itemReimburse;
    }

    }
    
