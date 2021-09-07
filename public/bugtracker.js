function loadBugs() {
  var xhr = new XMLHttpRequest();
  let table = document.getElementById("sheet0");
  
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        let buglist = JSON.parse(xhr.response);
        buglist.forEach(bug => {
          let row = table.insertRow();
          row.insertCell(0).appendChild(document.createTextNode(bug.date));
          row.insertCell(1).appendChild(document.createTextNode(bug.description));
          row.insertCell(2).appendChild(document.createTextNode(bug.status));
          toggleResolved();
        });
    }
  }
  
  xhr.open("GET", "/bugs/buglist.json", true);
  xhr.send();
}

function toggleResolved() {
  const hide = document.getElementById("resolved").checked;
  const rows = document.getElementsByTagName("tr");
  
    for (var x = 0; x < rows.length; x++) {
      const row = rows[x];
      
      if (row.children[2].textContent.toLowerCase() == "resolved" && hide) {
        row.style.display = "none";
      } else {
        row.style.display = "table-row";
      }
    }
}