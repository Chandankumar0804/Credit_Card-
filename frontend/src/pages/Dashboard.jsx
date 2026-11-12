import React,{useEffect,useState} from "react";
import {CreditCard,Activity,CheckCircle2,ArrowUpRight} from "lucide-react";
import {djangoApi,errorMessage,rows} from "../api";
import {PageHeading,Stat,Status,Empty,Alert} from "../components/UI";
export default function Dashboard(){
 const [cards,setCards]=useState([]),[tx,setTx]=useState([]),[error,setError]=useState("");
 useEffect(()=>{Promise.all([djangoApi.get("/api/cards/"),djangoApi.get("/api/transactions/")]).then(([c,t])=>{setCards(rows(c.data));setTx(rows(t.data));}).catch(e=>setError(errorMessage(e)));},[]);
 const success=tx.filter(t=>String(t.status).toUpperCase()==="SUCCESS").length;
 return <><PageHeading eyebrow="OVERVIEW" title="Your dashboard" subtitle="A quick look at your payment activity." action={<span className="live-pill"><i/> API workspace</span>}/><Alert>{error}</Alert><div className="stats-grid"><Stat icon={CreditCard} label="Saved cards" value={cards.length}/><Stat icon={Activity} label="Transactions" value={tx.length}/><Stat icon={CheckCircle2} label="Successful payments" value={success}/></div><div className="panel"><div className="panel-head"><div><h2>Recent transactions</h2><p className="muted">Your latest payment activity</p></div><a className="text-link" href="/transactions">View all <ArrowUpRight size={15}/></a></div>{tx.length?<div className="table-wrap"><table><thead><tr><th>PAYMENT ID</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></tr></thead><tbody>{tx.slice(0,6).map((t,i)=><tr key={t.id||i}><td className="mono">{t.payment_id||t.id}</td><td>₹{t.amount}</td><td><Status value={t.status}/></td><td>{t.created_at?new Date(t.created_at).toLocaleDateString():"—"}</td></tr>)}</tbody></table></div>:<Empty text="No transactions yet. Your payments will appear here."/>}</div></>;
}