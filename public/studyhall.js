function toggleStudyHall() {
  const hide = document.getElementById("studyhall").checked;
  const studyHalls = document.getElementsByClassName("~Study Hall");
  
    for (var x = 0; x < studyHalls.length; x++) {
      if (hide) {
        studyHalls[x].classList.add("hidden");
      } else {
        studyHalls[x].classList.remove("hidden");
      }
    }
}