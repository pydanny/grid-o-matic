import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import { request, gql } from 'graphql-request'

import Checkbox from "../components/checkbox";
import Layout from "../components/Layout";


const url = 'https://api.oeus-kraken.energy/v1/graphql/'

const fetcher = query => request(url, query)

function getProductRatesUsingTDSP(TDSP){
  const text = `query getRatesUsingLoadZone{
    productsWithConciseApplicableRates {
      id  
      description
      displayName
      fullName
      prepay
      rates (filterRatesBy: { serviceProvider: ${TDSP} }) {
        totalApplicableRate
        kwhUsage
        serviceProvider
        serviceProviderConsumptionRate
        serviceProviderStandingRate
        loadZone
        totalApplicableDayRate
        totalApplicableNightRate
        loadZoneDayTimeConsumptionRate
        loadZoneNightTimeConsumptionRate
        loadZoneConsumptionRate
        serviceProviderStandingRateUnitType
        serviceProviderConsumptionRateUnitType
        loadZoneDayTimeRateUnitType
        loadZoneNightTimeRateUnitType
        loadZoneConsumptionRateUnitType
      }
    }
  }`
  return text
}

function productsToObject(products){
  let newProducts = {}
  for (const product of products){
    newProducts[product.id] = product    
  }
  return newProducts
}


export default function Grid(){
  const router = useRouter()
  const { zipCode } = router.query  

  const text = getProductRatesUsingTDSP("CENTERPOINT")
  const {data, error} = useSWR(
    text,
    fetcher
  )
  if (error) return <div>Oops!</div>
  if (!data) return <div>Loading...</div>  
  console.log(data) 
  const productData = data.productsWithConciseApplicableRates
  
  const productNames = productData.map(product => product.displayName)
  const productIds = productData.map(product => product.id)
  const products = productsToObject(productData)
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
            <tr>
              <td>Rates</td>
              {productIds.map((id) => (                
                <td key={id}>{products[id].rates[0].totalApplicableRate}</td>
                ))
              }                            
            </tr>              
          </tbody>        
        </table>
      </div>
    </Layout>
  )
}