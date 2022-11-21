import Link from "next/link";
import React, { useState, useEffect } from "react";
import { setupAPIClient } from "../../../services/api";
import styles from '../styles.module.css'

import jsonWebTokenService from 'jsonwebtoken'
import { parseCookies } from 'nookies';
import { canSSRAuth } from "../../../utils/canSSRAuth";
import { DateFormat } from "../../../utils/Functions";
import { ReturnButtonWithFunction } from "../../../components/ui/ReturnButtonWithFunction";
import Router from "next/router";

import { Stack, Rating, Button, Dialog, DialogActions, DialogTitle, DialogContent} from '@mui/material'
import { toast } from "react-toastify";
import { NavServicos } from "../../../components/NavServicos";
import { FaMedal } from "react-icons/fa";

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
        contrato:{
            id: string;
            avaliacao: Boolean;
        }
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


export default function ServicosFinalizados({ listServicos }: ListServicos){

    const [servicos, setServicos] = useState(listServicos || [])
    const [userLogadoId, setUserLogadoId] = useState('');
    const [role, setRole] = useState('');
    const [open, setOpen] = useState(false);
    const [descricao, setDescricao] = useState('')
    
    const [contratoId, setContratoId] = useState('');
    const [userProfissionalId, setUserProfissionalId] = useState('');
    const [avaliacao, setAvaliacao] = useState<number | null>(0)
    const [avaliacaoId, setAvaliacaoId] = useState('');
    
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

    useEffect(() => {

        async function loadUserLogadoId() {
            
            const api = setupAPIClient();

            const response = await api.get('/userinfo');

            const { id } = response.data

            setUserLogadoId(id)
        } 

        loadUserLogadoId()

    }, [])

    async function handleRealizarAvaliacao() {   
        
        if(avaliacao === null || avaliacao === undefined){
            setAvaliacao(0);
        }

        if(!descricao){
            toast.error("Preencha todos os campos!")
            return;
        }
        
        try {            
            const api = setupAPIClient();

            const response = await api.post("/avaliacao/send", {
                descricao: descricao,
                nota: avaliacao,
                userProfissional_id: userProfissionalId,
                contrato_id: contratoId,
                avaliacao_id: avaliacaoId                
            })

            const servicosAtualizados = await api.get('/servicos/finalizados');
            setServicos(servicosAtualizados.data)

            setDescricao('')
            setAvaliacao(0)
            setOpen(false)

            toast.success("Avaliação realizada com sucesso!")
        } catch (err){
            const { error } = err.response.data;
            toast.error(error)
        }
    }

    function handleReturn() {
        if(role === "CLIENTE"){
            Router.push("../dashboard/cliente")
        } else if(role === "PROFISSIONAL") {
            Router.push("../dashboard/profissional")
        } else {
            Router.push("../dashboard/admin")
        }
    }

    const handleClickOpen = (contrato_id: string, userProfissional_id: string) => {

        setContratoId(contrato_id);
        setUserProfissionalId(userProfissional_id);

        (async () => {
            try{               
                const api = setupAPIClient();
                const response = await api.post('/avaliacao')
                
                const { id } = response.data
                setAvaliacaoId(id)
                setOpen(true);

            } catch(err){
                const { error } = err.response.data
                toast.error("Ops! Erro inesperado!" + error)
            }
        })();

    };
    
    const handleClose = () => {

        (async () => {
            try{                
                const api = setupAPIClient();
                const response = await api.delete('/avaliacao', {
                    data:{
                        avaliacao_id: avaliacaoId
                    }
                })

                setDescricao('')
                setAvaliacao(0)
                
                setOpen(false);

            } catch(err){
                const { error } = err.response.data
                toast.error("Ops! Erro inesperado!" + error)
                setOpen(false);
            }
        })();
        
    };

    const handleChangeAvaliacao = (event, newValue: number | 0) => {
        setAvaliacao(newValue)
    }

    return(
        <>
            <div className="flex flex-row">
                <div className="flex flex-col border-r-2 border-zinc-50">
                    <div className="ml-8 pt-8">
                        <ReturnButtonWithFunction onClick={handleReturn}/>
                    </div>
                    <NavServicos/>
                </div>
                <div className="mx-auto">
                    <div className="p-8 bg-white shadow mt-24 rounded-2xl w-[1000px]">
                        <div className="flex flex-row">
                            <div>
                                <h1 className="font-bold text-xl ml-1 ">Serviços Finalizados</h1>
                            </div>
                        </div>

                        <div className="pt-4 pb-2">
                            <div className="flex-grow border-t-2 border-[#D3E2E5]"/>
                        </div>
                        
                        {servicos.length === 0 ? (
                            <div>
                                Nenhum serviço finalizado
                            </div>
                        ) : (
                            <div>
                            {servicos.map((item) => {

                                const contrato_id = item.id
                                const userCliente_id = item.userCliente_id;    
                                const userProfissional_id = item.userProfissional_id;
                                const nomeCliente = item.userCliente.nome 
                                const nomeProfissional = item.userProfissional.nome
                                
                                return(
                                    <div key={item.id} className="mt-4 bg-white h-auto w-auto rounded-lg border-2 pr-4">
                                        {item.item.map((item) => {

                                            const contratoAvaliacao = item.contrato.avaliacao;

                                            return(
                                                <div key={item.id}>
                                                    {item.agendas.map((item) => {
                                                        return(
                                                            <div key={item.id}>
                                                                <h1 className="font-bold p-3 pl-4">{DateFormat(item.data)}</h1>
                                                                <div className="flex-grow w-[933px] border-t-2 border-[#D3E2E5]"/>
                                                            </div>
                                                        )
                                                    })}

                                                    <div className="pt-4">
                                                        {
                                                            role === "CLIENTE" ? (
                                                                <div className="flex flex-row"><h2 className="pl-4 font-bold">Nome do Profissional:</h2> <h2 className="ml-1">{nomeProfissional}</h2></div>
                                                            ) : role === "PROFISSIONAL" && userCliente_id === userLogadoId ? (
                                                                <div className="flex flex-row"><h2 className="pl-4 font-bold">Nome do Profissional:</h2> <h2 className="ml-1">{nomeProfissional}</h2></div> 
                                                                ) : (                                                           
                                                                <div className="flex flex-row"><h2 className="pl-4 font-bold">Nome do Cliente:</h2> <h2 className="ml-2">{nomeCliente}</h2></div>
                                                            )
                                                        }                                                    
                                                    </div>
                                                    <div className={styles.titleServicoPrestado}>
                                                        <h2 className="pl-4 font-bold">Serviço prestado:</h2>
                                                        
                                                        {item.servicos.map((item) => {
                                                            return(
                                                                <div key={item.id}>                                                                
                                                                    <h1 style={{marginLeft:'0.2rem'}}>{item.nome} </h1>                                                                
                                                                </div>
                                                            )
                                                        })}
                                                    </div>

                                                    <div className="flex flex-row">
                                                        <h2 className="pl-4 font-bold">Valor total:</h2>
                                                        <h2 className="ml-1">R$</h2>
                                                        <div className="ml-0.5">
                                                            {valorTotal = item.servicos.reduce((valorAnterior, valorAtual) => valorAnterior + Number(valorAtual.preco), 0)}
                                                        </div>
                                                    </div>   

                                                    <div>
                                                        { role === "CLIENTE" && contratoAvaliacao === false ? (
                                                                <div className={styles.buttonFinalizarContainer} style={{paddingRight:"0.5rem"}}>                                                                        
                                                                <Button variant="outlined" onClick={e => handleClickOpen(contrato_id, userProfissional_id)} className="hover:bg-[#29B6D1] hover:text-white hover:transition-colors">
                                                                    <FaMedal className="fill-current h-5 w-5"/>
                                                                    <div className="ml-1">
                                                                        Avaliar Serviço
                                                                    </div>
                                                                </Button>
                                                            </div>
                                                            ) : role === "PROFISSIONAL" && userCliente_id === userLogadoId && contratoAvaliacao === false ? (
                                                                <div className={styles.buttonFinalizarContainer} style={{paddingRight:"0.5rem"}}>                                                                        
                                                                    <Button variant="outlined" onClick={e => handleClickOpen(contrato_id, userProfissional_id)} className="hover:bg-[#29B6D1] hover:text-white hover:transition-colors">
                                                                        <FaMedal className="fill-current h-5 w-5"/>
                                                                        <div className="ml-1">
                                                                            Avaliar Serviço
                                                                        </div>
                                                                    </Button>
                                                                </div>
                                                                ) : (
                                                                <></>
                                                            )
                                                        }                                                    
                                                    </div>
                                                    
                                                    <Dialog
                                                        open={open}
                                                        onClose={handleClose}
                                                        fullWidth
                                                    >
                                                        <div>
                                                            <DialogTitle>
                                                                {"O que achou do serviço? Deixe aqui a sua avaliação!"}
                                                            </DialogTitle>

                                                            <DialogContent>
                                                                <div>
                                                                    <Stack spacing={2}>
                                                                        <h1 className={styles.titleAvaliacao}>Nota</h1>
                                                                        <Rating 
                                                                            value={avaliacao}
                                                                            onChange={handleChangeAvaliacao}
                                                                            precision={0.5}
                                                                            size="large"
                                                                        />
                                                                        
                                                                        <h1 className={styles.titleAvaliacao}>Descrição</h1>
                                                                        <textarea 
                                                                            maxLength={400} 
                                                                            className={styles.textAreaAvaliacao} 
                                                                            value={descricao} 
                                                                            onChange={(e) => setDescricao(e.target.value)}
                                                                        />
                                                                    </Stack>
                                                                </div>
                                                            </DialogContent>
                                                        </div>
                                                        
                                                        <DialogActions>
                                                            <Button onClick={handleClose}>
                                                                Fechar
                                                            </Button>
                                                            <Button onClick={handleRealizarAvaliacao}>
                                                                Enviar
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
                        )}
                        
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