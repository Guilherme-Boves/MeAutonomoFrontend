import React, { useState, useContext, useRef } from 'react'
import Router from 'next/router'
import { ReturnButton } from '../../components/ui/ReturnButton';
import { AuthContext } from '../../contexts/AuthContext';
import { setupAPIClient } from '../../services/api';
import { canSSRProf } from '../../utils/canSSRProf';
import styles from './styles.module.css'
import { FiEdit, FiTrash } from "react-icons/fi";
import { DateFormat } from '../../utils/Functions';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import { MdLibraryAdd } from 'react-icons/md';
import { ReturnButtonWithFunction } from '../../components/ui/ReturnButtonWithFunction';

type PublicacaoProps = {
    id: string;
    rascunho: string;
    ativo: string;
    items:[{
        id: string;
        descricao: string;
        publicacao_id: string;
        tipoDoServico_id: string;
        tipoDoServico:{
            id: string;
            nome: string;
            imagem: string;
            categoria_id: string;
            categoria:{
                id: string;
                nome: string;
                imagem: string;
            }
        }
        servicosPrestadosProf:[{
            id: string;
            nome: string;
            preco: string;
            item_id: string;            
        }],
        agenda:[{
            id: string;
            data: string;
            status: string; 
            item_id: string;           
        }]
    }]
}

interface DeletePublicacaoProps {
    publicacao_id: string;
    itemPublicacao_id: string;
}

interface list {
    listPublicacoes: PublicacaoProps[]
}

export default function GerenciarServicos({listPublicacoes}: list) {

    const user = useContext(AuthContext)
    const [publicacoes, setPublicacoes] = useState(listPublicacoes || []);
    const [open, setOpen] = useState(false);
    const [publicacaoSelecionadaId, setPublicacaoSelecionadaId] = useState('');
    const [publicacaoSelecionadaNome, setPublicacaoSelecionadaNome] = useState('');
    const [itemPublicacaoId, setItemPublicacaoId] = useState('');

    const handleClickOpen = (publicacao_id: string, itemPublicacao_id: string, nomePublicacao: string) => {
        setOpen(true);
        setPublicacaoSelecionadaId(publicacao_id)
        setItemPublicacaoId(itemPublicacao_id)
        setPublicacaoSelecionadaNome(nomePublicacao)
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function handleCriarNovaPublicacao() {

        const user_id = user.user.id
        
        const api = setupAPIClient();

        const response = await api.post('/publicarservico', {
            user_id: user_id
        }) 

        const { id } = response.data

        Router.push(`/gerenciarservicos/cadastrar/${id}`)

    }

    function handleArmazenaServicos(itemPublicacao_id: string) {
        let arrayServicos = [];

        publicacoes.map((item) =>{
            item.items.map((item) => {
                item.servicosPrestadosProf.map((item) => {                    
                    if(itemPublicacao_id === item.item_id){
                        //console.log(item.nome)
                        //armazenarInfosPublicacao(`ls_servico${index}`, `${item.nome} - ${item.preco}`)
                        //arrayServicos.push(`${item.nome} - ${item.preco}`)
                        arrayServicos.push({id: item.id, nome: item.nome, preco: item.preco, item_id: item.item_id})
                    }             
                })
            })
        })

        localStorage.setItem("ls_servicos", JSON.stringify(arrayServicos));
    }

    function handleArmazenaAgenda(itemPublicacao_id: string){
        let arrayAgendas = [];

        publicacoes.map((item) => {
            item.items.map((item) => {
                item.agenda.map((item) => {
                    if(itemPublicacao_id === item.item_id){
                        arrayAgendas.push({id: item.id, data: item.data, item_id: item.item_id})
                    }
                })
            })
        })

        localStorage.setItem("ls_agendas", JSON.stringify(arrayAgendas))
    }

    function handleEditPublicacao(publicacao_id: string, itemPublicacao_id: string, descricao: string, tipoSerivcoId: string, tipoServicoNome: string, categoriaNome: string) {

        handleArmazenaServicos(itemPublicacao_id)
        handleArmazenaAgenda(itemPublicacao_id)
        armazenarInfosPublicacao("ls_descricao", descricao)
        armazenarInfosPublicacao("ls_tiposervicoid", tipoSerivcoId)
        armazenarInfosPublicacao("ls_tiposerviconome", tipoServicoNome)
        armazenarInfosPublicacao("ls_categoria", categoriaNome)

        Router.push(`/gerenciarservicos/edit/${publicacao_id}`)
    }

    const armazenarInfosPublicacao = (chave, valor) => {
        localStorage.setItem(chave, valor)
    }

    async function handleDeletePublicacao( publicacao_id: string, itemPublicacao_id: string) {

        if(publicacao_id === ''){
            toast.error("Não foi possível excluir a publicação! Tente novamente mais tarde!")
            return;
        }

        if(itemPublicacao_id === ''){
            toast.error("Não foi possível excluir a publicação! Tente novamente mais tarde!")
            return;
        }

        const api = setupAPIClient();

        await api.delete('/publicacao',{
            data:{
                publicacao_id,
                itemPublicacao_id,
            }
        }).then(function (response) {

            let removePublicacao = publicacoes.filter( item => {
                return (item.id !== publicacao_id)
            })
    
            setOpen(false)
            setPublicacoes(removePublicacao)            

            toast.success("Publicação excluída com sucesso!")
        }).catch(function (err) {            
            const { error } = err.response.data;
            toast.error(error);            
        });

        
    }

    function handleReturn() {
        Router.push("/dashboard/profissional");
    }

    return(

        <>
            <div className='ml-10 p-3'>
                <ReturnButtonWithFunction onClick={handleReturn}/>
            </div>
            <div className="bg-white w-[850px] mx-auto rounded-lg flex flex-col p-10 mb-10">
                <div className="flex justify-between items-center">
                    <h1 className='font-bold text-2xl'>Meus Serviços</h1>
                    <div className="pb-5">
                        <button onClick={handleCriarNovaPublicacao} className="group block max-w-xs mx-auto rounded-lg p-6 bg-[#12AFCB] ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-[#56CCF2] transition-colors">
                            <div className="flex items-center space-x-3">
                                <MdLibraryAdd color='white'/>
                                <h3 className="text-white group-hover:text-white text-sm font-semibold">Nova Publicação</h3>
                            </div>
                            <p className="text-white group-hover:text-white text-sm">Publique um novo serviço! É rapidinho.</p>
                        </button>
                    </div>
                </div>
                <div className="flex-grow w-[773px] border-t-2 border-[#D3E2E5]"/>
                <div className="pt-4 pb-2" >                
                    {publicacoes.length === 0 ? (
                        <>
                        <div className="flex justify-center p-5">
                            <img src="/images/ErroEncontrar.png" alt="" width={100} height={100}/>
                        </div>
                        <div className="flex justify-center">
                            <h1 className="font-bold text-base">Ops... Parece que nenhum serviço foi publicado</h1>
                        </div>
                        </>
                    ) : (
                        publicacoes.map((item)=>{
                            const publicacao_id = item.id
                            return(
                                <div key={item.id}>
                                    <div>{item.items.map((item)=>{
                                        const itemPublicacao_id = item.id
                                        const nomePublicacao = item.tipoDoServico.nome
                                        const descricao = item.descricao
                                        const tipoSerivcoId = item.tipoDoServico_id;
                                        const tipoServicoNome = item.tipoDoServico.nome; // Variável necessária para armazenar no localStorage qual categoria e tipo de serviço pertence aquela publicação.
                                        const categoriaNome = item.tipoDoServico.categoria.nome;
                                        return(
                                                <div key={item.id} className="p-4 mt-4 h-auto border-2 border-[#D3E2E5] rounded-lg w-auto shadow-md">
                                                    <div className="flex justify-between">
                                                        <div>
                                                            <div className="font-bold text-xl">{item.tipoDoServico.nome}</div>
                                                        </div>
                                                        <div className="space-x-5 pb-3">
                                                            <button className='bg-[#12AFCB] rounded-lg h-7 w-7 hover:bg-[#56CCF2] transition-colors' onClick={e => handleEditPublicacao(publicacao_id, itemPublicacao_id, descricao, tipoSerivcoId, tipoServicoNome, categoriaNome) }>
                                                                <FiEdit size={20} color="white" className='mx-auto'/>                                            
                                                            </button>                                                            
                                                            <button className='bg-[#12AFCB] rounded-lg h-7 w-7 hover:bg-[#56CCF2] transition-colors' onClick={e => {handleClickOpen(publicacao_id, itemPublicacao_id, nomePublicacao)}}>
                                                                <FiTrash size={20} color="white" className='mx-auto' />                                            
                                                            </button>
                                                        </div>  
                                                    </div>                             

                                                    <div className="w-[100%] border-t-2 border-[#D3E2E5] pt-3"/>                                                                                      
                                                    <div className="font-bold text-lg">Descrição</div>
                                                    <div className="w-[100%] border-t-2 border-[#D3E2E5] pt-3"/> 
                                                    <div style={{marginBottom:'0.6rem'}}>{item.descricao}</div>                                              
                                                                                                    
                                                    <h2 className="font-bold text-lg">Serviços prestados</h2>
                                                    <div className="w-[100%] border-t-2 border-[#D3E2E5] pt-3"/> 
                                                    <div className="">                                                        
                                                        {item.servicosPrestadosProf.map((item)=> {                                                        
                                                        return(
                                                                <div key={item.id} className="w-[50%] m-[8px]">
                                                                    <div>{item.nome} - R${item.preco}</div>                                                                    
                                                                </div>                                                                                                                            
                                                            )                                                            
                                                        })}                                                        
                                                    </div>                                        
                                                    
                                                    <h2 className="font-bold text-lg">Agenda</h2>
                                                    <div className="w-[100%] border-t-2 border-[#D3E2E5] pt-3"/> 
                                                    <div className="">
                                                        {item.agenda.map((item)=>{
                                                            return(
                                                                <div key={item.id} className="w-[50%] m-[8px]">
                                                                    <div>{DateFormat(item.data)}</div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>                                                
                                            )
                                        })}                                        
                                    </div>
                                </div>
                            )                            
                        })                        
                    )}
                    <Dialog
                        open={open}
                        onClose={handleClose}                                                                    
                    >
                        <DialogTitle>
                            {`Certeza que deseja excluir a publicação ${publicacaoSelecionadaNome}?`}
                        </DialogTitle>     

                        <DialogActions>
                            <Button onClick={handleClose}>
                                Cancelar
                            </Button>
                            <Button onClick={(e) => handleDeletePublicacao(publicacaoSelecionadaId, itemPublicacaoId)} autoFocus>
                                Confirmar
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </>
        
    )
}

export const getServerSideProps = canSSRProf(async (ctx) => {
    
    const user_id = ctx.query.user_id

    const api = setupAPIClient(ctx);

    const response = await api.get('/publicacoes',{
        params:{
            user_id: user_id
        }
    })
    //const response = await api.get(`publicacoes?user_id=${user_id}`)

    return{
        props: {
            listPublicacoes: response.data
        }
    }
})