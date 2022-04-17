const stringifyDate = (date) => {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const newDate = !date ? "undefined" : new Date(Date.parse(date)).toLocaleDateString('en-GB', options);
  return newDate;
}

const checkName = (name) => {
  let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
  if (!nameRegex.test(name))
    throw "Name is Incorrect";
}

const checkStartDate = (startDate) => {
  var today = new Date();
  if (today < startDate)
    throw 'Start date is in the Future';
  const minDate = new Date(today.setDate(today.getDate() - 30));
  today = new Date();
  if (startDate < minDate)
    throw 'Start date is Beyond 30 days';
}

function makeServiceCall(methodType, url, async = true, data = null) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.onload = function () {
      console.log(methodType+" state changed called. Ready state: "+xhr.readyState+" ,status: "+xhr.status);
      if (xhr.readyState == 4) {
        if (xhr.status === 200 || xhr.status === 201) {
          resolve(xhr.responseText);
        }
        else if (xhr.status >= 400) {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
          console.log("Handle 400 client error or 500 server error!");
        }
      }
    }
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    }
    xhr.open(methodType, url, async);
    if (data) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data));
    }
    else {
      xhr.send();
    }
    console.log(methodType + " request sent to server!");
  });
}