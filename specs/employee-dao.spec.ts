import { EmployeeDAO, EmployeeDaoAzure } from "../daos/login-dao";
import { Employee } from "../entities";

let testID :string ="";

const employeeDao: EmployeeDAO = new EmployeeDaoAzure();

describe('Employee DAO Specs', () => {

    it('should create employee', async () => {
        const employee: Employee = await employeeDao.createEmployee({
            id: "",
            username: "test",
            password: "test",
            firstName: "test",
            lastName: "test",
            isAuthorized: false,
            isAdmin: false

        });
        expect(employee.username).toBe("test");
        testID = employee.id;
    })


    it('should get all employees', async () => {
        const employees: Employee[] = await employeeDao.getAllEmployee();
        expect(employees.length).toBeGreaterThanOrEqual(1);
    })


    it('should get employee by id', async () => {
        const employee: Employee = await employeeDao.getEmployeeById(testID);
        expect(employee.id).toBe(testID);

    })


    it('should get employee by username', async () => {
        const employee: Employee = await employeeDao.getEmployeeByUsername("test");
        expect(employee.username).toBe("test");
    })

    it('should update employee', async () => {
        const employee: Employee = await employeeDao.updateEmployee({
            id: testID,
            username: "test",
            password: "test",
            firstName: "test",
            lastName: "test",
            isAuthorized: false,
            isAdmin: false
        });
        expect(employee.username).toBe("test");
    })
    
      it('should delete employee', async () => {
        const response = await employeeDao.deleteEmployeeById(testID);
        expect(response.id).toBeNull
    })
 
})

