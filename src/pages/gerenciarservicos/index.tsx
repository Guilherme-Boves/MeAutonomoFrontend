import React, { useState, useContext, useRef } from 'react'
import Router from 'next/router'
import { ReturnButton } from '../../components/ui/ReturnButton';
import { AuthContext } from '../../contexts/AuthContext';
import { setupAPIClient } from '../../services/api';
import { canSSRProf } from '../../utils/canSSRProf';
import styles from './styles.module.css'
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

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
            dia: string;
            mes: string;
            horario: string;
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
    
    const carrossel = useRef(null);

    async function criarNovaPublicacao() {

        const user_id = user.user.id
        
        const api = setupAPIClient();

        const response = await api.post('/publicarservico', {
            user_id: user_id
        }) 

        const { id } = response.data

        Router.push(`/gerenciarservicos/${id}`)

    }

    const handleLeftClick = (e) => {
        e.preventDefault();

        carrossel.current.scrollLeft -= carrossel.current.offsetWidth
    }

    const handleRightClick = (e) => {
        e.preventDefault();

        carrossel.current.scrollLeft += carrossel.current.offsetWidth
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
                <div className={styles.publicacoesCarrossel} ref={carrossel}>                
                    {publicacoes.length === 0 ? (
                        <h1>Nenhum serviço foi publicado</h1>
                    ) : (
                        publicacoes.map((item)=>{
                            return(
                                <div key={item.id}>
                                    <div>{item.items.map((item)=>{
                                        return(
                                                <div key={item.id} className={styles.publicacoes}>
                                                    <div className={styles.tipoServicoText}>{item.tipoDoServico.nome}</div>
                                                    <h2>_______________________</h2>
                                                    <div className={styles.itemsSubTitles}>Descrição</div>
                                                    <div>{item.descricao}</div>

                                                    <h2 className={styles.itemsSubTitles}>Serviços prestados</h2>
                                                    <h2>__________________</h2>
                                                    <div>{item.servicosPrestadosProf.map((item)=> {
                                                        return(
                                                            <div key={item.id}>
                                                                <div>{item.nome} - R${item.preco}</div>
                                                            </div>
                                                            )
                                                        })}
                                                    </div>
                                                    <div>
                                                        <h2 className={styles.itemsSubTitles}>Agenda</h2>
                                                        <h2>__________________</h2>
                                                        {item.agenda.map((item)=>{
                                                            return(
                                                                <div key={item.id}>
                                                                    <div>{item.dia} / {item.mes} - {item.horario}h</div>
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
                {publicacoes.length === 0 ? (
                    <></>
                ) : (
                    <div className={styles.buttons}>
                        <button onClick={handleLeftClick}><FiArrowLeft size={28}/></button>
                        <button onClick={handleRightClick}><FiArrowRight size={28} /></button>
                    </div>
                )}
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