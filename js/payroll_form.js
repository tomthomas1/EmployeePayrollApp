let isUpdate = false;
let employeePayrollDataObject = {};

window.addEventListener('DOMContentLoaded', (event) => {
  const name = document.querySelector('#name');
  name.addEventListener('input', function () {
    if (name.value.length == 0) {
      setTextValue('.text-error', "");
      return;
    }
    try {
      checkName(name.value);
      setTextValue('.text-error', "");
    }
    catch (e) {
      setTextValue('.text-error', e);
    }
  });

  const salary = document.querySelector('#salary');
  setTextValue('.salary-output', salary.value);
  salary.addEventListener('input', function () {
    setTextValue('.salary-output', salary.value);
  });

  var date = document.getElementById("day");
  var month = document.getElementById("month");
  var year = document.getElementById("year");
  date.addEventListener("input", validateDate);
  month.addEventListener("input", validateDate);
  year.addEventListener("input", validateDate);

  function validateDate() {
    let startDate = Date.parse(
      year.value + "-" + month.value + "-" + date.value
    );
    try {
      checkStartDate(startDate);
      setTextValue('.date-error', "");
    } catch (e) {
      setTextValue('.date-error', e);
    }
  }
  checkForUpdate();
});

const save = (event) => {
  event.preventDefault();
  event.stopPropagation();
  try {
    setEmployeePayrollObject();
    if(site_properties.use_local_storage.match("true")){
      createAndUpdateStorage();
      resetForm();
      window.location.replace(site_properties.home_page);
    }
    else{
      createOrUpdateEmployeePayroll();
    }
  }
  catch (e) {
    alert(e);
  }
};

const createOrUpdateEmployeePayroll = () => {
  let postURL = site_properties.server_url;
  let methodCall = "POST";
  if(isUpdate){
    methodCall = "PUT";
    postURL = postURL + employeePayrollDataObject.id.toString();
  }
  makeServiceCall(methodCall, postURL, true, employeePayrollDataObject)
    .then(() => {
      resetForm();
      window.location.replace(site_properties.home_page);
    })
    .catch(error => {
      throw error;
    })
};

const setEmployeePayrollObject = () => {
  if(!isUpdate && site_properties.use_local_storage.match("true")){
    employeePayrollDataObject.id = createNewEmployeeId();
  }
  employeePayrollDataObject._name = getInputValueById('#name');
  employeePayrollDataObject._profileImage = getSelectedValues('[name=profile]').pop();
  employeePayrollDataObject._gender = getSelectedValues('[name=gender]').pop();
  employeePayrollDataObject._department = getSelectedValues('[name=department]');
  employeePayrollDataObject._salary = getInputValueById("#salary");
  employeePayrollDataObject._notes = getInputValueById("#notes");
  let date = getInputValueById("#year") + "-" + getInputValueById("#month") + "-" + getInputValueById("#day");
  employeePayrollDataObject._startDate = new Date(Date.parse(date));
};

const createNewEmployeeId = () => {
  let employeeId = localStorage.getItem('EmployeeId');
  employeeId = !employeeId ? 1: (parseInt(employeeId)+1).toString();
  localStorage.setItem('EmployeeId', employeeId);
  return employeeId;
}

const createAndUpdateStorage = () => {
  let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));
  if (employeePayrollList) {

    let employeePayrollData = employeePayrollList.find(employeeData => employeeData.id == employeePayrollDataObject.id);
    if(!employeePayrollData) 
      employeePayrollList.push(employeePayrollDataObject);
    else{
      const index = employeePayrollList.map(employeeData => employeeData.id).indexOf(employeePayrollData.id);
      employeePayrollList.splice(index, 1, employeePayrollDataObject);
    }
  }
   else {
    employeePayrollList = [employeePayrollDataObject];
  }
  // alert(employeePayrollList.toString());
  localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
};


const setForm = () => {
  setValue('#name', employeePayrollDataObject._name);
  setSelectedValues('[name=profile]', employeePayrollDataObject._profileImage);
  setSelectedValues('[name=gender]', employeePayrollDataObject._gender);
  setSelectedValues('[name=department]', employeePayrollDataObject._department);
  setValue('#salary', employeePayrollDataObject._salary);
  setTextValue('.salary-output', employeePayrollDataObject._salary);
  setValue('#notes', employeePayrollDataObject._notes);
  let date = new Date(employeePayrollDataObject._startDate);
  setValue('#day', date.getDate());
  setValue('#month', date.getMonth() + 1);
  setValue('#year', date.getFullYear());
};

const resetForm = () => {
  setValue('#name', '');
  unsetSelectedValues('[name=profile]');
  unsetSelectedValues('[name=gender]');
  unsetSelectedValues('[name=department]');
  setValue('#salary', '');
  setTextValue('.salary-output', 400000);
  setValue('#notes', '');
  setSelectedIndex('#day', 0);
  setSelectedIndex('#month', 0);
  setSelectedIndex('#year', 0);
};

const checkForUpdate = () => {
  const employeePayrollDataJson = localStorage.getItem('editEmp');
  isUpdate = employeePayrollDataJson ? true : false;
  if (!isUpdate)
    return;
  employeePayrollDataObject = JSON.parse(employeePayrollDataJson);
  setForm();
};

const getSelectedValues = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue);
  let selItems = [];
  allItems.forEach((item) => {
    if (item.checked) selItems.push(item.value);
  });
  return selItems;
};

const getInputValueById = (id) => {
  let value = document.querySelector(id).value;
  return value;
};

const getInputElementValue = (id) => {
  let value = document.getElementById(id).value;
  return value;
};

const unsetSelectedValues = (propertyValue) => {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach(item => {
    item.checked = false;
  });
};

const setTextValue = (id, value) => {
  const element = document.querySelector(id);
  element.textContent = value;
};

const setValue = (id, value) => {
  const element = document.querySelector(id);
  element.value = value;
};

const setSelectedValues = (propertyValue, value) => {
  let allItems = document.querySelectorAll(propertyValue);
  allItems.forEach(item => {
    if (Array.isArray(value)) {
      if (value.includes(item.value)) {
        item.checked = true;
      }
    }
    else if (item.value == value)
      item.checked = true;
  });
};

const setSelectedIndex = (id, index) => {
  const element = document.querySelector(id);
  element.selectedIndex = index;
};