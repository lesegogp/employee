import EmployeeDAO from '../dao/employeeDAO.js' //We  import the DAO file.

export default class EmployeeController {       //create and expport movieController class

  static async apiGetEmployee(req, res, next) {
    const employeePerPage = req.query.employeePerPage  //create a const to show 5 employees per page 
      ? parseInt(req.query.employeePerPage)
      : 30
    const page = req.query.page ? parseInt(req.query.page) : 0 //

    let filters = {}   //create if statement to check if the query is rated
    if (req.query.department) {    //filter query by department
      filters.department = req.query.department
    } else if (req.query.name) {  //else filter query by name
      filters.name = req.query.name
    }

    const { employeeList, totalNumEmployee } = await EmployeeDAO.getEmployee({  //get a total number of employees
      filters,
      page,
      employeePerPage,
    })


    let response = {   // get a list of employees , page number, entries
      employee: employeeList,
      page: page,
      filters: filters,
      entries_per_page: employeePerPage,
      total_results: totalNumEmployee,
    }
    res.json(response)
  }


  static async apiGetEmployeeById(req, res, next) {  // async it doesnt happen at the same time
    try {
      let id = req.params.id || {}
      let employee = await EmployeeDAO.getEmployeeById(id) //pull employees by id

      if (!employee) {
        res.status(404).json({ error: 'not found' }) //output an error if employee id doesnt exist
        return
      }
      res.json(employee)
    } catch (e) {
      console.log(`api, ${e}`)
      res.status(500).json({ error: e })
    }
  }

  static async apiGetDepartment(req, res, next) { //get employee departments
    try {
      let propertyTypes = await EmployeeDAO.getDepartment() //by using try and catch, if it doesnt exist it will catch an error
      res.json(propertyTypes)
    } catch (e) {
      console.log(`api,${e}`)
      res.status(500).json({ error: e })
    }
  }

  //ADD EMPLOYEE
  static async apiPostEmployee(req, res, next) {
    try {
      const name = req.body.name
      const surname = req.body.surname
      const email = req.body.email
      const contact_number = req.body.contact_number
      const id_number = req.body.id_number
      const address = req.body.address
      const role = req.body.role
      const department = req.body.department

      const EmployeeResponse = await EmployeeDAO.addEmployee(
        name,
        surname,
        email,
        contact_number,
        id_number,
        address,
        role,
        department
      )
      res.json({ status: "success " })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  //EDIT EMPLOYEE
  static async apiUpdateEmployee(req, res, next) {
    try {
      const employee_id = req.body.employee_id
      const name = req.body.name
      const surname = req.body.surname
      const email = req.body.email
      const contact_number = req.body.contact_number
      const id_number = req.body.id_number
      const address = req.body.address
      const role = req.body.role
      const department = req.body.department
      
      const EmployeeResponse = await EmployeeDAO.UpdateEmployee(
        employee_id,
        name,
        surname,
        email,
        contact_number,
        id_number,
        address,
        role,
        department
      )
      var { error } = EmployeeResponse
      if (error) {
        res.status.json({ error })
      }
      if (EmployeeResponse.modifiedCount === 0) {
        throw new Error("unable to update Employee")
      }
      res.json({ status: "success " })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  }

  //DELETE EMPLOYEE
  static async apiDeleteEmployee(req, res, next) {
    try {
      const employee_id = req.body.employee_id
      const EmployeeResponse = await EmployeeDAO.deleteEmployee(
        employee_id,
      )

      res.json({ status: "success " })
    } catch (e) {
      res.status(500).json({ error: e.message })
    }
  } 
}