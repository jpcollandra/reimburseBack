import express from 'express';
import cors from 'cors'
import { LoginService, LoginServiceImpl } from './services/login-service';
import {EmployeeDaoAzure, EmployeeDAO} from './daos/login-dao';
import { ItemReimburseDaoAzure, ItemReimburseDao } from './daos/itemReimburse-dao';
import { Employee, itemReimbursement } from './entities';
import errorHandler, {ResourceNotFoundError} from './error-handles';
import { Item } from '@azure/cosmos';
import * as winston from 'winston';
import * as expressWinston from 'express-winston';


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

app.get('items/:id', async (req, res) => {
    const id: string = req.params.id;
    const item: itemReimbursement = await itemReimburseDao.getItemReimburseById(id);
    res.send(item); 
})

app.patch('/items'), async (req,res)=>{
    const body: itemReimbursement = req.body;
    const item: itemReimbursement = await itemReimburseDao.updateItemReimburse(body);
    res.send(item);
}

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
  ignoreRoute: function (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
}));

app.listen(3000,()=>console.log("Application Started"));
