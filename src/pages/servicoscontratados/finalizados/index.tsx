import Link from "next/link";
import React, { useState } from "react";
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { setupAPIClient } from "../../../services/api";
import { canSSRCliente } from "../../../utils/canSSRCliente";
import styles from '../styles.module.css'

type ItemProps = {
    id: string;
    user_id: string;
    user:{
        id: string;
        nome: string;
    },
    item:[{
        id: string;
        contrato_id: string;
        publicacao_id: string;
        publicacao:{
            id: string;
            user_id: string;
            user:{
                id: string;
                nome: string;
            }
        },
        servicos: [{
            id: string;
            servico_id: string;
            servicos: {
                id: string;
                nome: string;
                preco: string;                
            }
        }],
        agendas: [{
            id: string;
            agenda_id: string;
            agendas: {
                id: string;
                dia: string;
                mes: string;
                horario: string;
            }
        }]
    }]
}

interface ListServicos {
    listServicos: ItemProps[]
}

export default function ServicosFinalizados({ listServicos }: ListServicos){

    const [servicos, setServicos] = useState(listServicos || [])

    return(
        <>
            <ReturnButton/>
            <div>
                <Link href={'/servicoscontratados/pendentes'}>
                    <a>
                        Servicos Pendentes
                    </a>
                </Link>
            </div>
            <div className={styles.container}>
                <div className={styles.itemContainer}>
                    <h1 className={styles.title}>Serviços Finalizados</h1>
                    {servicos.length === 0 ? (
                        <>
                            Nenhum serviço finalizado
                        </>
                    ) : (
                        <></>
                    )}
                    <div>
                        {servicos.map((item) => {
                            const nome = item.user.nome
                            return(
                                <div key={item.id} className={styles.card}>
                                    {item.item.map((item) => {
                                        return(
                                            <div key={item.id}>
                                                {item.agendas.map((item) => {
                                                    return(
                                                        <div key={item.id}>
                                                            <h1 className={styles.cardTitle}>{item.agendas.dia} de {item.agendas.mes} - {item.agendas.horario}h </h1>
                                                        </div>
                                                    )
                                                })}
                                                <div>
                                                    <h2 className={styles.subTitle}>Nome do cliente: {nome}</h2>
                                                </div>
                                                
                                                <div className={styles.titleServicoPrestado}>
                                                    <h2 className={styles.subTitle}>Serviço prestado: </h2>
                                                    
                                                    {item.servicos.map((item) => {
                                                        return(
                                                            <div key={item.id}>                                                                
                                                                <h1 style={{marginLeft:'0.2rem'}}>{item.servicos.nome}, </h1>                                                                
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                <div className={styles.titleServicoPrestado}>
                                                    <h2 className={styles.subTitle}>Valor total: R$ </h2>

                                                    {item.servicos.map((item) => {
                                                        
                                                        //let precos = parseFloat(item.servicos.preco)

                                                        //console.log(precos.reduce((total, produto) => total + produto.preco));
                                                        
                                                        return(
                                                            <div key={item.id}>                                                                
                                                                <h1 style={{marginLeft:'0.2rem'}}>{item.servicos.preco}</h1>                                                                
                                                            </div>                                                            
                                                        )
                                                        
                                                    })}
                                                </div>
                                                
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}                        
                    </div>

                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRCliente(async (ctx) => {
    
    const api = setupAPIClient(ctx);

    const response = await api.get('/servicos/finalizados');
    
    return {
        props: {
            listServicos: response.data
        }
    }
})