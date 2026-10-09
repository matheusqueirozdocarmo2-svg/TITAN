import {describe,it,expect} from 'vitest';
import {canUseLocalDemo} from '../src/demo-access';
describe('isolamento do modo demonstração',()=>{
 it('habilita apenas no desenvolvimento local',()=>{expect(canUseLocalDemo(true,'localhost')).toBe(true);expect(canUseLocalDemo(true,'127.0.0.1')).toBe(true)});
 it('bloqueia builds de produção',()=>expect(canUseLocalDemo(false,'localhost')).toBe(false));
 it('bloqueia endereços remotos',()=>{expect(canUseLocalDemo(true,'titan.example.com')).toBe(false);expect(canUseLocalDemo(true,'192.168.1.5')).toBe(false);expect(canUseLocalDemo(true,'localhost.attacker.com')).toBe(false)});
});
