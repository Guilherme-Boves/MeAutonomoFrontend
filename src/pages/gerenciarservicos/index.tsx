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

    async function criarNovaPublicacao() {

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

    return(

        <>
        <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.containertitle}>
                    <h1>Meus Serviços</h1>
                    <div className={styles.novoServico}>
                        <button onClick={criarNovaPublicacao}>
                            Nova publicação
                        </button>
                    </div>
                </div>
                <div className={styles.cardContainer} >                
                    {publicacoes.length === 0 ? (
                        <h1>Nenhum serviço foi publicado</h1>
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
                                                <div key={item.id} className={styles.card}>

                                                    <div className={styles.fiButtonsContainer}>
                                                        <div>
                                                            <div className={styles.tipoServicoText}>{item.tipoDoServico.nome}</div>
                                                        </div>
                                                        <div className={styles.fiButtonContainer}>
                                                            <button onClick={e => handleEditPublicacao(publicacao_id, itemPublicacao_id, descricao, tipoSerivcoId, tipoServicoNome, categoriaNome) }>
                                                                <FiEdit size={24} />                                            
                                                            </button>                                                            
                                                            <button onClick={e => {handleClickOpen(publicacao_id, itemPublicacao_id, nomePublicacao)}}>
                                                                <FiTrash size={24} />                                            
                                                            </button>
                                                        </div>  
                                                    </div>                             

                                                    <div className={styles.linhaHorizontal}></div>                                                    
                                                    <div className={styles.itemsSubTitles}>Descrição</div>
                                                    <div style={{marginBottom:'0.6rem'}}>{item.descricao}</div>
                                                                                                        
                                                    <h2 className={styles.itemsSubTitles}>Serviços prestados</h2>
                                                    <div className={styles.linhaHorizontal}></div>
                                                    <div className={styles.servicosAgendaContainer}>                                                        
                                                        {item.servicosPrestadosProf.map((item)=> {                                                        
                                                        return(
                                                                <div key={item.id} className={styles.servicosAgenda}>
                                                                    <div>{item.nome} - R${item.preco}</div>                                                                    
                                                                </div>                                                                                                                            
                                                            )                                                            
                                                        })}                                                        
                                                    </div>                                                    
                                                    
                                                    <h2 className={styles.itemsSubTitles}>Agenda</h2>
                                                    <div className={styles.linhaHorizontal}></div>
                                                    <div className={styles.servicosAgendaContainer}>
                                                        {item.agenda.map((item)=>{
                                                            return(
                                                                <div key={item.id} className={styles.servicosAgenda}>
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
                            {`Você tem certeza que deseja excluir a publicação ${publicacaoSelecionadaNome}?`}
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