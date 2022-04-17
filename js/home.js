let employeePayrollDataList;

window.addEventListener('DOMContentLoaded', (event) => {
  if (site_properties.use_local_storage.match("true")) {
    getEmployeePayrollDataFromStorage();
  }
  else {
    getEmployeePayrollDataFromServer();
  }

});

const processEmployeePayrollDataResponse = () => {
  document.querySelector(".emp-count").textContent = employeePayrollDataList.length;
  createInnerHtml();
  localStorage.removeItem('editEmp');
};

const getEmployeePayrollDataFromStorage = () => {
  employeePayrollDataList = localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
  processEmployeePayrollDataResponse();
};

const getEmployeePayrollDataFromServer = () => {
  makeServiceCall("GET", site_properties.server_url, true)
    .then(responseText => {
      employeePayrollDataList = JSON.parse(responseText);
      processEmployeePayrollDataResponse();
    })
    .catch(error => {
      console.log("GET Error Status: " + JSON.stringify(error));
      employeePayrollDataList = [];
      processEmployeePayrollDataResponse();
    })
};

const createInnerHtml = () => {

  const headerHtml =
    ` <th></th>
      <th>Name</th>
      <th>Gender</th>
      <th>Department</th>
      <th>Salary</th>
      <th>Start Date</th>
      <th>Actions</th>`;

  if (employeePayrollDataList.length == 0)
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
        <td>${stringifyDate(employeePayrollData._startDate)}</td>
        <td>
          <img id="${employeePayrollData.id}" src="../assets/delete.svg" alt="delete" onclick="remove(this)">
          <img id="${employeePayrollData.id}" src="../assets/edit.svg" alt="edit" onclick="update(this)">
        </td>
      </tr>`;
  }
  document.querySelector('#table-display').innerHTML = innerHtml;
};

const getDepartmentHtml = (departmentList) => {
  let departmentHtml = '';
  for (const department of departmentList) {
    departmentHtml = `${departmentHtml} <div class='dept-label'>${department}</div>`
  }
  return departmentHtml
};

const remove = (node) => {
  let employeePayrollData = employeePayrollDataList.find(employeeData => employeeData.id == node.id);
  if (!employeePayrollData)
    return;

  const index = employeePayrollDataList
    .map(employeeData => employeeData.id)
    .indexOf(employeePayrollData.id);
  employeePayrollDataList.splice(index, 1);

  if(site_properties.use_local_storage.match("true")){
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollDataList));
    document.querySelector(".emp-count").textContent = employeePayrollDataList.length;
    createInnerHtml();
    window.location.replace(site_properties.home_page);
  }
  else{
    const deleteURL = site_properties.server_url + employeePayrollData.id.toString();
    makeServiceCall("DELETE", deleteURL, true)
      .then(responseText => {
        document.querySelector(".emp-count").textContent = employeePayrollDataList.length;
        createInnerHtml();
        window.location.replace(site_properties.home_page);
      })
      .catch(error => {
        console.log("DELETE Error Status: " + JSON.stringify(error));
      })
  }
};

const update = (node) => {
  let employeePayrollData = employeePayrollDataList.find(employeeData => employeeData.id == node.id);
  if (!employeePayrollData)
    return;
  localStorage.setItem('editEmp', JSON.stringify(employeePayrollData));
  window.location.replace(site_properties.add_employee_payroll_page);
};