

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Employee tasks
let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Design Homepage",
        assignedTo: "Priya Singh",
        status: "Completed"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Amit Kumar",
        status: "In Progress"
    }
];

// Create HTTP Server
const server = http.createServer((req, res) => {

    // GET /
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Employee Task Management System</h1>');
    }

    // GET /tasks
    else if (req.method === 'GET' && req.url === '/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    }

    // GET /about
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h2>Employee Task Management Application</h2><p>Manage employee tasks easily.</p>');
    }

    // GET /home
    else if (req.method === 'GET' && req.url === '/home') {
        const filePath = path.join(__dirname, 'public', 'index.html');

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading HTML file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // POST /add-task
    else if (req.method === 'POST' && req.url === '/add-task') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const newTask = JSON.parse(body);

                if (
                    newTask.id === undefined ||
                    !newTask.taskName ||
                    !newTask.assignedTo ||
                    !newTask.status
                ) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'All task fields are required' }));
                    return;
                }

                tasks.push(newTask);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Task added successfully',
                    task: newTask
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON data' }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }

});

// Start server
server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
