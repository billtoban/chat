const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const openaiApiKey = process.env.OPENAI_API_KEY;
console.log('OpenAI API Key:', openaiApiKey);

app.use(cors());
app.use(bodyParser.json());

// Route for the root path
app.get('/', (req, res) => {
    res.send('Welcome to the chat server!');
});

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

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
