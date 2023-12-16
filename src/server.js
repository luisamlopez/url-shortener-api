import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'POST',
    credentials: true,
}));

// Use JSON middleware to parse incoming request body
app.use(express.json());

// Define the route for handling POST requests to /api/v1/shorten
app.post('/', async (req, res) => {
    try {
        const { url } = req.body;

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("url", url);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://localhost:3001/", requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log(result);
                res.status(200).json({ result_url: result.result_url, message: 'Link shortened successfully' });

            })
            .catch(error => res.status(500).json({ error: error }));


    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
