import { ImSpinner10 } from "react-icons/im";
import Styles from "../styles/Spinner.module.css"

export default function LoadingSpinner(props) {
    return (
        <div className="flex justify-center items-center space-x-2">
            <ImSpinner10 size={props.size || 40} color={props.color || "#e658f5"} className={Styles.spin} />
        </div>
    )
}