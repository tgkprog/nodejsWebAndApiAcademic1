document.addEventListener('DOMContentLoaded', function() {
    const email = getCookie('email');
    const name = getCookie('name');

    if (!email || !name) {
        // If email or name is not found in cookies, redirect to login page
        window.location.href = '/';
    } else {
        // If cookies are found, show profile in the top-right corner
        const profileDiv = document.createElement('div');
        profileDiv.classList.add('profile');
        profileDiv.innerHTML = `Welcome, ${name} (${email})`;
        
        document.body.appendChild(profileDiv); // Append the profile div to the body
    }
});

// Function to get the cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
