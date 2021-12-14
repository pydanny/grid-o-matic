import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import { request, gql } from 'graphql-request'

import Checkbox from "../components/checkbox";
import Layout from "../components/layout";
import tdspToLoaDZone from '../lib/utils.js'



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

export default function Grid(){

  const text = getProductRatesUsingTDSP("CENTERPOINT")
  let { data, error } = useSWR(
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