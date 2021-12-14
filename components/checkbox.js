import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function Checkbox(props){
  if (props.value){
    return (
      <FaCheckCircle size={props.size || 20} className="text-green-500" />
    )  
  }
  return (
    <FaTimesCircle size={props.size || 20} className="text-red-500" />
  )
}