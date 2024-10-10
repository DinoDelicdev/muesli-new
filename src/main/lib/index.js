import axios from 'axios'
import { configDotenv } from 'dotenv'
import { join } from 'path'
import { app } from 'electron'
import fs from 'fs'
import FormData from 'form-data'

configDotenv()
console.log(process.env.MAIN_VITE_OPENAI_API_KEY)

export const transcribeAudio = async (audioFilePath) => {
  const formData = new FormData()
  formData.append('file', fs.createReadStream(audioFilePath))
  formData.append('model', 'whisper-1') // Specify the Whisper model

  try {
    const response = await axios.post('https://api.openai.com/v1/audio/transcriptions', formData, {
      headers: {
        Authorization: `Bearer ${process.env.MAIN_VITE_OPENAI_API_KEY}`,
        ...formData.getHeaders()
      }
    })

    return response.data.text
  } catch (error) {
    console.error('Error transcribing audio:', error)
    throw error
  }
}

export const generateText = async (notes) => {
  const endpoint = 'https://api.openai.com/v1/chat/completions'

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.MAIN_VITE_OPENAI_API_KEY}`
  }

  const transcription = await transcribeAudio('audio/test.mp3')
  console.log(notes)
  console.log(transcription)

  const prompt = `Based on provided transcription and all previous notes, create a new note.
    
    TRANSCRIPTION: ${transcription}
    
    
    ALL PREVIOUS NOTES: ${notes}`

  const requestBody = {
    model: 'gpt-4o', // or 'gpt-4-turbo' if you're using that variant
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant. Your job is to provide a single note. One single note. Do not chat with user. Just provide one single sentence of about 10 words.'
      }, // You can adjust the system message as needed
      { role: 'user', content: prompt }
    ],
    max_tokens: 150, // Adjust token limit as necessary
    temperature: 0.7 // Adjust creativity level (temperature)
  }

  try {
    const response = await axios.post(endpoint, requestBody, { headers })
    console.log(response.data.choices[0].message.content)
    return response.data.choices[0].message.content
  } catch (error) {
    console.error(error)
  }
}

export const saveNotes = async (notes) => {
  try {
    const filePath = join(app.getPath('documents'), 'notes.json')
    console.log(filePath)
    console.log(notes)
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2))
    return { success: true, filePath }
  } catch (error) {
    console.error('Error saving notes:', error)
    return { success: false, error: error.message }
  }
}
