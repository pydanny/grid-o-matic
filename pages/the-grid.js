import styles from "../styles/TheGrid.module.css";

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
            <tr>
                <td>{product.name}</td>
                <td>{product.price}</td>
            </tr>
        )
    })


    return(
        <table className="table-auto hover:table-fixed">
            <tbody>
                <tr>
                    <th>Product</th>
                    <th>Pricing</th>
                </tr>
                {tableRows}
            </tbody>
        </table>
    )
    }
