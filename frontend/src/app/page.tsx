import Image from 'next/image'
import { Container } from './components/main'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Container></Container>
    </main>
  )
}
