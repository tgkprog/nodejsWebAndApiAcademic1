// start.js

// Set the 'email' and 'name' cookies to empty values
document.cookie = `email=; max-age=3600; path=/`;
document.cookie = `name=; max-age=3600; path=/`;

// You can also log to the console to verify that the cookies were set
console.log('Cookies cleared: email and name.');
