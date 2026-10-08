import type {WhatsappProvider,WhatsappGroup} from './types.js';
import {mergeGroups} from './group-normalization.js';
/** Adaptador experimental. Endpoints devem ser validados contra a versão implantada do WPPConnect Server. */
export class WppConnectProvider implements WhatsappProvider {readonly id='wppconnect';private base=process.env.WPP_BASE_URL;private token=process.env.WPP_TOKEN;
 private async call(path:string,body?:unknown){if(!this.base||!this.token)throw new Error('WPPConnect não configurado');const res=await fetch(`${this.base.replace(/\/$/,'')}${path}`,{method:body?'POST':'GET',headers:{Authorization:`Bearer ${this.token}`,'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});if(!res.ok)throw new Error(`Falha no WPPConnect (${res.status})`);return res.json() as Promise<any>}
 async getStatus(session:string){const r=await this.call(`/api/${encodeURIComponent(session)}/check-connection-session`);return r.status===true||r.status==='CONNECTED'?'connected' as const:'disconnected' as const}
 async listGroups(session:string):Promise<WhatsappGroup[]>{
  const s=encodeURIComponent(session);
  // Três fontes: inventário dos grupos, chats normais e chats arquivados.
  // Falha em qualquer fonte interrompe a sincronização para não exibir lista incompleta.
  const [groups,archived,chats]=await Promise.all([
    this.call(`/api/${s}/all-groups`),
    this.call(`/api/${s}/all-chats-archived`),
    this.call(`/api/${s}/all-chats`)
  ]);
  return mergeGroups(groups,archived,chats);
 }
 async sendText(session:string,to:string,text:string){const r=await this.call(`/api/${encodeURIComponent(session)}/send-message`,{phone:to,message:text});return {messageId:String(r.id||r.messageId||'')}}
 async sendImage(session:string,to:string,imageUrl:string,caption=''){const r=await this.call(`/api/${encodeURIComponent(session)}/send-image`,{phone:to,base64:imageUrl,caption});return {messageId:String(r.id||r.messageId||'')}}
}
