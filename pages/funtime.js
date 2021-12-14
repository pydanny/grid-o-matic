import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react';

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



function getTDSPByZipCode(zipCode){
  const text = `query getTDSPByPostalcode{
    tdspByPostalcode(postalCode:"${zipCode}"){
        loadZone
        serviceProvider
      }
    }`
    return text
}

function getProductRatesUsingLoadZone(loadZone){
  const text = `query getRatesUsingLoadZone{
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
  return text
}

export default function Grid(){
  const [tdsps, setTdsps] = useState()

  const text = getTDSPByZipCode(77002)
  console.log(text)
  let { data, error } = useSWR(
    text,
    fetcher
  )
  
  if (error) return <div>Oops!</div>
  if (!data) return <div>Loading...</div>   
  
  
  data, error = { data, error } = useSWR(
    text,
    fetcher
  )
  if (error) return <div>Oops!</div>
  if (!data) return <div>Loading...</div>   
  console.log(data)  

  return (
    <Layout>
      <div>
        <h1>Hello, World</h1>
        <p>12345</p>
      </div>
    </Layout>
  )
}