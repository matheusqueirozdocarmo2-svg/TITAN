import {DisabledProvider} from './disabled.js';import {WppConnectProvider} from './wppconnect.js';import type {WhatsappProvider} from './types.js';
export function getProvider():WhatsappProvider{return process.env.WHATSAPP_PROVIDER==='wppconnect'?new WppConnectProvider():new DisabledProvider()}
