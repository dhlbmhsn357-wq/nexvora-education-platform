import type { ButtonHTMLAttributes, HTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export type ButtonVariant = 'primary'|'secondary'|'ghost'|'danger'
export type ButtonSize = 'small'|'medium'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{variant?:ButtonVariant;size?:ButtonSize;loading?:boolean;icon?:ReactNode}
export function Button({variant='primary',size='medium',loading=false,icon,children,className='',disabled,...props}:ButtonProps){return <button {...props} className={`button ${variant} ui-button-${size} ${className}`} disabled={disabled||loading} aria-busy={loading||undefined}>{loading?<span className="ui-spinner" aria-hidden="true"/>:icon}{children}</button>}

export interface FieldProps{label:string;hint?:string;error?:string;required?:boolean;children:ReactNode;className?:string}
export function Field({label,hint,error,required,children,className=''}:FieldProps){return <label className={`field ${className}`}><span>{label}{required&&<b aria-hidden="true"> *</b>}</span>{children}{hint&&!error&&<small>{hint}</small>}{error&&<small className="field-error" role="alert">{error}</small>}</label>}

export const Input=(props:InputHTMLAttributes<HTMLInputElement>)=><input {...props}/>
export const Textarea=(props:TextareaHTMLAttributes<HTMLTextAreaElement>)=><textarea {...props}/>
export const Select=({children,...props}:SelectHTMLAttributes<HTMLSelectElement>)=><select {...props}>{children}</select>

export interface PanelProps extends HTMLAttributes<HTMLElement>{title?:string;description?:string;action?:ReactNode;children:ReactNode}
export function Panel({title,description,action,children,className='',...props}:PanelProps){return <section {...props} className={`panel ${className}`}>{(title||description||action)&&<header className="section-title"><div>{title&&<h3>{title}</h3>}{description&&<p>{description}</p>}</div>{action}</header>}{children}</section>}

export function Skeleton({label='جارٍ تحميل المحتوى',className=''}:{label?:string;className?:string}){return <span className={`ui-skeleton ${className}`} role="status" aria-label={label}/>} 

export function VisuallyHidden({children}:{children:ReactNode}){return <span className="sr-only">{children}</span>}
