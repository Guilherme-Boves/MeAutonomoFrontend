import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ReturnButton } from "../../../components/ui/ReturnButton";
import { setupAPIClient } from "../../../services/api";
import { canSSRAuth } from "../../../utils/canSSRAuth";
import styles from '../styles.module.css'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from "react-toastify";

import jsonWebTokenService from 'jsonwebtoken'
import { parseCookies } from 'nookies';


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

export default function ServicosPendentes({ listServicos }: ListServicos){

    const [servicos, setServicos] = useState(listServicos || [])
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState('');

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    async function handleFinalizar(contrato_id, agenda_id) {
        
        const api = setupAPIClient();

        try{

            const response = await api.put('/servicos/finalizar', {
                contrato_id: contrato_id,
                agenda_id: agenda_id
            })

            toast.success('Serviço Finalizado com sucesso!')                        
            
            const listaAtualizada = await api.get('/servicos/pendentes')
            setServicos(listaAtualizada.data)
            
        } catch(err){
            console.log("Ops, erro inesperado! ", err)
        }
    }

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
                <Link href={'/servicoscontratados/finalizados'}>
                    <a style={{color: 'black'}}>
                        Servicos Finalizados
                    </a>
                </Link>
            </div>
            <div className={styles.container}>            
                <div className={styles.itemContainer}>
                    <h1 className={styles.title}>Serviços Pendentes</h1>
                    {servicos.length === 0 ? (
                        <>
                            Nenhum serviço pendente
                        </>
                    ) : (
                        <></>
                    )}
                    <div>
                        {servicos.map((item) => {
                            const nomeCliente = item.user.nome                            
                            return(
                                <div key={item.id} className={styles.card}>
                                    {item.item.map((item) => {

                                        let contrato_id = item.contrato_id

                                        const nomeProfissional = item.publicacao.user.nome
                                        
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

                                                    {item.servicos.map((item) => {
                                                        return(
                                                            <div key={item.id}>                                                                                                                                
                                                                <h1 style={{marginLeft:'0.2rem'}}>{item.servicos.preco}</h1>  
                                                            </div>   
                                                        )
                                                    })}
                                                </div> 

                                                {item.agendas.map((item) => {
                                                    let agenda_id = item.agenda_id

                                                    return(
                                                        <div className={styles.buttonFinalizarContainer} key={item.id}>
                                                            <Button variant="outlined" onClick={handleClickOpen} className={styles.buttonFinalizar}>
                                                                    Finalizar servico
                                                            </Button>

                                                            <Dialog
                                                                open={open}
                                                                onClose={handleClose}                                                                    
                                                            >
                                                                <DialogTitle>
                                                                    {"Você tem certeza que deseja finalizar esse serviço?"}
                                                                </DialogTitle>     

                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>
                                                                        Cancelar
                                                                    </Button>
                                                                    <Button onClick={(e) => handleFinalizar(contrato_id, agenda_id)} autoFocus>
                                                                        Confirmar
                                                                    </Button>
                                                                </DialogActions>
                                                            </Dialog>
                                                        </div>    
                                                    )
                                                })}                                   
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
    
    const response = await api.get('/servicos/pendentes');
    
    return {
        props: {
            listServicos: response.data,
        }
    }
})