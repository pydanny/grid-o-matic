import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";
import styles from "../styles/Home.module.css";
import { useRouter } from 'next/router'

import zipCodeToTdsp from "../lib/zipcodeToTdsp"


export default function Home() {
  const router = useRouter()

  function handleSubmit(event){ 
    event.preventDefault()
    const zipCode = event.target.zipCode.value
    if (zipCode in zipCodeToTdsp){
      router.push('/'+zipCode)
    }
  }

  function handleChange(event){ 
    // do nothing
  }  

  return (
    <Layout>
      <Head>
        <title>Octogrid</title>
        <meta name="description" content="Discover Octopus plans!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="text-3xl font-bold underline">
          Enter your zip code
        </h1>

        <form onSubmit={handleSubmit}>
          <label className="block">
              <span className="text-gray-700">Zip Code</span>
              <input
                name="zipCode" required
                type="text" className="form-input mt-1 block w-full" />
          </label>
          <input type="submit" value="Submit" />
          </form>
      </main>
    </Layout>
  );
}
