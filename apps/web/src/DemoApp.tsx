import {useState} from 'react';
import {LayoutDashboard, Users, KanbanSquare, MessageCircle, CalendarClock, LogOut} from 'lucide-react';
type Lead={id:number;name:string;phone:string;product:string;stage:string};
const stages=['Novo','Contatado','Interessado','Negociação','Ganho','Perdido'];
const seed:Lead[]=[
{id:1,name:'Cliente Demonstração A',phone:'(62) 90000-0001',product:'Internet 600 Mega',stage:'Novo'},
{id:2,name:'Cliente Demonstração B',phone:'(62) 90000-0002',product:'TV',stage:'Interessado'},
{id:3,name:'Cliente Demonstração C',phone:'(62) 90000-0003',product:'Aparelho',stage:'Negociação'}
];
export default function DemoApp({onExit}:{onExit:()=>void}){
 const [page,setPage]=useState('painel');
 const [leads,setLeads]=useState<Lead[]>(seed);
 const [name,setName]=useState('');
 const [product,setProduct]=useState('');
 const [groupFilter,setGroupFilter]=useState('Todos');
 const changeStage=(id:number,stage:string)=>setLeads(old=>old.map(l=>l.id===id?{...l,stage}:l));
 return <div className="app"><aside><div className="logo">◆ TITAN <span>CRM 360 · DEMO LOCAL</span></div><nav>{[['painel','Painel'],['leads','Leads'],['funil','Funil'],['whatsapp','WhatsApp / Grupos'],['campanhas','Campanhas']].map(([key,label])=><a href="#" key={key} onClick={e=>{e.preventDefault();setPage(key)}} className={page===key?'active':''}>{key==='painel'?<LayoutDashboard size={18}/>:key==='leads'?<Users size={18}/>:key==='funil'?<KanbanSquare size={18}/>:key==='whatsapp'?<MessageCircle size={18}/>:<CalendarClock size={18}/>} {label}</a>)}</nav><div className="sidebar-bottom"><small>Dados fictícios. Nenhuma conexão externa.</small><button className="logout" onClick={onExit}><LogOut size={16}/> Sair da demonstração</button></div></aside><main>
 <div className="page-head"><h1>{({painel:'Visão geral',leads:'Leads de demonstração',funil:'Funil comercial',whatsapp:'WhatsApp e grupos',campanhas:'Campanhas'} as Record<string,string>)[page]}</h1><p>Ambiente local fictício. Alterações não são salvas no Supabase.</p></div>
 <div className="notice" role="status">MODO DEMONSTRAÇÃO · Somente localhost · Sem autenticação, mensagens reais ou acesso ao banco</div>
 {page==='painel'&&<><div className="stat-grid">{[['Leads fictícios',leads.length],['Negociações abertas',leads.filter(l=>!['Ganho','Perdido'].includes(l.stage)).length],['Vendas simuladas',leads.filter(l=>l.stage==='Ganho').length],['Grupos conectados',0]].map(([label,v])=><div className="stat" key={label}><span>{label}</span><strong>{v}</strong></div>)}</div><div className="panel"><h2>Próximas ações</h2><p>Use Leads e Funil para testar o atendimento comercial com registros fictícios.</p></div></>}
 {page==='leads'&&<><form className="panel form-row" onSubmit={e=>{e.preventDefault();if(!name.trim())return;setLeads(v=>[...v,{id:Date.now(),name:name.trim(),phone:'Não informado',product:product.trim()||'A definir',stage:'Novo'}]);setName('');setProduct('')}}><input placeholder="Nome fictício" value={name} onChange={e=>setName(e.target.value)} required/><input placeholder="Produto" value={product} onChange={e=>setProduct(e.target.value)}/><button>Adicionar lead fictício</button></form><div className="panel table-wrap"><table><thead><tr><th>Cliente</th><th>Telefone</th><th>Produto</th><th>Etapa</th></tr></thead><tbody>{leads.map(l=><tr key={l.id}><td>{l.name}</td><td>{l.phone}</td><td>{l.product}</td><td><select value={l.stage} onChange={e=>changeStage(l.id,e.target.value)}>{stages.map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></>}
 {page==='funil'&&<div className="board">{stages.map(stage=><div className="board-col" key={stage}><h3>{stage} ({leads.filter(l=>l.stage===stage).length})</h3>{leads.filter(l=>l.stage===stage).map(l=><div className="lead-card" key={l.id}><b>{l.name}</b><small>{l.product}</small><select value={l.stage} onChange={e=>changeStage(l.id,e.target.value)}>{stages.map(s=><option key={s}>{s}</option>)}</select></div>)}</div>)}</div>}
 {page==='whatsapp'&&<div className="panel"><h2>Seleção de grupos (simulação)</h2><p>O TITAN real buscará grupos arquivados e não arquivados quando o provedor estiver conectado.</p><div className="toolbar">{['Todos','Arquivados','Não arquivados'].map(s=><button className={groupFilter===s?'':'secondary'} key={s} onClick={()=>setGroupFilter(s)}>{s}</button>)}</div><p>Nenhum grupo real carregado. Filtro selecionado: {groupFilter}.</p><p>Envio desativado nesta demonstração.</p></div>}
 {page==='campanhas'&&<div className="panel"><h2>Campanhas</h2><p>Editor e agendamento serão habilitados posteriormente. Nenhum envio é possível no modo demonstração.</p><textarea rows={4} placeholder="Rascunho fictício da campanha" style={{width:'100%',padding:12,borderRadius:8}}/><p>O texto acima é apenas local e não é enviado nem persistido.</p></div>}
 </main></div>;
}
