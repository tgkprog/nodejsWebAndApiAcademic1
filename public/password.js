document.getElementById('passwordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    const messageDiv = document.createElement('div'); // Create the div for the message
    const registerUrl = '/register'; // The API URL for registration

    if (password.length < 6) {
        // Show error message (red) for password too short
        messageDiv.textContent = "Password must be at least 6 characters.";
        messageDiv.style.color = 'red';
        document.body.appendChild(messageDiv); // Add the message to the page
    } else if (password !== confirmPassword) {
        // Show error message (red) for password mismatch
        messageDiv.textContent = "Passwords do not match.";
        messageDiv.style.color = 'red';
        document.body.appendChild(messageDiv); // Add the message to the page
    } else {
        // Show success message (green)
        messageDiv.textContent = "Password set successfully. You are now registered!";
        messageDiv.style.color = 'green';
        document.body.appendChild(messageDiv); // Add the message to the page

        // Send data to register the user
        const params = new URLSearchParams(window.location.search);
        const email = params.get('email');
        const name = params.get('name');
        const age = params.get('age');

        await fetch(registerUrl, {
            method: 'POST',
            body: JSON.stringify({ email, name, age, password }),
            headers: { 'Content-Type': 'application/json' }
        });

        // Redirect to login page after 3 seconds
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
    }

    // Remove the message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
});
