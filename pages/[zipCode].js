import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import { request, gql } from 'graphql-request'

import Checkbox from "../components/checkbox";
import Layout from "../components/Layout";

Array.prototype.rotate = function(n) {
  n = n % this.length;
  return this.slice(n, this.length).concat(this.slice(0, n));
}



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

function productsToObject(products){
  let newProducts = {}
  for (const product of products){
    newProducts[product.id] = product    
  }
  return newProducts
}

function getTDSPByZipCode(zipCode){
  const query = `query getTDSPByPostalcode{
    tdspByPostalcode(postalCode:${zipCode}){
        loadZone
        serviceProvider
      }
    }`
    return query
}

function getProductRatesUsingLoadZone(loadZone){
  const query = `query getRatesUsingLoadZone{
    products{
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
    rates(serviceProvider:${loadZone}){
      agnosticRates{
         consumptionRates{
             loadZone
         }
      }
      loadZoneRates{
         consumptionRates{
             loadZone
         }
      }
      tdspRates{
        consumptionRates{
            band
            serviceProvider
            loadZone
            timeOfUse
        }
        standingRates{
            band
            serviceProvider
            loadZone
        }
      }
    }
  }
  }`
  return query
}

export default function Grid(){
  const router = useRouter()
  const { zipCode } = router.query  
  const { data, error } = useSWR(
    getAllAvailableProducts,
    fetcher
  )
  if (error) return <div>Oops!</div>
  if (!data) return <div>Loading...</div>  
  console.log(data.products) 
  
  const productNames = data.products.map(product => product.displayName)
  const productIds = data.products.map(product => product.id)
  const products = productsToObject(data.products)
  console.log(products)
  return (
    <Layout>
      <div>
        <h1>Hello, World</h1>
        <p>{zipCode}</p>
        <table>
          <tbody>
            <tr>
              <th></th>
              {productNames.map((name) => (
                <th key={name}>{name}</th>
              ))}
            </tr>
            <tr>
              <td>Prepay</td>
              {productIds.map((id) => (                
                <td key={id}>{Checkbox(products[id].prepay)}</td>
                ))
              }                            
            </tr> 

            <tr>
              <td>Term</td>
              {productIds.map((id) => (                
                <td key={id}>{products[id].term} months</td>
                ))
              }                            
            </tr>                
            <tr>
              <td>Description</td>
              {productIds.map((id) => (                
                <td key={id}>{products[id].description}</td>
                ))
              }                            
            </tr>   
          </tbody>        
        </table>
      </div>
    </Layout>
  )
}