import { CheckCircle2, X } from 'lucide-react'

export function Toast({message,onClose}:{message:string;onClose?:()=>void}){
  return <div className="toast" role="status"><CheckCircle2 aria-hidden="true"/><span>{message}</span>{onClose&&<button className="icon-button" aria-label="إغلاق الرسالة" onClick={onClose}><X/></button>}</div>
}

