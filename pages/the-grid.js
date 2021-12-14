import Layout from "../components/Layout";

    const tableStyle = {
        height: "100%",
        width: "100%",
        border: "1px solid #ccc"
    };

    const theadStyle = {
        backgroundColor: "#6018c8"
    }

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
                <td className="px-4 py-3 border">{product.name}</td>
                <td className="px-4 py-3 border">{product.price}</td>
            </tr>
        )
    })


    return(
        <Layout>
            <h1 className="text-center">The Octo Grid</h1>
            <table className="intertems-ce bg-transparent w-full border-collapse">
                <thead>
                    <tr className="text-white" style={theadStyle}>
                        <th className="px-4 py-3 border">Product</th>
                        <th className="px-4 py-3 border">Pricing</th>
                    </tr>
                </thead>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        </Layout>
    )
}
