import { CONFIG } from "./config.js";

const KEY = "walletx_demo_state_v1";
const initialState = {
  name: "Demo User",
  balance: 12580,
  transactions: [
    { id: "TX-1003", title: "Sample cash-in", detail: "Today · Demo", amount: 500, type: "credit", status: "Completed" },
    { id: "TX-1002", title: "Sample transfer", detail: "Yesterday · Demo", amount: -200, type: "debit", status: "Completed" },
    { id: "TX-1001", title: "Demo wallet setup", detail: "Nov 20 · Demo", amount: 12280, type: "credit", status: "Completed" }
  ],
  pending: []
};
let state = loadState();
let balanceVisible = true;
const peso = n => "₱" + Number(n).toLocaleString("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2});
function loadState(){ try { return JSON.parse(localStorage.getItem(KEY)) || structuredClone(initialState); } catch { return structuredClone(initialState); } }
function saveState(){ localStorage.setItem(KEY, JSON.stringify(state)); }
function toast(message){ const el=document.querySelector("#toast"); el.textContent=message; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),2400); }
function render(){
  document.querySelector("#display-name").textContent=state.name;
  document.querySelector("#balance").textContent=balanceVisible?peso(state.balance):"••••••";
  const rows=state.transactions.slice(0,4).map(txRow).join("");
  document.querySelector("#recent-list").innerHTML=rows || emptyRows();
  document.querySelector("#all-list").innerHTML=state.transactions.map(txRow).join("") || emptyRows();
}
function txRow(tx){const positive=tx.amount>0;return `<div class="transaction"><div class="tx-icon">${positive?"↓":"↑"}</div><div class="tx-main"><b>${escapeHtml(tx.title)}</b><small>${escapeHtml(tx.detail)} · ${escapeHtml(tx.status)}</small></div><div class="tx-amount ${positive?"positive":"negative"}">${positive?"+":"−"}${peso(Math.abs(tx.amount))}</div></div>`;}
function emptyRows(){return '<div class="panel muted">No transactions yet.</div>';}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function navigate(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${page}`));document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("selected",b.dataset.page===page));window.scrollTo({top:0,behavior:"smooth"});}
document.addEventListener("click",e=>{const b=e.target.closest("[data-page]");if(b)navigate(b.dataset.page);});
document.querySelector("#toggle-balance").addEventListener("click",()=>{balanceVisible=!balanceVisible;document.querySelector("#toggle-balance").textContent=balanceVisible?"Hide":"Show";render();});
document.querySelector("#send-form").addEventListener("submit",e=>{
  e.preventDefault();
  const recipient=document.querySelector("#recipient").value.trim();
  const ref=document.querySelector("#recipient-ref").value.trim();
  const amount=Number(document.querySelector("#send-amount").value);
  const note=document.querySelector("#send-note").value.trim();
  if(!recipient||!ref||!Number.isFinite(amount)||amount<=0){toast("Please check the transfer details.");return;}
  if(amount>state.balance){toast("Insufficient demo balance.");return;}
  if(!confirm(`DEMO ONLY\\nSend ${peso(amount)} to ${recipient} (${ref})?\\nNo real money will move.`))return;
  state.balance-=amount;
  const tx={id:"LOCAL-"+Date.now(),title:"Demo transfer to "+recipient,detail:new Date().toLocaleString(),amount:-amount,type:"debit",status:"Pending sync",note};
  state.transactions.unshift(tx);state.pending.push({kind:"demo_transfer",transaction:tx});
  saveState();render();e.target.reset();navigate("home");toast("Demo transfer saved on this device.");
});
document.querySelector("#copy-reference").addEventListener("click",async()=>{try{await navigator.clipboard.writeText("WX-DEMO-001");toast("Demo reference copied.");}catch{toast("Reference: WX-DEMO-001");}});
document.querySelector("#load-demo").addEventListener("click",()=>toast("Demo preview only. No mobile load was purchased."));
document.querySelector("#notifications-btn").addEventListener("click",()=>toast("You are all caught up."));
document.querySelector("#export-btn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="walletx-demo-backup.json";a.click();URL.revokeObjectURL(url);});
document.querySelector("#reset-btn").addEventListener("click",()=>{if(confirm("Reset all WalletX demo data on this device?")){state=structuredClone(initialState);saveState();render();toast("Demo wallet reset.");}});
document.querySelector("#sync-btn").addEventListener("click",syncPending);
async function syncPending(){
  if(!state.pending.length){toast("There is no pending activity to sync.");return;}
  if(CONFIG.DEMO_MODE||!CONFIG.API_BASE_URL){toast("Backend is not configured. Your data remains safely on this device.");return;}
  // Replace this endpoint with a deployed Base44 server function.
  // The server must authenticate the user, validate the request, and prevent duplicate processing.
  try{
    const response=await fetch(`${CONFIG.API_BASE_URL}/syncDemoActivity`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({items:state.pending})
    });
    if(!response.ok)throw new Error("Sync request failed");
    state.pending=[];state.transactions=state.transactions.map(t=>({...t,status:t.status==="Pending sync"?"Synced":t.status}));
    saveState();render();toast("Demo activity synced.");
  }catch(err){toast("Sync failed. Pending activity is still saved locally.");}
}
window.addEventListener("online",()=>{document.querySelector("#connection-pill").textContent="● Online";});
window.addEventListener("offline",()=>{document.querySelector("#connection-pill").textContent="● Offline";});
document.querySelector("#connection-pill").textContent=navigator.onLine?"● Online":"● Offline";
render();