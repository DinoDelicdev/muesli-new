import * as React from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027'
  })
}))

export default function BasicStack({ notes, onNoteClick, selectedNoteIndex }) {
  return (
    <Box sx={{ width: '25%' }}>
      <Stack spacing={2}>
        {notes.map((note, index) => (
          <Item
            key={index}
            onClick={() => onNoteClick(index)}
            selected={selectedNoteIndex === index}
            style={{
              backgroundColor: selectedNoteIndex === index ? 'lightgray' : 'white'
            }}
          >
            {note.title}
          </Item>
        ))}
      </Stack>
    </Box>
  )
}
