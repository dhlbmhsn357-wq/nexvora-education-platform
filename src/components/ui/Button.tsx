import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'

type ButtonVariant='primary'|'secondary'|'ghost'|'danger'
type ButtonSize='small'|'medium'

export function Button({children,variant='primary',size='medium',loading=false,className='',disabled,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{children:ReactNode;variant?:ButtonVariant;size?:ButtonSize;loading?:boolean}){
  return <button {...props} className={`button ${variant} ui-button-${size} ${className}`.trim()} disabled={disabled||loading} aria-busy={loading||undefined}>{loading&&<LoaderCircle className="ui-spinner" aria-hidden="true"/>}{children}</button>
}

