import express from 'express'
import EmployeeController from './employee.controller.js'

const router = express.Router() // get access to express router
router.route('/').get(EmployeeController.apiGetEmployee) //get all employees
router.route("/id/:id").get(EmployeeController.apiGetEmployeeById) //get employees by ID
router.route("/Department").get(EmployeeController.apiGetDepartment)//get employees by Department

router
    .route("/employeeApi")
    .post(EmployeeController.apiPostEmployee)
    .put(EmployeeController.apiUpdateEmployee)
    .delete(EmployeeController.apiDeleteEmployee)


export default router