document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    const messageDiv = document.createElement('div'); // Create the div for the message

    if (data.success) {
        // Set the cookie with email and name if login is successful
        document.cookie = `email=${email}; max-age=3600; path=/`;
        document.cookie = `name=${data.name}; max-age=3600; path=/`;

        // Show success message (green)
        messageDiv.textContent = "Login successful! Loading ...";
        messageDiv.style.color = 'green';
        document.body.appendChild(messageDiv); // Add the message to the page

        // Redirect to rates page after 3 seconds
        setTimeout(() => {
            window.location.href = '/rates';
        }, 3000);
    } else {
        // Show error message (red)
        messageDiv.textContent = "Invalid credentials.";
        messageDiv.style.color = 'red';
        document.body.appendChild(messageDiv); // Add the message to the page
    }

    // Remove the message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
});
