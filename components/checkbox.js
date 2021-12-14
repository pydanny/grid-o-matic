import { FaCheck, FaTimesCircle } from 'react-icons/fa';

export default function Checkbox(boolean){
  if (boolean === true){
    return (
      <FaCheck className="text-green-500" />
    )  
  }
  return (
    <FaTimesCircle className="text-red-500" />
  )
}