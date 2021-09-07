function sendBug() {
  const data = document.getElementById("bugdescription").value; 
  var xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        window.location.replace("https://locate-reborn.glitch.me/bugs/bugtracker.html");
    }
  }
  
  xhr.open("POST", "/bugs/bug.html", true);
  xhr.send(data);
}