import Layout from "../components/Layout";

export default function TheGrid() {
    const fakeData = [
        {
            name: "Product 1",
            price: "5 monies",
        },
        {
            name: "Product 2",
            price: "2 monies",
        },
        {
            name: "Product 3",
            price: "7 monies",
        }
    ]

    const tableRows = fakeData.map((product, index) => {
        return(
            <tr key={index}>
                <td className="px-4 py-3 border border-purple-700">{product.name}</td>
                <td className="px-4 py-3 border border-purple-700">{product.price}</td>
            </tr>
        )
    })


    return(
        <Layout>
            <h1 className="text-center text-4xl text-bold text-purple-700 font-bold my-6">The Octo Grid</h1>
            <table className="bg-transparent w-full border-collapse">
                <thead>
                    <tr className="text-white bg-purple-800">
                        <th className="px-4 py-3">Product</th>
                        <th className="px-4 py-3">Pricing</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </Layout>
    )
}
