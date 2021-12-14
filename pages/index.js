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

        <form onSubmit={handleSubmit}>
          <label className="block">
              <h1 className="text-3xl font-bold underline">Enter your zip code</h1>
              <input
                name="zipCode" required
                type="text" className="form-input mt-1 block w-full" />
          </label>
          <button
            className="text-color-white-500 rounded-full bg-violet-500 hover:bg-violet-400 active:bg-violet-600 focus:outline-none focus:ring focus:ring-violet-300" type="submit" value="Submit">Submit</button>
        </form>
      </main>
    </Layout>
  );
}
