import React from 'react'
import Head from 'next/head'
import { Card, CardContent, Typography } from '@mui/material'

export default function HomePage() {
  const [message, setMessage] = React.useState('No message found')

  React.useEffect(() => {
    window.ipc.on('message', (message) => {
      setMessage(message)
    })
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>Home</title>
      </Head>
      
    </React.Fragment>
  )
}
