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



async function getTDSPByZipCode(zipCode){
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

  let { data, error } = useSWR(
    getTDSPByZipCode(77002),
    fetcher
  )
  
  if (error) return <div>Oops!</div>
  if (!data) return <div>Loading...</div>   
  
  console.log(data)
  return (
    <Layout>
      <div>
        <h1>Hello, World</h1>
        <p>{zipCode}</p>
      </div>
    </Layout>
  )
}