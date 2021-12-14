import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Grid(){
  const router = useRouter()
  const { zipCode } = router.query  
  return (
    <div>
      <h1>Hello, World</h1>
      <p>{zipCode}</p>
    </div>
  )
}