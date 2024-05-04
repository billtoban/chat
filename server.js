const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route for the root path
app.get('/', (req, res) => {
    res.send('Welcome to the chat server!');
});

// Route to save chat data
app.post('/saveChat', async (req, res) => {
    const { chatText, secretCommand } = req.body;

    if (secretCommand !== "Save this chat") {
        return res.status(403).json({ error: 'Unauthorized command' });
    }

    if (!chatText) {
        return res.status(400).json({ error: 'No chat text provided' });
    }

    try {
        const chatDirectory = path.join(__dirname, 'ChatNRHistory');
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const filename = `chat-${timestamp}.txt`;
        const filePath = path.join(chatDirectory, filename);

        await fs.mkdir(chatDirectory, { recursive: true });
        await fs.writeFile(filePath, chatText);

        res.json({ message: 'Chat saved successfully', filename });
    } catch (err) {
        console.error('Error saving the chat:', err);
        res.status(500).json({ error: 'Failed to save the chat' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).send('Internal server error.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

