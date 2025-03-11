const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

let users = [];
fs.readFile('./data/users.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading users.txt:', err);
        
    }else{
        users = JSON.parse(data);
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Serve static files (CSS, JS) from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routing for HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/rates', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rates.html'));
});

// API to fetch items (changed route to /ratesList)
app.get('/ratesList', (req, res) => {
    // Read items from the items.txt file
    fs.readFile('./data/items.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading items.txt:', err);
            return res.status(500).send('Error reading items data');
        }

        // Parse the file data into JSON
        const items = JSON.parse(data);

        // Return the items as JSON to the frontend
        res.json(items);
    });
});

// DELETE user - Responds with 200 OK and 'ok' message regardless of user existence
app.post('/del', (req, res) => {
    const { email, password } = req.body;

    // Read users from the users.txt file
    fs.readFile('./data/users.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.txt:', err);
            return res.status(500).send('Error reading users data');
        }

        let users = JSON.parse(data);
        const userIndex = users.findIndex(user => user.email === email && user.password === password);

        // If user exists, delete them
        if (userIndex !== -1) {
            users.splice(userIndex, 1);  // Remove the user from the array

            // Write the updated users list back to users.txt
            fs.writeFile('./data/users.txt', JSON.stringify(users), (err) => {
                if (err) {
                    console.error('Error writing to users.txt:', err);
                    return res.status(500).send('Error deleting user');
                }

                // After writing to the file, update the in-memory users list
                // This part ensures that the change is reflected in the memory
                users = JSON.parse(JSON.stringify(users));  // Ensure it's updated

                console.log('User deleted successfully');
                return res.status(200).send('ok');
            });
        } else {
            // If user does not exist, no action is taken but we still return 200 OK
            console.log('User not found');
            return res.status(200).send('ok');
        }
    });
});

// Check if email is available
app.get('/check-email', (req, res) => {
    const { email } = req.query;
    const isAvailable = !users.some(user => user.email === email);
    res.json({ isAvailable });
});

// Register a new user
app.post('/register', (req, res) => {
    const { email, name, age, password } = req.body;
    
    // Check if the user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
        return res.status(400).json({ success: false, message: 'Email already in use' });
    }
    
    // Add the new user to the users array
    users.push({ email, name, age, password });
    
    // Write the updated users list back to users.txt
    fs.writeFile('./data/users.txt', JSON.stringify(users), (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Error saving user' });

        // Respond with success and the user's details (email and name)
        res.json({
            success: true,
            message: 'User registered successfully!',
            'email': email,
            'name' : name
        });
    });
});


// Login functionality
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Read users from the users.txt file
    fs.readFile('./data/users.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading users.txt:', err);
            return res.status(500).send('Error reading users data');
        }

        let users = JSON.parse(data);
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            // Login successful
            res.json({ success: true, message: 'Login successful!',  email: user.email,  name: user.name });
        } else {
            // Invalid credentials
            res.json({ success: false, message: 'Invalid email or password.' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
