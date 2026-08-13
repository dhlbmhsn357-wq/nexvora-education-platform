import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'

export const Input=forwardRef<HTMLInputElement,InputHTMLAttributes<HTMLInputElement>&{label?:string;hint?:string;error?:string;leading?:ReactNode}>(({label,hint,error,leading,className='',id,...props},ref)=>{
  const inputId=id||props.name
  return <label className={`field ui-input ${error?'has-error':''}`} htmlFor={inputId}>{label&&<span>{label}</span>}<span className="input-control">{leading}{<input {...props} ref={ref} id={inputId} className={className} aria-invalid={Boolean(error)} aria-describedby={error?`${inputId}-error`:hint?`${inputId}-hint`:undefined}/>}</span>{error?<small id={`${inputId}-error`} className="field-error">{error}</small>:hint&&<small id={`${inputId}-hint`}>{hint}</small>}</label>
})
Input.displayName='Input'

