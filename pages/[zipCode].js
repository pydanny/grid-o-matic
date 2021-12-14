import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import { request, gql } from 'graphql-request'

const url = 'https://api.oeus-kraken.energy/v1/graphql/'

const fetcher = query => request(url, query)

const getAllAvailableProducts = `query getAllAvailableProducts {
  products {
    id
    availableFrom
    availableTo
    availabilityStatus    
    code
    description
    displayName
    fullName
    isWholesale
    prepay
    term
    
  }
}`



export default function Grid(){
  const router = useRouter()
  const { zipCode } = router.query  
  const { data, error } = useSWR(
    getAllAvailableProducts,
    fetcher
  )
  if (error) return <div>Oops!</div>
  if (!data) return <div>Loading...</div>  
  console.log(data) 
  return (
    <div>
      <h1>Hello, World</h1>
      <p>{zipCode}</p>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Prepay</th>          
            <th>Term</th>   
          </tr>
          {data.products.map(({id, displayName, prepay, term}) => (
            <tr key={id}>
              <td>{displayName}</td>
              <td>{prepay}</td>
              <td>{term}</td>
            </tr>    
            ))
          }
        </tbody>        
      </table>
    </div>
  )
}