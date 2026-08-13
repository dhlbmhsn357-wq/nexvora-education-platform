import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export class ErrorBoundary extends Component<{children:ReactNode},{failed:boolean}> {
  state={failed:false}
  static getDerivedStateFromError(){return{failed:true}}
  componentDidCatch(error:Error,info:ErrorInfo){console.error('NEXVORA UI boundary',error,info)}
  render(){
    if(this.state.failed)return <main className="error-boundary"><section className="panel" role="alert"><AlertTriangle/><h1>تعذر عرض هذه الشاشة</h1><p>حدث خطأ محلي أثناء تجهيز الواجهة. بيانات العرض محفوظة؛ أعد تحميل الشاشة للمحاولة مرة أخرى.</p><button className="button primary" onClick={()=>window.location.reload()}><RotateCcw/>إعادة تحميل الشاشة</button></section></main>
    return this.props.children
  }
}
