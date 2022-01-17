import express from 'express';
import cors from 'cors'
import { LoginService, LoginServiceImpl } from './services/login-service';
import {EmployeeDaoAzure, EmployeeDAO} from './daos/login-dao';
import { ItemReimburseDaoAzure, ItemReimburseDao } from './daos/itemReimburse-dao';
import { Employee, itemReimbursement } from './entities';
import errorHandler, {ResourceNotFoundError} from './error-handles';
import { Item } from '@azure/cosmos';

const app = express();
app.use(express.json());
app.use(cors())

const employeeDao:EmployeeDAO = new EmployeeDaoAzure();
const loginService: LoginService = new LoginServiceImpl(employeeDao);
const itemReimburseDao: ItemReimburseDao = new ItemReimburseDaoAzure();


app.patch('/login', async (req,res)=>{
    try {
        const body:{username:string, password:string} = req.body;
        const employee:Employee = await loginService.loginWithUsernameAndPassword(body.username,body.password)
        res.send(employee)
        
    } catch (error) {
        res.send("Unable to login, check that your username password is correct")
    }

})

app.get('/employees', async (req, res) => {
    const employees: Employee[] = await employeeDao.getAllEmployee();
    res.send(employees);
})

app.get('/items', async(req,res)=>{
    const items: itemReimbursement[] = await itemReimburseDao.getAllItemReimburse();
    res.send(items);
})

app.get('items/:status', async(req,res)=>{
    const status:string = req.params.status;
    const items: itemReimbursement[] = await itemReimburseDao.getAllItemReimburseByStatus(status);
    res.send(items);
})

app.get('/items/:username', async (req, res) => {
    const username: string = req.params.username;
    const employee: Employee = await employeeDao.getEmployeeByUsername(username);
    if(!employee){
        res.send("Access Denied")
    }
    res.send(employee);
})

app.patch('/items'), async (req,res)=>{
    const body: itemReimbursement = req.body;
    const item: itemReimbursement = await itemReimburseDao.updateItemReimburse(body);
    res.send(item);
}

app.listen(3000,()=>console.log("Application Started"));
