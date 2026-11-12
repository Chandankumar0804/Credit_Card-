import React, {useState} from "react";
import {Routes,Route,Navigate,NavLink,useNavigate} from "react-router-dom";
import {CreditCard,LayoutDashboard,Wallet,History,LogOut,Menu,X,ShieldCheck} from "lucide-react";
import {djangoApi} from "./api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Cards from "./pages/Cards";
import Payments from "./pages/Payments";
import Transactions from "./pages/Transactions";

function Protected({children}) { return localStorage.getItem("access") ? children : <Navigate to="/login" replace/>; }
function Layout({children}) {
 const [open,setOpen]=useState(false); const nav=useNavigate();
 const logout=async()=>{const refresh=localStorage.getItem("refresh");try{if(refresh)await djangoApi.post("/api/logout/",{refresh});}catch(e){}localStorage.removeItem("access");localStorage.removeItem("refresh");localStorage.removeItem("username");nav("/login");};
 const links=[["/","Overview",LayoutDashboard],["/cards","My cards",CreditCard],["/payments","Make payment",Wallet],["/transactions","Transactions",History]];
 return <div className="app-shell">
  <aside className={`sidebar ${open?"open":""}`}><div className="brand"><span className="brand-mark"><CreditCard/></span><span>Card<span className="blue">Pay</span></span><button className="mobile-close" onClick={()=>setOpen(false)}><X/></button></div>
   <p className="nav-caption">WORKSPACE</p><nav>{links.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==="/"} onClick={()=>setOpen(false)}><Icon size={18}/>{label}</NavLink>)}</nav>
   <div className="sidebar-bottom"><div className="secure-box"><ShieldCheck size={18}/><span><b>Secure session</b><small>JWT authentication</small></span></div><button className="logout-btn" onClick={logout}><LogOut size={17}/> Sign out</button></div>
  </aside>{open&&<div className="scrim" onClick={()=>setOpen(false)}/>}
  <main className="main-area"><header className="topbar"><button className="mobile-menu" onClick={()=>setOpen(true)}><Menu/></button><div><small>PAYMENT WORKSPACE</small><b>Credit Card Payment System</b></div><div className="user"><span className="avatar">{(localStorage.getItem("username")||"U")[0].toUpperCase()}</span><span>{localStorage.getItem("username")||"User"}</span></div></header><section className="content">{children}</section></main>
 </div>;
}
function Page({children}) {return <Protected><Layout>{children}</Layout></Protected>}
export default function App(){return <Routes>
 <Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
 <Route path="/" element={<Page><Dashboard/></Page>}/><Route path="/cards" element={<Page><Cards/></Page>}/><Route path="/payments" element={<Page><Payments/></Page>}/><Route path="/transactions" element={<Page><Transactions/></Page>}/>
 <Route path="*" element={<Navigate to="/" replace/>}/>
 </Routes>}