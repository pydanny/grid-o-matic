import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react';

import useSWR from 'swr'
import { request, gql } from 'graphql-request'

import Checkbox from "../components/checkbox";
import Layout from "../components/layout";
import zipCodeToTdsp from "../lib/zipcodeToTdsp"
import LoadingSpinner from "../components/loading-spinner";


import TriangleAccent from '../public/triangle.png'

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
  const [showPrepay, setShowPrepay] = useState(false)

  const TDSP = zipCodeToTdsp[zipCode]

  const productFields = [
    ["", "displayName"],
    ["", "accent"],
    ["Rate", "rates"],
    ["Solar Buyback", "solar"],
    ["Credit Check Needed", "prepay"],
    ["Term", "term"],
    ["Description", "description"],
    ["Get Started", "getStarted"]
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

  const validProductCode = [
    // "OCTOPUS-MONTH-TO-MONTH",
    // "OCTOPUS-EXTRA-90-DAY-FIXED",
    // "OCTOPLUS-90-DAY-FIXED",
    "OCTOPUS-EXTRA-365-DAY-FIXED", // Prime
    "OCTOPUS-DRIVE-365-DAY-FIXED",
    "OCTOGO-12M",
    // "OCTOGO-30-DAY-FIXED",
    // "OCTOGO-90-DAY-FIXED",
    // "OCTOGO-365-DAY-FIXED",
    // "OCTOGO-MTM-FIXED",
    "OCTOPLUS-24M",
    "OCTOPLUS-12M",
    "OCTOPLUS-36M"
  ]

  const noSolar = [
    "OCTOPUS-DRIVE-365-DAY-FIXED",
  ]

  const rateTable = () => {
    if (error) return <div>Oops!</div>
    if (!data) {
      return <LoadingSpinner />
    } else {
      console.log(data)
      const products = data.products

      const filteredProducts = products.filter(product => {
        return (validProductCode.includes(product.code) && product.prepay === showPrepay)
      })

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
          if (productPair[0]) {
            return(<th key={`header-${productPair[0]}`}>{productPair[0]}&nbsp;</th>)
          } else if (productPair[1] === "accent") {
            return(<th key={`header-${productPair[1]}`} className="accentCell">&nbsp;</th>)
          } else {
            return(<th key={`header-${productPair[1]}`}>&nbsp;</th>)
          }
        })
      }

      const getProductCols = (product) => {
        return productFields.map((productPair, index) => {
          if (productPair[1] == "rates") {
            const loadZoneRate = parseFloat(product.rates.loadZoneRates.consumptionRates[0].pricePerUnit);
            const tdspConsumptionRate = parseFloat(product.rates.tdspRates.consumptionRates[0].pricePerUnit);
            const standingRate = parseFloat(product.rates.tdspRates.standingRates[0].pricePerUnit/1000);
            const calculatedRate = loadZoneRate + tdspConsumptionRate + standingRate;
            const priceAsString = calculatedRate.toFixed(1).split(".0")[0];

            return(<td key={productPair[0] + "-" + index}><span className="font-bold text-xl">{priceAsString}</span>&#162; per kWh</td>)
          } else if (productPair[1] === "displayName") {
            return(<td key={productPair[0] + "-" + index} className='whitespace-nowrap productCell'>{stylizeProductName(product[productPair[1]])}</td>)
          } else if (productPair[1] === "prepay") {
            return(<td key={productPair[0] + "-" + index}><Checkbox value={product[productPair[1]]} size="30" /></td>)
          } else if (productPair[1] === "term") {
            return(<td key={productPair[0] + "-" + index}>{product[productPair[1]]}-month</td>)
          } else if (productPair[1] === "solar") {
            return(<td key={productPair[0] + "-" + index}><Checkbox value={!noSolar.includes(product.code)} size="30" /></td>)
          } else if (productPair[1] === "getStarted") {
            return(<td key={productPair[0] + "-" + index}>{getSignUpButton(product)}</td>)
          }  else if (productPair[1] === "accent") {
            return(<td key={productPair[1] + "-" + index} className="accentCell">
              <Image src={TriangleAccent} className="triangleAccent" />
            </td>)
          } else {
            return(<td key={productPair[0] + "-" + index}>{product[productPair[1]]}</td>)
          }
        })
      }

      const productRows = () => {
        return filteredProducts.map((product, index) => {
          return(<tr key={`product-${product.id}-${index}`}>{getProductCols(product)}</tr>)
        })
      }

      const handlePrepayToggle = (e) => {
        e.preventDefault();
        setShowPrepay(!showPrepay);
      }

      const prepayProductToggleButton = () => {
        return (
            <button
                className="text-white text-sm px-4 py-2 border rounded-full mx-2 mb-4 bg-fuchsia-500 hover:bg-fuchsia-600 border-0"
                onClick={handlePrepayToggle}
            >
              Show Plans That {(!showPrepay) ? "Do Not" : ""} Require Credit Check</button>
        )
      }

      const getSignUpButton = (product) => {
        return(
            <a className="bg-fuchsia-500 hover:bg-fuchsia-600 text-white px-4 py-1 rounded" href={`https://octopusenergy.com/quick-start?krakenid=${product.id}&zipcode=${zipCode}`}>Get Started</a>

        )
      }

      return (
          <div>
            <p className="text-center text-2xl pb-4 text-gray-200">Showing plans available in {zipCode}</p>
            <div className="text-center mb-3">
              {prepayProductToggleButton()}
            </div>
            <div className="overflow-x-auto rounded-md pb-8">
              <table className="table-auto table-transpose">
                <tbody>
                <tr>{headerCols()}</tr>
                {productRows()}
                </tbody>
              </table>
            </div>
          </div>
      )
    }
  }

  return (
      <div>
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
            <h1 className="text-center text-4xl text-bold text-cyan-300 font-bold my-4">Octo Grid</h1>

            { rateTable() }
          </div>
        </Layout>
        <style jsx global>{`
        body {
          background-color: #190648;
        }
      `}</style>
      </div>
  )
}