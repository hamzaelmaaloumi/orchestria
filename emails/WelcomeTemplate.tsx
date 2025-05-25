import React from 'react'
import { Html, Body, Container, Text, Link, Preview } from '@react-email/components'

const WelcomeTemplate = ({name}:{name: string}) => {
  return (
        <Html>
            <Preview>welcome</Preview>
            <Body>
                <Container>
                    <Text>hello {name}</Text>
                    <Link href="https://react.email.com">https://react.email.com</Link>
                </Container>
            </Body>
        </Html>
  )
}

export default WelcomeTemplate