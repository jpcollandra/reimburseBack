import { EmployeeDAO, EmployeeDaoAzure } from "../daos/login-dao";
import { Employee } from "../entities";
import { LoginService, LoginServiceImpl } from "../services/login-service";
import { CosmosClient } from "@azure/cosmos";
import { v4 } from "uuid";

const employeeDao: EmployeeDAO = new EmployeeDaoAzure;

const employeeDaoStub: EmployeeDAO = {
    async getEmployeeByUsername(username: string): Promise<Employee> {
        return { id: "1", username: "test", password: "test", firstName: "firstName", lastName: "lastName", isAuthorized: true, isAdmin: true };
    },
    createEmployee: function (employee: Employee): Promise<Employee> {
        throw new Error("Function not implemented.");
    },
    getEmployeeById: function (id: string): Promise<Employee> {
        throw new Error("Function not implemented.");
    },
    getAllEmployee: function (): Promise<Employee[]> {
        throw new Error("Function not implemented.");
    },
    updateEmployee: function (employee: Employee): Promise<Employee> {
        throw new Error("Function not implemented.");
    },
    deleteEmployeeById: function (id: string): Promise<Employee> {
        throw new Error("Function not implemented.");
    }
}

const loginService:LoginService = new LoginServiceImpl(employeeDaoStub);

describe("Login Service Tests", () => {

    it(" Should throw an errror if username and password does not match", async () => {
        const loginService: LoginService = new LoginServiceImpl(employeeDao);
        try {
            await loginService.loginWithUsernameAndPassword("test", "test2");
        fail()
        } catch (err) {
            expect(err.message).toBe("Password does not match");
        }
    })

}) 