import React, { useState, useContext, useRef } from 'react'
import Router from 'next/router'
import { ReturnButton } from '../../components/ui/ReturnButton';
import { AuthContext } from '../../contexts/AuthContext';
import { setupAPIClient } from '../../services/api';
import { canSSRProf } from '../../utils/canSSRProf';
import styles from './styles.module.css'
import { FiArrowLeft, FiArrowRight, FiEdit } from "react-icons/fi";
import { DateFormat } from '../../utils/Functions';

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
        }
        servicosPrestadosProf:[{
            id: string;
            nome: string;
            preco: string;            
        }],
        agenda:[{
            id: string;
            data: string;
            status: string;            
        }]
    }]
}

interface list {
    listPublicacoes: PublicacaoProps[]
}

export default function GerenciarServicos({listPublicacoes}: list) {

    const user = useContext(AuthContext)
    const [publicacoes, setPublicacoes] = useState(listPublicacoes || []);

    async function criarNovaPublicacao() {

        const user_id = user.user.id
        
        const api = setupAPIClient();

        const response = await api.post('/publicarservico', {
            user_id: user_id
        }) 

        const { id } = response.data

        Router.push(`/gerenciarservicos/cadastrar/${id}`)

    }

    async function handleEditPublicacao(publicacao_id: string) {
        alert(publicacao_id)
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
                                        return(
                                                <div key={item.id} className={styles.card}>

                                                    <div className={styles.titleFiEditContainer}>
                                                        <div>
                                                            <div className={styles.tipoServicoText}>{item.tipoDoServico.nome}</div>
                                                        </div>
                                                        <div className={styles.fiButtonContainer}>
                                                            <button onClick={e => handleEditPublicacao(publicacao_id) }>
                                                                <FiEdit size={24} />                                            
                                                            </button>                                                        
                                                        </div>  
                                                    </div>

                                                        

                                                    <div className={styles.linhaHorizontal}></div>
                                                    <div className={styles.itemsSubTitles}>Descrição</div>
                                                    <div>{item.descricao}</div>

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