function toggleLunch() {
  const hide = document.getElementById("lunch").checked;
  const lunches = document.getElementsByClassName("~Lunch");
  
    for (var x = 0; x < lunches.length; x++) {
      if (hide) {
        lunches[x].classList.add("hidden");
      } else {
        lunches[x].classList.remove("hidden");
      }
    }
}