import {describe,it,expect} from 'vitest';
import {canUseLocalDemo} from '../../web/src/demo-access.js';
describe('demonstração restrita ao localhost',()=>{
 it('permite somente em desenvolvimento no próprio computador',()=>{expect(canUseLocalDemo(true,'localhost')).toBe(true);expect(canUseLocalDemo(true,'127.0.0.1')).toBe(true)});
 it('nega no build de produção mesmo em localhost',()=>expect(canUseLocalDemo(false,'localhost')).toBe(false));
 it('nega domínios e rede local',()=>{expect(canUseLocalDemo(true,'titan.example.com')).toBe(false);expect(canUseLocalDemo(true,'192.168.0.10')).toBe(false)});
});
