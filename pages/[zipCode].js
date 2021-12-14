import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

import useSWR from 'swr'
import { request, gql } from 'graphql-request'

import Checkbox from "../components/checkbox";
import Layout from "../components/layout";
import zipCodeToTdsp from "../lib/zipcodeToTdsp"
import LoadingSpinner from "../components/loading-spinner";

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

const darkSquare = {
  backgroundColor: "#6b21a8"
}


export default function Grid(){
  const router = useRouter()
  const { zipCode } = router.query

  const TDSP = zipCodeToTdsp[zipCode]

  const text = getProductRatesUsingTDSP(TDSP)
  const {data, error} = useSWR(
      text,
      fetcher
  )

  const rateTable = () => {
    if (error) return <div>Oops!</div>
    if (!data) {
      return <LoadingSpinner />
    } else {
      console.log(data)
      const productData = data.productsWithConciseApplicableRates

      const productNames = productData.map(product => product.displayName)
      const productIds = productData.map(product => product.id)
      const products = productsToObject(productData)
      console.log(products)

      const stylizeProductName = (productName) => {
        if (productName.indexOf("Octopus") > -1) {
          return(<span><strong>Octopus</strong>{productName.replace("Octopus", "")}</span>)
        } else if (productName.indexOf("Octo") > -1) {
          return(<span><strong>Octo</strong>{productName.replace("Octo", "")}</span>)
        } else {
          return productName
        }
      }

      return (
          <div>
            <p className="text-center text-2xl pb-4">Showing plans available in {zipCode}</p>
            <div className="overflow-x-auto rounded-md">
              <table className="table-auto border rounded border-purple-600">
                <tbody>
                <tr className="border text-white border-purple-600">
                  <th style={darkSquare}></th>
                  {productNames.map((name) => (
                      <th key={name} className="whitespace-nowrap px-4">{stylizeProductName(name)}</th>
                  ))}
                </tr>
                <tr>
                  <th className="px-4">Prepay</th>
                  {productIds.map((id) => (
                      <td key={id}><Checkbox value={products[id].prepay} /></td>
                  ))
                  }
                </tr>

                <tr>
                  <th className="px-4">Term</th>
                  {productIds.map((id) => (
                      <td key={id}>{products[id].term} months</td>
                  ))
                  }
                </tr>
                <tr>
                  <th className="px-4">Description</th>
                  {productIds.map((id) => (
                      <td key={id}>{products[id].description}</td>
                  ))
                  }
                </tr>
                <tr>
                  <th className="px-4">Rates</th>
                  {productIds.map((id) => (
                      <td key={id}>{products[id].rates[0].totalApplicableRate}</td>
                  ))
                  }
                </tr>
                </tbody>
              </table>
            </div>
          </div>
      )
    }
  }

  return (
      <Layout>
        <div>
          <h1 className="text-center text-4xl text-bold text-purple-800 font-bold my-4">The Octo Grid</h1>

          { rateTable() }
        </div>
      </Layout>
  )
}