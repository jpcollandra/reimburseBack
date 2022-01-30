import express from 'express';
import cors from 'cors'
import { LoginService, LoginServiceImpl } from './services/login-service';
import {EmployeeDaoAzure, EmployeeDAO} from './daos/login-dao';
import { ItemReimburseDaoAzure, ItemReimburseDao } from './daos/itemReimburse-dao';
import { Employee, itemReimbursement } from './entities';
import { ItemReimburseService } from './services/item-service';
import { ItemReimburseImpl } from './services/item-service-impl';
import errorHandler, {ResourceNotFoundError} from './error-handles';
import { Item } from '@azure/cosmos';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import { request } from 'http';
import logMiddleware from './middleware/logger';


const app = express();
app.use(express.json());
app.use(cors())
app.use(logMiddleware)

const employeeDao:EmployeeDAO = new EmployeeDaoAzure();
const loginService: LoginService = new LoginServiceImpl(employeeDao);
const itemReimburseDao: ItemReimburseDao = new ItemReimburseDaoAzure();
const itemReimburseService: ItemReimburseService = new ItemReimburseImpl( itemReimburseDao, employeeDao);

app.get('/', async (req, res) => {
    res.send('Hello!');
})

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

app.post('/employees', async (req, res) => {
    const employee: Employee = await employeeDao.createEmployee(req.body);
    res.send(employee);
})

app.get('/items', async(req,res)=>{
    const items: itemReimbursement[] = await itemReimburseDao.getAllItemReimburse();
    res.send(items);
})

app.post('/items', async (req,res)=>{
    try {
        const body: itemReimbursement = req.body;
        const item: itemReimbursement = await itemReimburseService.registerItemReimburse(body);
        res.send(item);
    } catch (error) {
        res.send(error);
    }
})

app.get('/items/status/:status', async(req,res)=>{
    try{
        const status:string = req.params.status;
        const items: itemReimbursement[] = await itemReimburseDao.getAllItemReimburseByStatus(status);
        res.send(items);
    }
    catch(error){
        res.send("Unable to get items by status")
    }
})

app.get('/items/username/:username', async (req, res) => {
    const username: string = req.params.username;
    const items: itemReimbursement[] = await itemReimburseDao.getAllItemReimburseByUsername(username);
    res.send(items);
})

app.get('/items/:id', async (req, res) => {
    const id: string = req.params.id;
    const item: itemReimbursement = await itemReimburseDao.getItemReimburseById(id);
    res.send(item); 
})

app.patch('/items/:id/approve', async (req,res)=>{
    try {
        const id: string = req.params.id;
        const item: itemReimbursement = await itemReimburseService.approveItemReimburse(id);
        res.send(item);
    } catch (error) {
        res.send(error);
    }
 }
) 

app.patch('/items/:id/deny', async (req,res)=>{
    try {
        const id: string = req.params.id;
        const item: itemReimbursement = await itemReimburseService.denyItemReimburse(id);
        res.send(item);
    } catch (error) {
        res.send(error);
    }
 }
) 

app.delete('/employees/:id', async (req, res) => {
    const id: string = req.params.id;
    const employee: Employee = await employeeDao.deleteEmployeeById(id);
    res.send(employee);
})


app.listen(3000,()=>console.log("Application Started"));
