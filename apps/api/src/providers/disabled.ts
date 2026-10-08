import type {WhatsappProvider,WhatsappGroup} from './types.js';
export class DisabledProvider implements WhatsappProvider {
 readonly id='disabled';
 async getStatus():Promise<'unconfigured'>{return 'unconfigured'}
 async listGroups():Promise<WhatsappGroup[]>{throw new Error('Provedor WhatsApp não configurado')}
 async sendText():Promise<{messageId:string}>{throw new Error('Envio desabilitado')}
 async sendImage():Promise<{messageId:string}>{throw new Error('Envio desabilitado')}
}
