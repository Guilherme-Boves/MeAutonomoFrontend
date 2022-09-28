import Link from 'next/link';
import { Router, useRouter } from 'next/router';
import React, { useState, useContext, useEffect } from 'react'
import { Button } from '../../components/ui/Button'
import { ReturnButton } from '../../components/ui/ReturnButton';
import { AuthContext } from '../../contexts/AuthContext';
import { setupAPIClient } from '../../services/api';
import { canSSRProf } from '../../utils/canSSRProf';
import styles from './styles.module.css'

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
        agenda:{
            id: string;
            dia: string;
            mes: string;
            horario: string;
            status: string;            
        }
    }]
}

interface list {
    listPublicacoes: PublicacaoProps[]
}

export default function GerenciarServicos({listPublicacoes}: list) {

    const user = useContext(AuthContext)
    const [publicacoes, setPublicacoes] = useState(listPublicacoes || []);
    const [publicacaoId, setPublicacaoId] = useState('');

    async function criarNovaPublicacao() {

        const user_id = user.user.id
        
        const api = setupAPIClient();

        const response = await api.post('/publicarservico', {
            user_id: user_id
        }) 

        const { id } = response.data
        setPublicacaoId(id)

    }

    return(

        <>
        <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.containertitle}>
                    <h1>Meus Serviços</h1>
                    <div className={styles.novoServico}>
                        <Link href={`/gerenciarservicos/${publicacaoId}`} >                            
                            <Button onClick={criarNovaPublicacao}>
                                Nova publicação
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className={styles.publicacoes}>
                    {publicacoes.length === 0 ? (
                        <h1>Nenhum serviço foi publicado</h1>
                    ) : (
                        publicacoes.map((item)=>{
                            return(
                                <div key={item.id}>
                                    <div>{item.items.map((item)=>{
                                        return(
                                            <div key={item.id}>
                                                <div className={styles.servicosContainer}>{item.servicosPrestadosProf.map((item)=>{
                                                    return(
                                                        <div key={item.id}>
                                                            <div>{item.nome}</div>
                                                        </div>
                                                    )
                                                })}</div>
                                            </div>
                                        )
                                    })}</div>
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
    console.log(response.data)

    return{
        props: {
            listPublicacoes: response.data
        }
    }
})