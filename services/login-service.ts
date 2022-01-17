import { EmployeeDAO } from '../daos/login-dao';
import { Employee } from "../entities";

export interface LoginService {

    loginWithUsernameAndPassword(username:string, password:string): Promise<Employee>
}

export class LoginServiceImpl implements LoginService{
    
        private employeeDao:EmployeeDAO
    
        constructor(employeeDao: EmployeeDAO){
            this.employeeDao = employeeDao;
        }
    
        async loginWithUsernameAndPassword(username:string, password:string){
            const employee: Employee = await this.employeeDao.getEmployeeByUsername(username);
            
            if(employee.password !== password){
                throw new Error("Password does not match")
            }else{
                return employee
            }
        }
    
}