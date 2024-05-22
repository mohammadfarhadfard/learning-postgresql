const getStudents = "SELECT * FROM std";
const getStudentById = "SELECT * FROM std WHERE id =$1";
const checkEmailExists = "SELECT S FROM std s WHERE s.email = $1";
const addStudent = "INSERT INTO std (name,email,age,dob) VALUES ($1,$2,$3,$4)";
const removeStudent = "DELETE FROM std WHERE id =$1";
const updateStudent = "UPDATE std SET name = $1 WHERE id = $2";

module.exports = {
    getStudents,
    getStudentById,
    checkEmailExists,
    addStudent,
    removeStudent,
    updateStudent
};