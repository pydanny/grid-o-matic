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

function getMoreProductDetailsByTDSP(TDSP) {
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
      rates(serviceProvider:${TDSP}){
        agnosticRates{
          consumptionRates{
            pricePerUnit
            band
            serviceProvider
            loadZone
            timeOfUse
          }
        }
        loadZoneRates{
          consumptionRates{
            pricePerUnit
            band
            serviceProvider
            loadZone
            timeOfUse
          }
        }
        tdspRates{
          consumptionRates{
            unitType
            pricePerUnit
            band
            serviceProvider
            loadZone
            timeOfUse
          }
          standingRates{
            unitType
            pricePerUnit
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

  const productFields = [
    ["", "displayName"],
    ["Rate", "rates"],
    ["Term", "term"],
    ["Description", "description"],
    ["Prepay", "prepay"],
  ]

  // const text = getProductRatesUsingTDSP(TDSP)
  // const {data, error} = useSWR(
  //     text,
  //     fetcher
  // )

  // Toggle me to see a different query
  const possibly_better_text = getMoreProductDetailsByTDSP(TDSP)
  const {data, error} = useSWR(
      possibly_better_text,
      fetcher
  )

  const rateTable = () => {
    if (error) return <div>Oops!</div>
    if (!data) {
      return <LoadingSpinner />
    } else {
      console.log(data)
      const products = data.products
      // console.log(products)

      const stylizeProductName = (productName) => {
        if (productName.indexOf("Octopus") > -1) {
          return(<span><strong>Octopus</strong>{productName.replace("Octopus", "")}</span>)
        } else if (productName.indexOf("Octo") > -1) {
          return(<span><strong>Octo</strong>{productName.replace("Octo", "")}</span>)
        } else {
          return productName
        }
      }

      const headerCols = () => {
        return productFields.map((productPair, index) => {
          return(<th key={`header-${productPair[0]}`}>{productPair[0]}&nbsp;</th>)
        })
      }

      const getProductCols = (product) => {
        return productFields.map((productPair, index) => {
          if (productPair[1] == "rates") {
            const loadZoneRate = parseFloat(product.rates.loadZoneRates.consumptionRates[0].pricePerUnit);
            const tdspConsumptionRate = parseFloat(product.rates.tdspRates.consumptionRates[0].pricePerUnit);
            const standingRate = parseFloat(product.rates.tdspRates.standingRates[0].pricePerUnit/1000);
            const calculatedRate = loadZoneRate + tdspConsumptionRate + standingRate;

            return(<td key={productPair[0]-index}>{calculatedRate.toFixed(1).split(".0")[0]}&#162;</td>)
          } else if (productPair[1] == "displayName") {
            return(<td key={productPair[0]-index} className='whitespace-nowrap'>{stylizeProductName(product[productPair[1]])}</td>)
          } else {
            return(<td key={productPair[0]-index}>{product[productPair[1]]}</td>)
          }
        })
      }

      const productRows = () => {
        return products.map((product, index) => {
          return(<tr key={`product-${product.id}-${index}`}>{getProductCols(product)}</tr>)
        })
      }

      return (
          <div>
            <p className="text-center text-2xl pb-4">Showing plans available in {zipCode}</p>
            <div className="overflow-x-auto rounded-md">
              <table className="table-auto rounded table-transpose">
                <tbody>
                <tr className="rounded">{headerCols()}</tr>
                {productRows()}
                </tbody>
              </table>
            </div>
          </div>
      )
    }
  }

  return (
      <Layout>
        <Head>
         <link
          rel="apple-touch-icon"
            sizes="180x180"
            href="/branding/favicons/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/branding/favicons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/branding/favicons/favicon-16x16.png"
          />
          <link
            rel="mask-icon"
            href="/branding/favicons/safari-pinned-tab.svg"
            color="#f050f8"
          />            
        </Head>

        <div>
          <h1 className="text-center text-4xl text-bold text-purple-800 font-bold my-4">The Octo Grid</h1>

          { rateTable() }
        </div>
      </Layout>
  )
}