import React,{useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {CreditCard,LockKeyhole} from "lucide-react";
import {djangoApi,errorMessage} from "../api";
import {Alert} from "../components/UI";
export default function Login(){
 const [form,setForm]=useState({username:"",password:""}),[error,setError]=useState(""),[busy,setBusy]=useState(false);const nav=useNavigate();
 const submit=async e=>{e.preventDefault();setBusy(true);setError("");try{const {data}=await djangoApi.post("/api/login/",form);localStorage.setItem("access",data.access);localStorage.setItem("refresh",data.refresh);localStorage.setItem("username",form.username);nav("/");}catch(e){setError(errorMessage(e));}finally{setBusy(false)}};
 return <div className="auth-page"><div className="auth-card"><div className="auth-brand"><span className="brand-mark"><CreditCard/></span><b>Card<span className="blue">Pay</span></b></div><span className="eyebrow">WELCOME BACK</span><h1>Sign in to your account</h1><p className="muted">Access your secure payment workspace.</p><Alert>{error}</Alert><form onSubmit={submit}><label>Username<input required autoComplete="username" value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder="Enter username"/></label><label>Password<input required type="password" autoComplete="current-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter password"/></label><button className="primary full" disabled={busy}>{busy?"Signing in…":"Sign in"} <LockKeyhole size={17}/></button></form><p className="auth-foot">New to CardPay? <Link to="/register">Create an account</Link></p><p className="safe-note">Demo simulator only · Do not enter real card details</p></div></div>;
}