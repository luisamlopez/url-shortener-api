import express, { response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: 'POST',
    credentials: true,
}));

// Use JSON middleware to parse incoming request body
app.use(express.json());

// Define the route for handling POST requests to /api/v1/shorten
app.post('/', async (req, res) => {
    try {
        console.log(req.body); // Check what is being received in the request body

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        const urlencoded = new URLSearchParams();
        urlencoded.append("url", req.body.url); // Use req.body.url instead of req.body.formData

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        const response = await fetch("https://cleanuri.com/api/v1/shorten", requestOptions);

        if (response.ok) {
            const result = await response.json();
            res.status(200).json({ result_url: result.result_url, message: 'Link shortened successfully' });
        } else {
            res.status(response.status).json({ error: 'Failed to shorten the link' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
