import { gql, GraphQLClient } from "graphql-request";
import Layout from "../components/Layout";


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
        query getTdspRates($postcode: String!) {
          products {
            id
            displayName
            code
            basedOnTimeOfUse
            rates(postcode: $postcode) {
              tdspRates {
                consumptionRates {
                  serviceProvider
                  pricePerUnit
                  unitType
                  efls {
                    serviceProvider
                    url
                    language
                  }
                }
                standingRates {
                  serviceProvider
                  pricePerUnit
                }
              }
              loadZoneRates {
                consumptionRates {
                  serviceProvider
                  loadZone
                  pricePerUnit
                  unitType
                  timeOfUse
                }
              }
            }
          }
        }
      `;

      await client
        .request(query, {
          postcode: zipcode,
        })
        .then((data) => {
          return resolve(data);
        })
        .catch((error) => {
          return reject(error);
        });
    });
  };
};  

async function getResult(){
  let result = await new graphQlRequest().getProductsByZip(77002);
  return result
}

export default function Grid(){
  const data = getResult(77002)
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