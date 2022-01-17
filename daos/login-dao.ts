import { Employee } from "../entities";
import { CosmosClient } from "@azure/cosmos";
import {v4} from 'uuid';

export interface EmployeeDAO{

    //Create
    createEmployee(employee: Employee): Promise<Employee>

    //Read
    getEmployeeById(id: string): Promise<Employee>
    getAllEmployee(): Promise<Employee[]>
    getEmployeeByUsername(username: string): Promise<Employee>

    //Update
    updateEmployee(employee: Employee): Promise<Employee>

    //Delete
    deleteEmployeeById(id: string ): Promise<Employee>

}

export class EmployeeDaoAzure implements EmployeeDAO{

    private employee = new CosmosClient(process.env.CosmosDBAUTH);
    private database = this.employee.database('Bank')
    private container = this.database.container('employees')
    

    async createEmployee(employee: Employee): Promise<Employee> {
        employee.id = v4();
        const response = await this.container.items.create<Employee>(employee)
        const {  id,
            username,
            password,
            firstName,
            lastName,
            isAuthorized,
            isAdmin} = response.resource;

        return {id, username, password,firstName,lastName,isAuthorized,isAdmin}
    }


   async getEmployeeById(id: string): Promise<Employee> {
        const response = await this.container.item(id,id).read<Employee>();
        if(!response.resource){
            throw new Error("No employee found")
        }
        return {id: response.resource.id, username: response.resource.username, password: response.resource.password, firstName: response.resource.firstName, lastName: response.resource.lastName, isAuthorized: response.resource.isAuthorized, isAdmin: response.resource.isAdmin}
    }

    async getAllEmployee(): Promise<Employee[]> {
        const querySpec = {
            query: 'SELECT * FROM c'
        };
        const { resources } = await this.container.items.query<Employee>(querySpec).fetchAll();
        return resources;
    }
    
    async getEmployeeByUsername(username: string): Promise<Employee> {
        const querySpec = {
            query: `SELECT * FROM c WHERE c.username = '${username}'`
        };
        const { resources } = await this.container.items.query<Employee>(querySpec).fetchAll();
        return resources[0];
    }

    async updateEmployee(employee: Employee): Promise<Employee> {
        const response = await this.container.item(employee.id,employee.id).replace(employee);
        return response.resource;
    }

    async deleteEmployeeById(id: string): Promise<Employee> {
        const employee = await this.getEmployeeById(id);
        const response = await this.container.item(id,id).delete();
        return employee;
    }
  
}

