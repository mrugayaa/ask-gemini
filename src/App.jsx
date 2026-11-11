
import { useState } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleAsk() {
    if (question.trim() === '') {
      setAnswer('Please type a question first!')
      return
    }

    setLoading(true)
    setAnswer('')

    try {
      const response = await fetch('https://ask-gemini-r343.onrender.com/ask', {        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: question
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setAnswer(data.answer)
      setHistory((previousHistory) => [
        ...previousHistory,
        {
          question: question,
          answer: data.answer
        }
      ])

    } catch (error) {
      console.error('Error:', error)
      setAnswer('Sorry, something went wrong: ' + error.message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Ask Gemini</h1>
      <p>What would you like to know today?</p>

      <textarea
        placeholder="Type your question here..."
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
      />

      <button
        type="button"
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? 'Gemini is thinking...' : 'Ask Gemini'}
      </button>

      {loading && (
        <p>✨ Gemini is generating your answer...</p>
      )}

      {history.map((item, index) => (
        <div className="answer" key={index}>
          <h3>You asked:</h3>
          <p>{item.question}</p>

          <h3>Gemini:</h3>
          <p>{item.answer}</p>
        </div>
      ))}
    </main>
  )
}

export default App
