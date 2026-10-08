import {describe,it,expect,vi,beforeEach} from 'vitest';
import type {Response,NextFunction} from 'express';
const {verifyToken,single,select}=vi.hoisted(()=>{const verifyToken=vi.fn();const single=vi.fn();const eq=vi.fn(()=>({single}));const select=vi.fn(()=>({eq}));return {verifyToken,single,select}});
vi.mock('../src/lib/supabase.js',()=>({verifyToken,adminDb:()=>({from:()=>({select})})}));
import {authenticate,leaderOnly,type AuthRequest} from '../src/lib/auth.js';
function response(){const r:any={status:vi.fn().mockReturnThis(),json:vi.fn().mockReturnThis()};return r as Response}
beforeEach(()=>{vi.clearAllMocks();verifyToken.mockResolvedValue({id:'user-1'});single.mockResolvedValue({data:{role:'seller'},error:null})});
describe('autenticação e permissões',()=>{
it('recusa requisição sem token',async()=>{const res=response();const next=vi.fn();await authenticate({headers:{}} as AuthRequest,res,next);expect(res.status).toHaveBeenCalledWith(401);expect(next).not.toHaveBeenCalled()});
it('recusa usuário sem perfil',async()=>{single.mockResolvedValueOnce({data:null,error:null});const res=response();const next=vi.fn();await authenticate({headers:{authorization:'Bearer token'}} as AuthRequest,res,next);expect(res.status).toHaveBeenCalledWith(403);expect(next).not.toHaveBeenCalled()});
it('carrega role do banco e não do token',async()=>{const res=response();const next=vi.fn();const req={headers:{authorization:'Bearer token'},role:'leader'} as AuthRequest;await authenticate(req,res,next);expect(req.role).toBe('seller');expect(next).toHaveBeenCalledOnce()});
it('impede vendedor de gerenciar usuários',()=>{const res=response();const next=vi.fn();leaderOnly({role:'seller'} as AuthRequest,res,next as NextFunction);expect(res.status).toHaveBeenCalledWith(403);expect(next).not.toHaveBeenCalled()});
it('permite líder',()=>{const res=response();const next=vi.fn();leaderOnly({role:'leader'} as AuthRequest,res,next as NextFunction);expect(next).toHaveBeenCalledOnce()});
});