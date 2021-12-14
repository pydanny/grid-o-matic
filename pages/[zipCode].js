import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import { request, gql } from 'graphql-request'

const url = 'https://api.oeus-kraken.energy/v1/graphql/'

const fetcher = query => request(url, query)

const queryGetAllAvailableProducts = `query getAllAvailableProducts {
  products {
    id
    fullName
    displayName
    availableFrom
    availableTo
    availabilityStatus
    term
    isWholesale
  }
}`


export default function Grid(){
  const router = useRouter()
  const { zipCode } = router.query  
  const { data, error } = useSWR(
    queryGetAllAvailableProducts,
    fetcher
  )
  console.log(data)
  return (
    <div>
      <h1>Hello, World</h1>
      <p>{zipCode}</p>
    </div>
  )
}