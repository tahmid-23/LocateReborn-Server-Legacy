function filter() {
  const search = document.getElementById("filter-text").value.toLowerCase();
  const filterType = document.getElementById("filter-type").value;
  const nodes = document.getElementById("students").childNodes;
  
  for (var x = 0; x < nodes.length; x++) {
    if (nodes[x].style != undefined) {
      const content = nodes[x].innerText.toLowerCase();
      
      if ((!content.includes(search) && filterType == "any") || (!content.startsWith(search) && filterType == "first") || (!content.split(" ")[content.split(" ").length - 1].startsWith(search) && filterType == "last")) {
        nodes[x].style.display = "none";
      } else {
        nodes[x].style.display = "";
      }
    }
  }
}
