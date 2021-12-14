import Layout from "../components/Layout";

const tableStyle = {
    height: "100%",
    width: "100%",
    border: "1px solid #ccc"
};

export default function TheGrid() {
    const fakeData = [
        {
            name: "Product 1",
            price: "5",
        },
        {
            name: "Product 2",
            price: "2",
        },
        {
            name: "Product 3",
            price: "7",
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
            <table className="intertems-ce bg-transparent w-full border-collapse">
                <tbody>
                    <tr>
                        <th className="px-4 py-3 border">Product</th>
                        <th className="px-4 py-3 border">Pricing</th>
                    </tr>
                    {tableRows}
                </tbody>
            </table>
        </Layout>
    )
}
