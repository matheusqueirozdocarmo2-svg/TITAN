import type {WhatsappGroup} from './types.js';
type Raw = Record<string, any>;
export function unwrapList(payload:unknown):Raw[]{
  if(Array.isArray(payload))return payload as Raw[];
  if(payload && typeof payload==='object'){
    const obj=payload as Raw;
    for(const k of ['response','data','result','groups','chats']){
      if(Array.isArray(obj[k]))return obj[k] as Raw[];
      if(obj[k] && typeof obj[k]==='object'){
        const nested=unwrapList(obj[k]);if(nested.length)return nested;
      }
    }
  }
  throw new Error('Resposta do provedor não contém lista de chats/grupos');
}
export function groupId(raw:Raw):string{
  const id=raw.id?._serialized??raw.id?.serialized??raw.id?.id??raw.id??raw.chatId??raw.groupId??'';
  if(typeof id==='string')return id;
  return '';
}
export function mergeGroups(groups:unknown,archivedChats:unknown,allChats:unknown):WhatsappGroup[]{
  const all=unwrapList(allChats),archived=unwrapList(archivedChats),original=unwrapList(groups);
  const byId=new Map<string,WhatsappGroup>();
  const add=(records:Raw[],archiveOverride?:boolean)=>{
    for(const g of records){
      const id=groupId(g);if(!id.endsWith('@g.us'))continue;
      const old=byId.get(id);
      const flag=g.archived??g.archive??g.isArchived;
      const archivedValue=archiveOverride===true?true:typeof flag==='boolean'?flag:old?.archived??false;
      byId.set(id,{id,name:String(g.name||g.subject||g.formattedTitle||old?.name||id),
        pictureUrl:g.pictureUrl||g.profilePicThumbObj?.eurl||old?.pictureUrl,archived:archivedValue});
    }
  };
  add(original);add(all);add(archived,true);
  return [...byId.values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));
}
