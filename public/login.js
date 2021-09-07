function login() {
  const password = document.getElementById("password").value;
  
  var xhr = new XMLHttpRequest();
  
  xhr.onreadystatechange = () => {
    if (xhr.readyState == XMLHttpRequest.DONE) {
      if (xhr.status == 204) {
        window.location.replace("https://locate-reborn.glitch.me/");
      } else {
        document.getElementById("invalid").innerHTML = "Invalid Password!";
      }
    }
  }
  
  xhr.open("POST", "/login", true);
  xhr.send(password);
}