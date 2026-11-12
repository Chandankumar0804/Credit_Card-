import React from "react";
import {Wallet} from "lucide-react";
export function PageHeading({eyebrow,title,subtitle,action}) {return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p className="muted">{subtitle}</p></div>{action}</div>}
export function Alert({children}) {return children?<div className="alert error">{children}</div>:null}
export function Empty({text}) {return <div className="empty"><div className="empty-icon"><Wallet/></div><p>{text}</p></div>}
export function Status({value}) {const s=String(value||"PENDING").toUpperCase();return <span className={`status ${s.toLowerCase()}`}>{s}</span>}
export function Stat({icon:Icon,label,value}) {return <div className="stat-card"><div className="stat-icon"><Icon size={20}/></div><span>{label}</span><strong>{value}</strong></div>}