const STATUS={available:"대여 가능",rented:"대여 중",preparing:"준비 중"};
const $=id=>document.getElementById(id);
let site={},dresses=[],filter={status:"",size:"",color:""};

const won=n=>n.toLocaleString("ko-KR")+"원";
function photo(d,el){
  if(d.image){el.style.backgroundImage=`url("${d.image}")`;}
  else{el.style.background=`linear-gradient(160deg,${d.colorHex||"#ddd"},#fff)`;el.insertAdjacentHTML('beforeend','<span class="lbl">사진 준비 중</span>');}
}
function render(){
  const list=dresses.filter(d=>(!filter.status||d.status===filter.status)&&(!filter.size||d.size===filter.size)&&(!filter.color||d.color===filter.color));
  $("grid").innerHTML="";
  list.forEach(d=>{
    const b=document.createElement("button");b.className="card";
    b.innerHTML=`<div class="ph"><span class="badge b-${d.status}">${STATUS[d.status]}</span></div><div class="meta"><h3></h3><p></p></div>`;
    photo(d,b.querySelector(".ph"));
    b.querySelector("h3").textContent=d.name;
    b.querySelector("p").textContent=`${d.size} · ${d.color} · ${won(d.price)}`;
    b.onclick=()=>openModal(d);
    $("grid").appendChild(b);
  });
  $("count").textContent=`드레스 ${list.length}벌`;
  $("empty").hidden=list.length>0;
}
function openModal(d){
  const ph=$("mPhoto");ph.style.cssText="";ph.innerHTML="";photo(d,ph);
  $("mName").textContent=d.name;
  const bd=$("mBadge");bd.className=`badge b-${d.status}`;bd.textContent=STATUS[d.status];
  const rows=[["사이즈",d.size],["색상",d.color],["대여 가격",won(d.price)+" /회"]];
  if(d.status==="rented"&&d.availableFrom)rows.push(["대여 가능일",d.availableFrom+" 이후"]);
  if(d.status==="preparing")rows.push(["안내","세탁·정비 중이에요. 곧 대여 가능해요."]);
  if(d.note)rows.push(["메모",d.note]);
  $("mDetails").innerHTML="";
  rows.forEach(([k,v])=>{const t=document.createElement("dt"),x=document.createElement("dd");t.textContent=k;x.textContent=v;$("mDetails").append(t,x);});
  $("mCall").href="tel:"+site.phone.replace(/\D/g,"");
  $("mIg").href="https://ig.me/m/"+site.instagram;
  $("modal").hidden=false;document.body.style.overflow="hidden";
}
function closeModal(){$("modal").hidden=true;document.body.style.overflow="";}
$("close").onclick=closeModal;
$("modal").onclick=e=>{if(e.target.id==="modal")closeModal();};
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal();});

Promise.all([fetch("data/site.json").then(r=>r.json()),fetch("data/dresses.json").then(r=>r.json())]).then(([s,d])=>{
  site=s;dresses=d;
  const tel="tel:"+s.phone.replace(/\D/g,"");
  $("callTop").href=tel;$("callFoot").href=tel;$("callFoot").textContent=s.phone;
  $("igFoot").href="https://instagram.com/"+s.instagram;$("igFoot").textContent="@"+s.instagram;
  $("hours").textContent=s.hours;
  [["","전체"],...Object.entries(STATUS)].forEach(([v,l])=>{
    const c=document.createElement("button");c.className="chip"+(v===""?" on":"");c.textContent=l;
    c.onclick=()=>{filter.status=v;document.querySelectorAll(".chip").forEach(x=>x.classList.toggle("on",x===c));render();};
    $("statusChips").appendChild(c);
  });
  [...new Set(d.map(x=>x.size))].forEach(v=>$("sizeSel").add(new Option(v,v)));
  [...new Set(d.map(x=>x.color))].forEach(v=>$("colorSel").add(new Option(v,v)));
  $("sizeSel").onchange=e=>{filter.size=e.target.value;render();};
  $("colorSel").onchange=e=>{filter.color=e.target.value;render();};
  render();
}).catch(()=>{$("grid").textContent="목록을 불러오지 못했어요. 새로고침해 주세요.";});
