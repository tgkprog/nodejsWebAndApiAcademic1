document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;

    const response = await fetch(`/check-email?email=${email}`);
    const data = await response.json();

    const messageDiv = document.createElement('div'); // Create the div for the message
    const passwordFormDiv = document.createElement('div'); // Div for password form

    if (data.isAvailable) {
        // Show success message (green)
        messageDiv.textContent = "Email is available, proceed to set your password.";
        messageDiv.style.color = 'green';
        document.body.appendChild(messageDiv); // Add the message to the page

        // Create the password form dynamically
        passwordFormDiv.innerHTML = `
            <h1>Set Password</h1>
            <form id="passwordForm">
                <input type="password" name="password" id="password" placeholder="Password (at least 6 chars)" required><br>
                <input type="password" name="confirmPassword" id="confirmPassword" placeholder="Confirm Password" required><br>
                <input type="hidden" name="email" value="${email}">
                <input type="hidden" name="name" value="${name}">
                <input type="hidden" name="age" value="${age}">
                <button type="submit">Submit</button>
            </form>
        `;
        document.body.appendChild(passwordFormDiv); // Append password form to body

        // Handle password form submission
        document.getElementById('passwordForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            const messageDiv = document.createElement('div'); // Create the div for the message

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
                const registerResponse = await fetch('/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, name, age, password }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const registerData = await registerResponse.json();

                // Check if registration was successful (status 200)
                if (registerResponse.status === 200 && registerData.success) {
                    // Set cookies if the registration is successful
                    document.cookie = `email=${email}; max-age=3600; path=/`;
                    document.cookie = `name=${name}; max-age=3600; path=/`;

                    // Redirect to the rates page after few seconds
                    setTimeout(() => {
                        window.location.href = '/rates';
                    }, 2000);
                } else {
                    // Show error if registration fails
                    messageDiv.textContent = registerData.message || 'Error during registration.';
                    messageDiv.style.color = 'red';
                }
            }

            // Remove the message after 3 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 3000);
        });
    } else {
        // Show error message (red)
        messageDiv.textContent = "Email is already registered.";
        messageDiv.style.color = 'red';
        document.body.appendChild(messageDiv); // Add the message to the page
    }

    // Remove the message after 3 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
});
