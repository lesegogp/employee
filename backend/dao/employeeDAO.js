import mongodb from 'mongodb' //import mangodb 

const ObjectId = mongodb.ObjectId //assign objectid to mongodb


let employee

export default class EmployeeDAO {  //create employeesdao class
  static async injectDB(conn) { //connect to database
    if (employee) {
      return
    }

    try {

      employee = await conn.db(process.env.EMPLOYEE_NS).collection('employee') //display employees after conn to database
    }

    catch (e) {
      console.error(`unable to connect in EmployeeDAO: ${e}`) //display error if cant connect to db
    }
  }

  static async getEmployee({
    // default filter
    filters = null,
    page = 0,
    employeePerPage = 30, // will only get 30 employees at once
  } = {}) {
    let query
    if (filters) {
      if ('name' in filters) {
        query = { $text: { $search: filters['name'] } } //filter by name
      } else if ('department' in filters) {
        query = { "department": { $eq: filters['department'] } } //filter by department
      }
    }
    let cursor
    try {
      cursor = await employee
        .find(query) //display query
        .limit(employeePerPage) //specify max number of employees per page to be returned
        .skip(employeePerPage * page) //skip specific pages
      const employeeList = await cursor.toArray()
      const totalNumEmployee = await employee.countDocuments(query)
      return { employeeList, totalNumEmployee }
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`) //catch an error
      return { employeeList: [], totalNumEmployee: 0 } //return employeelist
    }
  }

  static async getDepartment() { //display department
    let department = []
    try {
      department = await employee.distinct('department') //return employee departments
      return department
    } catch (e) {
      console.error(`unable to get Department, ${e}`) //return error
      return department
    }
  }

  static async getEmployeeById(id) { //search employee by id 
    try {
      return await employee
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id), //check if id entered matches with id in employees
            },
          },
        ])
        .next()
    } catch (e) {
      console.error(`something went wrong in getEmployeeById: ${e}`)  //throw error
      throw e
    }
  }
  static async addEmployee(name, surname, email, contact_number, id_number, address, role, department) {
    try {
      const employeeDoc = {
        name: name,
        surname: surname,
        email: email,
        contact_number: contact_number,
        id_number: id_number,
        address: address,
        role: role,
        department: department
      }
      return await employee.insertOne(employeeDoc)
    }
    catch (e) {
      console.error(`unable to post employee: ${e}`)
      return { error: e }
    }
  }

  static async UpdateEmployee(employee_id,name, surname, email, contact_number, id_number, address, role, department) {
    try {
      const updateResponse = await employee.updateOne(
        {_id:ObjectId(employee_id)},{$set:{name:name,surname: surname,email: email,contact_number: contact_number,id_number: id_number,address: address,role:role,department:department}}     
      )
      return updateResponse
    }
    catch (e) {
      console.error(`unable to update employee: ${e}`)
      return { error: e }
    }
  }

  static async deleteEmployee(employee_id){
    try{
    const deleteResponse = await employee.deleteOne({
    _id: ObjectId(employee_id),
    })
    return deleteResponse
    }
    catch(e){
    console.error(`unable to delete review: ${e}`)
    return { error: e}
    }
   }

}
