import Layout from "../components/layout";

export default function TheGrid() {
    const fakeData = [
        {
            name: "Product 1",
            rate: "5 monies",
            solar: "Yes",
            noCreditCheck: "Nope",
            term: 60,
            extras: "No cancellation fee"
        },
        {
            name: "Product 2",
            rate: "5 monies",
            solar: "No",
            noCreditCheck: "Nope",
            term: 60,
            extras: "No cancellation fee"
        },
        {
            name: "Product 3",
            rate: "5 monies",
            solar: "Yes",
            noCreditCheck: "Yep",
            term: 60,
            extras: "No cancellation fee"
        }
    ]

    const tableRows = fakeData.map((product, index) => {
        return(
            <tr key={index}>
                <td className="px-4 py-3 ">{product.name}</td>
                <td className="px-4 py-3">{product.rate}</td>
                <td className="px-4 py-3">{product.solar}</td>
                <td className="px-4 py-3">{product.noCreditCheck}</td>
                <td className="px-4 py-3">{product.term}</td>
                <td className="px-4 py-3">{product.extras}</td>
            </tr>
        )
    })


    return(
        <Layout>
            <h1 className="text-center text-4xl text-bold text-purple-700 font-bold my-6">The Octo Grid</h1>
            <table className="bg-transparent w-full border-collapse table-transpose">
                <tbody>
                    <tr className="text-white bg-purple-800">
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Pricing</th>
                        <th className="px-4 py-3 text-left">Solar</th>
                        <th className="px-4 py-3 text-left">No Credit Check</th>
                        <th className="px-4 py-3 text-left">Term</th>
                        <th className="px-4 py-3 text-left">Extras</th>
                    </tr>
                    {tableRows}
                </tbody>
            </table>
        </Layout>
    )
}
