import express from 'express';
import cors from 'cors'
import { LoginService, LoginServiceImpl } from './services/login-service';
import {EmployeeDaoAzure, EmployeeDAO} from './daos/login-dao';
import { Employee } from './entities';
import errorHandler, {ResourceNotFoundError} from './error-handles';

const app = express();
app.use(express.json());
app.use(cors())

const employeeDao:EmployeeDAO = new EmployeeDaoAzure();
const loginService: LoginService = new LoginServiceImpl(employeeDao)


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


app.listen(3000,()=>console.log("Application Started"));
