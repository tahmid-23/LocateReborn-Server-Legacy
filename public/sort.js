function sort() {
    const studentList = document.getElementById("students")
    const students = studentList.childNodes;
    const alphabetical = document.getElementById("alphabetical").checked;
  
    var sorted = [].slice.call(students).sort((a, b) => {
      const first = a.textContent.split(" ");
      const second = b.textContent.split(" ");
      
      switch (document.getElementById("filter-type").value) {
        case "first":
          if (first[0] == second[0]) {
            return lastGreater(first, second, alphabetical);
          }
          
          return firstGreater(first, second, alphabetical);
        default:
          if (first[first.length - 1] == second[second.length - 1]) {
            return firstGreater(first, second, alphabetical);
          }
          
          return lastGreater(first, second, alphabetical);
      }
        
    });
  
    sorted.forEach(function (p) {
        studentList.appendChild(p);
    });
}

function firstGreater(first, second, alphabetical) {
  return (alphabetical ? -1 : 1) * (first[0] > second[0] ? 1 : -1);
}

function lastGreater(first, second, alphabetical) {
  return (alphabetical ? -1 : 1) * (first[first.length - 1] > second[second.length - 1] ? 1 : -1);
}