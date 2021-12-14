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
                <div className="container w-100">
                    <form onSubmit={handleSubmit}>
                        <label className="block">
                            <h1 className="text-3xl font-bold text-purple-600 mb-4">Enter your zip code</h1>
                            <input
                                name="zipCode" required
                                type="text" className="form-input rounded mt-1 block w-full border border-gray-300 my-4" />
                        </label>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2  border rounded-full">Submit</button>
                    </form>
                </div>
            </main>
        </Layout>
    );
}
