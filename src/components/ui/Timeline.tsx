import type { ReactNode } from 'react'

export type TimelineEntry={id:string;title:string;description?:string;meta?:string;icon?:ReactNode}
export function Timeline({items}:{items:TimelineEntry[]}){
  return <ol className="ui-timeline">{items.map(item=><li key={item.id}>{item.icon&&<span className="timeline-icon">{item.icon}</span>}<div><strong>{item.title}</strong>{item.description&&<p>{item.description}</p>}{item.meta&&<small>{item.meta}</small>}</div></li>)}</ol>
}

