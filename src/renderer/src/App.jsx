import { useEffect, useState, useRef } from 'react'
import { Container } from '@mui/material'
import BasicStack from './components/BasicStack'

function App() {
  const [generatedText, setGeneratedText] = useState('')
  const [selectedNoteIndex, setSelectedNoteIndex] = useState(0)
  const [notes, setNotes] = useState([
    { title: 'Note 1', content: 'Hello from Note 1' },
    { title: 'Note 2', content: 'Hello from Note 2' },
    { title: 'Note 3', content: 'Hello from Note 3' }
  ])

  const textAreaRef = useRef(null)

  useEffect(() => {
    const handleKeyPress = async (event) => {
      if (event.ctrlKey && event.altKey && event.key === 'i') {
        try {
          console.log(notes[selectedNoteIndex].content)
          let noteContent = notes[selectedNoteIndex].content
          const generatedText = await window.api.generateText(noteContent)
          setGeneratedText(generatedText)
          setNotes((prevNotes) => {
            const updatedNotes = [...prevNotes]
            updatedNotes[selectedNoteIndex].content += generatedText
            return updatedNotes
          })
        } catch (error) {
          console.error('Error generating text:', error)
        }
      } else if (event.ctrlKey && event.key === 's') {
        try {
          const result = await window.api.saveNotes(notes)
          if (result.success) {
            console.log(`Notes saved to ${result.filePath}`)
            await window.api.refocusWindow() // Refocus the main window
            if (textAreaRef.current) {
              textAreaRef.current.focus()
            }
          } else {
            alert(`Failed to save notes: ${result.error}`)
          }
        } catch (error) {
          console.error('Error saving notes:', error)
        }
      } else if (event.ctrlKey && event.key === 't') {
        console.log('test')
      }
    }

    const handleFocus = () => {
      if (textAreaRef.current) {
        textAreaRef.current.focus()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
      window.removeEventListener('focus', handleFocus)
    }
  }, [selectedNoteIndex, notes])

  const handleTextChange = (event) => {
    const updatedContent = event.target.value
    setNotes((prevNotes) => {
      const updatedNotes = [...prevNotes]
      updatedNotes[selectedNoteIndex].content = updatedContent
      return updatedNotes
    })
  }

  const handleNoteClick = (index) => {
    setSelectedNoteIndex(index)
  }

  return (
    <Container
      style={{
        height: '100vh',
        width: '100dvw',
        display: 'flex',
        color: 'black',
        backgroundColor: 'white',
        gap: '4rem',
        paddingLeft: '0'
      }}
    >
      <BasicStack
        style={{ width: '25%' }}
        notes={notes}
        onNoteClick={handleNoteClick}
        selectedNoteIndex={selectedNoteIndex}
      />

      <textarea
        ref={textAreaRef}
        value={notes[selectedNoteIndex].content}
        onChange={handleTextChange}
        style={{
          width: '75%',
          height: '100%',
          border: 'none',
          outline: 'none',
          fontSize: '16px',
          borderLeft: '2px solid black'
        }}
      />
    </Container>
  )
}

export default App
