import React, { useState, useEffect } from "react";
import Link from "next/link";
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
import { DateFormat } from "../../../utils/Functions";
import { FiRefreshCw } from "react-icons/fi";
import { ReturnButtonWithFunction } from "../../../components/ui/ReturnButtonWithFunction";
import Router from "next/router";

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
            nome: string;
            preco: string;
            itemContrato_id: string;
        }],
        agendas: [{
            id: string;
            data: string;
            agenda_id: string;
            itemContrato_id: string;
        }]
    }]
}

interface ListServicos {
    listServicos: ItemProps[]
}

export default function ServicosPendentes({ listServicos }: ListServicos){
   
    const [userLogadoId, setUserLogadoId] = useState('');
    
    const [servicos, setServicos] = useState(listServicos || [])
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState('');
    const [opcao, setOpcao] = useState('');
    let valorTotal = 0;

    const handleClickOpen = (op: number) => {
        
        if(op === 0){
            setOpcao("Cancelar Serviço")
        } else if(op === 1) {
            setOpcao("Finalizar Serviço")
        }

        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    async function handleRefresh(){

        const api = setupAPIClient();

        try {
            const listaAtualizada = await api.get('/servicos/pendentes')
            setServicos(listaAtualizada.data)

            toast.success("Lista atualizada!")
        } catch(err){
            toast.error("Ops, erro inesperado!")
        }
    }

    async function handleFinalizar(contrato_id: string, agenda_id: string) {
        
        const api = setupAPIClient();

        try{

            const response = await api.put('/servicos/finalizar', {
                contrato_id: contrato_id,
                agenda_id: agenda_id
            })

            toast.success('Serviço Finalizado com sucesso!')                        
            
            const listaAtualizada = await api.get('/servicos/pendentes')
            setServicos(listaAtualizada.data)

            setOpen(false)
            
        } catch(err){
            toast.error("Ops, erro inesperado!")
        }
    }

    async function handleCancelar(contrato_id: string, itemContrato_id: string, agenda_id: string) {
        
        const api = setupAPIClient();

        try{
            const response = await api.delete('/servicos/delete', {
                data:{
                    contrato_id,
                    itemContrato_id,
                    agenda_id,
                }
            })

            toast.success('Serviço cancelado com sucesso!')                     
            
            const listaAtualizada = await api.get('/servicos/pendentes')
            setServicos(listaAtualizada.data)

            setOpen(false)
            
        } catch(err){
            toast.error("Ops, erro inesperado!")
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

    useEffect(() => {

        async function loadUserLogadoId() {
            
            const api = setupAPIClient();

            const response = await api.get('/userinfo');

            const { id } = response.data

            setUserLogadoId(id)
        } 

        loadUserLogadoId()

    }, [])

    function handleReturn() {
        if(role === "CLIENTE"){
            Router.push("../dashboard/cliente")
        } else if(role === "PROFISSIONAL") {
            Router.push("../dashboard/profissional")
        } else {
            Router.push("../dashboard/admin")
        }
    }

    return(
        <>
            <ReturnButtonWithFunction onClick={handleReturn}/>
            <div>
                <Link href={'/servicoscontratados/finalizados'}>
                    <a style={{color: 'black'}}>
                        Servicos Finalizados
                    </a>
                </Link>
            </div>
            <div className={styles.container}>            
                <div className={styles.itemContainer}>
                    <div className={styles.ServicosRefreshIcon}>
                        <div>
                            <h1 className={styles.title}>Serviços Pendentes</h1>
                        </div>
                        <div className={styles.refreshButton}>
                            <FiRefreshCw size={20} onClick={handleRefresh}/>
                        </div>
                    </div>
                    {servicos.length === 0 ? (
                        <>
                            Nenhum serviço pendente
                        </>
                    ) : (
                        <></>
                    )}
                    <div>
                        {servicos.map((item) => {
                            
                            const userCliente_id = item.userCliente_id;    
                            const userProfissional_id = item.userProfissional_id;                       
                            const nomeCliente = item.userCliente.nome;
                            const nomeProfissional = item.userProfissional.nome;

                            return(
                                <div key={item.id} className={styles.card}>
                                    {item.item.map((item) => {

                                        let contrato_id = item.contrato_id
                                        let itemContrato_id = item.id
                                        
                                        return(
                                            <div key={item.id}>
                                                {item.agendas.map((item) => {
                                                    return(
                                                        <div key={item.id}>                                                            
                                                            <h1 className={styles.cardTitle}>{DateFormat(item.data)} </h1>
                                                        </div>
                                                    )
                                                })}

                                                <div>
                                                    {
                                                        role === "CLIENTE" ? (
                                                            <h2 className={styles.subTitle}>Nome do Profissional: {nomeProfissional}</h2>
                                                        ) : role === "PROFISSIONAL" && userCliente_id === userLogadoId ? (
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
                                                                <h1 style={{marginLeft:'0.2rem'}}>{item.nome}, </h1>                                                                
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                <div className={styles.titleServicoPrestado}>
                                                    <h2 className={styles.subTitle}>Valor total: R$ </h2>

                                                    {valorTotal = item.servicos.reduce( (valorAnterior, valorAtual) => valorAnterior + Number(valorAtual.preco), 0)}
                                                     
                                                </div>                  

                                                {item.agendas.map((item) => {
                                                    let agenda_id = item.agenda_id
                                                    return(
                                                        <div className={styles.buttonFinalizarContainer} key={item.id}>
                                                            <div style={{paddingRight:"0.5rem"}}>                                                                        
                                                                <Button variant="outlined" onClick={e => handleClickOpen(0)} className={styles.buttonFinalizar}>
                                                                    Cancelar servico
                                                                </Button>
                                                            </div>                                                            
                                                            { role === "PROFISSIONAL" && userProfissional_id === userLogadoId ? (
                                                                <Button variant="outlined" onClick={e => handleClickOpen(1)} className={styles.buttonFinalizar}>
                                                                    Finalizar servico
                                                                </Button>
                                                            ) : (
                                                                <></>
                                                            )}

                                                            <Dialog
                                                                open={open}
                                                                onClose={handleClose}                                                                    
                                                            >
                                                                { opcao.startsWith('C') ? (
                                                                    <DialogTitle>
                                                                        {"Você tem certeza que deseja cancelar esse serviço?"}
                                                                    </DialogTitle>  
                                                                ) : (
                                                                    <DialogTitle>
                                                                        {"Você tem certeza que deseja finalizar esse serviço?"}
                                                                    </DialogTitle>
                                                                )}   

                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>
                                                                        Cancelar
                                                                    </Button>
                                                                    { opcao.startsWith('C') ? (
                                                                        <Button onClick={(e) => handleCancelar(contrato_id, itemContrato_id, agenda_id)} autoFocus>
                                                                            Confirmar
                                                                        </Button>  
                                                                    ) : (
                                                                        <Button onClick={(e) => handleFinalizar(contrato_id, agenda_id)} autoFocus>
                                                                            Confirmar
                                                                        </Button>
                                                                    )}
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