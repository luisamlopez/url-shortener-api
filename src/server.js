import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

// Use JSON middleware to parse incoming request body
app.use(express.json());

// Define the route for handling POST requests to /api/v1/shorten
app.post('/api/v1/shorten', async (req, res) => {
    try {
        const { url } = req.body;

        // Validate if the 'url' field is present in the request body
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Forward the request to the external API
        const cleanUriResponse = await fetch('https://cleanuri.com/api/v1/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ url }),
        });

        // Check if the response from the external API is successful
        if (!cleanUriResponse.ok) {
            const errorResponse = await cleanUriResponse.json();
            return res.status(cleanUriResponse.status).json(errorResponse);
        }

        // Parse the response from the external API
        const result = await cleanUriResponse.json();
        console.log('Result:', result);
        // Return the shortened link in the response
        res.status(200).json({ result_url: result.result_url });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
