import { gql, GraphQLClient } from "graphql-request";
import Layout from "../components/Layout";
import { useState, useEffect } from 'react';

const url = 'https://api.oeus-kraken.energy/v1/graphql/'

const GraphQL = (token) => {
  return new GraphQLClient(url);
};

// Plans objectc
const graphQlRequest = class {
  // Get Plans by zipcode
  getProductsByZip = async (zipcode) => {
    return await new Promise(async (resolve, reject) => {
      const client = GraphQL();
      const query = gql`
        query getTdspRatesBy($esiId: String, $serviceProvider: ServiceProvider, $postcode: String) {
          products {
            id
            displayName
            code
            basedOnTimeOfUse
            prepay
            rates(esiId: $esiId, postcode: $postcode, serviceProvider: $serviceProvider) {
              tdspRates {
                consumptionRates {
                  serviceProvider
                  loadZone
                  pricePerUnit
                  unitType
                  efls {
                    serviceProvider
                    url
                    language
                    __typename
                  }
                  __typename
                }
                standingRates {
                  serviceProvider
                  pricePerUnit
                  __typename
                }
                __typename
              }
              loadZoneRates {
                consumptionRates {
                  serviceProvider
                  loadZone
                  pricePerUnit
                  unitType
                  timeOfUse
                  __typename
                }
                __typename
              }
              __typename
            }
            __typename
          }
        }`

      await client
        .request(query, {
          postcode: zipcode,
        })
        .then((result) => {
          return resolve(result);
        })
    });
  };
};

async function getResult(){
  return await new graphQlRequest().getProductsByZip(77494);
}

export default function Grid(){
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)

  const getProducts = () => {
    setData(getResult())
  }

  useEffect(() => {
    getResult().then( results => {
      setData(results.products)
    })
  }, [])


  if (!data) {
    getProducts()
  } else {
    console.log(data);
  }

  return (
    <Layout>
      <div>
        <h1>Hello, World</h1>
        <p>12345</p>
      </div>
    </Layout>
  )
}