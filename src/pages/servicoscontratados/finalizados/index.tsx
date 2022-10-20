import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { setupAPIClient } from "../../../services/api";
import styles from '../styles.module.css'

import jsonWebTokenService from 'jsonwebtoken'
import { parseCookies } from 'nookies';
import { canSSRAuth } from "../../../utils/canSSRAuth";
import { DateFormat } from "../../../utils/Functions";

type ItemProps = {
    id: string;
    userCliente_id: string;
    userProfissional_id: string;
    userCliente:{
        id: string;
        nome: string;
    },
    userProfissional:{
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
                preco: number;                
            }
        }],
        agendas: [{
            id: string;
            agenda_id: string;
            agendas: {
                id: string;
                data: string;
            }
        }]
    }]
}

interface ListServicos {
    listServicos: ItemProps[]
}

export default function ServicosFinalizados({ listServicos }: ListServicos){

    const [servicos, setServicos] = useState(listServicos || [])
    const [role, setRole] = useState('');
    let valorTotal = 0;

    useEffect(() => {

        function loadRole() {
            
            const { '@meautonomo.token': token } = parseCookies();
            const decodedJwt = jsonWebTokenService.decode(token)
                
            if(decodedJwt.role === "CLIENTE"){
                return(
                    setRole("CLIENTE")
                )
            } else if(decodedJwt.role === "PROFISSIONAL") {
                return(                
                    setRole("PROFISSIONAL")
                )
            }
        } 

        loadRole()
        

    }, [])

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

                            const nomeCliente = item.userCliente.nome 
                            const nomeProfissional = item.userProfissional.nome
                            
                            return(
                                <div key={item.id} className={styles.card}>
                                    {item.item.map((item) => {

                                        return(
                                            <div key={item.id}>
                                                {item.agendas.map((item) => {
                                                    return(
                                                        <div key={item.id}>
                                                            <h1 className={styles.cardTitle}>{DateFormat(item.agendas.data)}</h1>
                                                        </div>
                                                    )
                                                })}
                                                <div>
                                                    {
                                                        role === "CLIENTE" ? (
                                                            <h2 className={styles.subTitle}>Nome do Profissional: {nomeProfissional}</h2>
                                                        ) : (
                                                            <h2 className={styles.subTitle}>Nome do Cliente: {nomeCliente}</h2> 
                                                        )
                                                    }                                                    
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

                                                    {valorTotal = item.servicos.reduce( (valorAnterior, valorAtual) => valorAnterior + Number(valorAtual.servicos.preco), 0)}
                                                    
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

export const getServerSideProps = canSSRAuth(async (ctx) => {
    
    const api = setupAPIClient(ctx);

    const response = await api.get('/servicos/finalizados');
    
    return {
        props: {
            listServicos: response.data
        }
    }
})