import {describe,it,expect} from 'vitest';
import {mergeGroups} from '../src/providers/group-normalization.js';
describe('sincronização de grupos',()=>{
 it('inclui grupos arquivados e não arquivados sem contatos',()=>{
  const groups=[{id:{_serialized:'111@g.us'},name:'Vendas'},{id:'222@g.us',name:'Promoções'}];
  const archived=[{id:{_serialized:'222@g.us'},name:'Promoções'},{id:'333@g.us',name:'Antigo'},{id:'123@c.us',name:'Contato'}];
  const chats=[{id:'111@g.us',archive:false},{id:'123@c.us',archive:false}];
  const result=mergeGroups(groups,archived,chats);
  expect(result).toHaveLength(3);
  expect(result.find(g=>g.id==='111@g.us')?.archived).toBe(false);
  expect(result.find(g=>g.id==='222@g.us')?.archived).toBe(true);
  expect(result.find(g=>g.id==='333@g.us')?.archived).toBe(true);
 });
 it('rejeita resposta inesperada ao invés de mostrar lista incompleta',()=>{
  expect(()=>mergeGroups([],{},[])).toThrow();
 });
});
