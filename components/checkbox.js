import { GoCheck, GoX } from 'react-icons/go';

export default function Checkbox(props){
  if (props.value){
    return (
      <GoCheck size={props.size || 20} className="text-green-500" />
    )  
  }
  return (
    <GoX size={props.size || 20} className="text-red-500" />
  )
}