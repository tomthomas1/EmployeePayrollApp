let employeePayrollDataList;

window.addEventListener('DOMContentLoaded', (event) => {
  employeePayrollDataList = getEmployeePayrollDataFromStorage();
  document.querySelector('.emp-count').textContent = employeePayrollDataList.length;
  createInnerHtml();
  localStorage.removeItem('editEmp');
});

const getEmployeePayrollDataFromStorage = () => {
  return localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
}

const createInnerHtml = () => {

  const headerHtml = `
    <th></th>
    <th>Name</th>
    <th>Gender</th>
    <th>Department</th>
    <th>Salary</th>
    <th>Start Date</th>
    <th>Actions</th>`;

  if(employeePayrollDataList.length == 0)
    return;

  let innerHtml = `${headerHtml}`;

  for (const employeePayrollData of employeePayrollDataList) {

    innerHtml = `${innerHtml}
      <tr>
        <td><img class="profile" src="${employeePayrollData._profileImage}" alt="profile_img-1"></td>
        <td>${employeePayrollData._name}</td>
        <td>${employeePayrollData._gender}</td>
        <td>${getDepartmentHtml(employeePayrollData._department)}</td>
        
        <td>${employeePayrollData._salary}</td>
        <td>${employeePayrollData._startDate}</td>
        <td>
          <img name="${employeePayrollData._id}" src="../assets/delete.svg" alt="delete" id="1" onclick="remove(this)">
          <img name="${employeePayrollData._id}" src="../assets/edit.svg" alt="edit" id="1" onclick="update(this)">
        </td>
      </tr>`;

  }
  document.querySelector('#table-display').innerHTML = innerHtml;
}

const getDepartmentHtml = (departmentList) => {
  let departmentHtml = '';
  for (const department of departmentList) {
    departmentHtml = `${departmentHtml} <div class='dept-label'>${department}</div>`
  }
  return departmentHtml
}