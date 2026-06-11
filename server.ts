import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { action, history, inventory, currentQuest, characterDescription, modelName } = req.body;
    
    const model = modelName || 'gemini-3.5-flash';

    const systemInstruction = `You are a dynamic Game Master for an infinite choose-your-own-adventure text game. 
The player's character is described as: "${characterDescription || 'A brave adventurer'}"
You must progress the story realistically based on the player's action. Their choices must genuinely alter the plot.
You will manage their inventory and current quest. Update them logically as they find items, use items, or get new objectives.
Return your response strictly in the requested JSON format.
Provide a vivid 'imagePrompt' representing the exact current scene, including the character description so they look consistent.
Keep the 'narrative' engaging, descriptive, and atmospheric, around 2-3 paragraphs.
Provide 2-4 compelling 'choices' for the player.`;

    const contents = [];
    if (history && history.length > 0) {
      contents.push(...history.map((h: any) => ({
        role: h.role, // 'user' or 'model'
        parts: [{ text: h.text }]
      })));
    }
    
    let promptText = `Current Inventory: ${JSON.stringify(inventory || [])}\nCurrent Quest: ${currentQuest || 'None'}\n\nPlayer action/choice: ${action}`;

    contents.push({
      role: 'user',
      parts: [{ text: promptText }]
    });

    const response = await ai.models.generateContent({
      model: model,
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            narrative: { type: Type.STRING, description: 'The story text describing what happens next.' },
            choices: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Possible choices for the player to take.' },
            inventory: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'The updated list of items the player has.' },
            currentQuest: { type: Type.STRING, description: 'The current active main objective or quest.' },
            imagePrompt: { type: Type.STRING, description: 'A detailed visual description of the current scene and character to generate an image. Include setting, lighting, and the character description.' }
          },
          required: ['narrative', 'choices', 'inventory', 'currentQuest', 'imagePrompt']
        }
      }
    });

    const resultText = response.text || '{}';
    const resultObj = JSON.parse(resultText);

    res.json(resultObj);
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, size } = req.body;
    const finalSize = size || '1K';
    
    const finalPrompt = prompt + ", masterpiece, high quality, consistent watercolor fantasy art style, vibrant colors";

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: finalSize
        }
      }
    });

    let base64Image = null;
    let mimeType = 'image/png';

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        if (part.inlineData.mimeType) {
          mimeType = part.inlineData.mimeType;
        }
        break;
      }
    }

    if (!base64Image) {
      throw new Error("No image generated");
    }

    res.json({ imageUrl: `data:${mimeType};base64,${base64Image}` });

  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    res.status(500).json({ error: err.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
