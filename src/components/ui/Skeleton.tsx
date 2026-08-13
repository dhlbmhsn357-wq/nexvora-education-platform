export function Skeleton({lines=1}:{lines?:number}){
  return <div className="skeleton-stack" role="status" aria-label="جارٍ تحميل المحتوى">{Array.from({length:lines},(_,index)=><span className="ui-skeleton" key={index}/>)}</div>
}

