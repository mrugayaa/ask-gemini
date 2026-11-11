
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { GoogleGenAI } from '@google/genai'

dotenv.config()

const app = express()

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Ask Gemini backend is running!')
})

app.post('/ask', async (req, res) => {
  try {
    const question = req.body.question

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: question
    })

    res.json({
      answer: response.text
    })

  } catch (error) {
    console.error('Gemini error:', error)

    res.status(500).json({
      error: 'Something went wrong while contacting Gemini.'
    })
  }
})

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
