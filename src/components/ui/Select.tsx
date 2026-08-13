import type { ReactNode, SelectHTMLAttributes } from 'react'

export function Select({label,hint,error,children,id,...props}:SelectHTMLAttributes<HTMLSelectElement>&{label?:string;hint?:string;error?:string;children:ReactNode}){
  const selectId=id||props.name
  return <label className={`field ui-select ${error?'has-error':''}`} htmlFor={selectId}>{label&&<span>{label}</span>}<select {...props} id={selectId} aria-invalid={Boolean(error)} aria-describedby={error?`${selectId}-error`:hint?`${selectId}-hint`:undefined}>{children}</select>{error?<small id={`${selectId}-error`} className="field-error">{error}</small>:hint&&<small id={`${selectId}-hint`}>{hint}</small>}</label>
}

