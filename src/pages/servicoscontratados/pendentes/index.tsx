import React, { useState, useEffect } from "react";
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
import { NavServicos } from "../../../components/NavServicos";
import { MdCancel, MdLibraryAddCheck } from "react-icons/md";

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


    const data = [
        {
          label: "HTML",
          value: "html",
          desc: `It really matters and then like it really doesn't matter.
          What matters is the people who are sparked by it. And the people 
          who are like offended by it, it doesn't matter.`,
        },
        {
          label: "React",
          value: "react",
          desc: `Because it's about motivating the doers. Because I'm here
          to follow my dreams and inspire other people to follow their dreams, too.`,
        }
      ];
   
    const [userLogadoId, setUserLogadoId] = useState('');
    
    const [servicos, setServicos] = useState(listServicos || [])
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState('');
    const [opcao, setOpcao] = useState('');
    const [contratoId, setContratoId] = useState('');
    const [itemContratoId, setItemContratoId] = useState('');
    const [agendaId, setAgendaId] = useState('');
    let valorTotal = 0;

    const handleClickOpen = (op: number, contrato_id: string, itemContrato_id: string, agenda_id: string) => {
        
        setContratoId(contrato_id);
        setItemContratoId(itemContrato_id);
        setAgendaId(agenda_id);

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

    async function handleFinalizar() {
        
        const api = setupAPIClient();

        try{
            await api.put('/servicos/finalizar', {
                contrato_id: contratoId,
                agenda_id: agendaId
            })

            toast.success('Serviço Finalizado com sucesso!')                        
            
            const listaAtualizada = await api.get('/servicos/pendentes')
            setServicos(listaAtualizada.data)

            setOpen(false)
            
        } catch(err){
            toast.error("Ops, erro inesperado!")
        }
    }

    async function handleCancelar() {
        
        const api = setupAPIClient();
        
        try{
           await api.delete('/servicos/delete', {
                params:{
                    contrato_id: contratoId,
                    itemContrato_id: itemContratoId,
                    agenda_id: agendaId,
                }
            })

            toast.success('Serviço cancelado com sucesso!')                     
            
            const listaAtualizada = await api.get('/servicos/pendentes')
            setServicos(listaAtualizada.data)

            setOpen(false)
            
        } catch(err){
            const { error } = err.response.data
            toast.error("Ops, erro inesperado!" + error)
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

    return (
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
                            <h1 className="font-bold text-xl ml-1 ">Serviços Pendentes</h1>
                        </div>
                        <div className="bg-[#12AFCB] rounded-md w-7 h-7 ml-5 cursor-pointer hover:bg-[#56CCF2] transition-colors">
                            <FiRefreshCw className="mx-auto h-7" size={22} onClick={handleRefresh} color="white"/>
                        </div>
                    </div>

                    <div className="pt-4 pb-2">
                        <div className="flex-grow border-t-2 border-[#D3E2E5]"/>
                    </div>

                    {servicos.length === 0 ? (
                        <>
                            <div className="flex justify-center p-5">
                                <img src="/images/ErroEncontrar.png" alt="" width={100} height={100}/>
                            </div>
                            <div className="flex justify-center">
                                <h1 className="font-bold text-base">Ops... Nenhum serviço pendente</h1>
                            </div>
                        </>
                    ) : (
                    <div>
                        {servicos.map((item) => {
                            
                            const contrato_id = item.id;
                            const userCliente_id = item.userCliente_id;    
                            const userProfissional_id = item.userProfissional_id;                       
                            const nomeCliente = item.userCliente.nome;
                            const nomeProfissional = item.userProfissional.nome;

                            return(
                                <div key={item.id} className="mt-4 bg-white h-auto w-auto rounded-lg border-2 pr-4">
                                    {item.item.map((item) => {

                                        const itemContrato_id = item.id
                                        
                                        return(
                                            <div key={item.id}>
                                                {item.agendas.map((item) => {
                                                    return(
                                                        <div key={item.id}>                                                            
                                                            <h1 className="font-bold p-3 pl-4">{DateFormat(item.data)} </h1>                                                           
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
                                                        {valorTotal = item.servicos.reduce( (valorAnterior, valorAtual) => valorAnterior + Number(valorAtual.preco), 0)}
                                                    </div>
                                                </div>                  

                                                {item.agendas.map((item) => {
                                                    let agenda_id = item.agenda_id
                                                    return(
                                                        <div className="flex flex-start m-4" key={item.id}>
                                                            <div style={{paddingRight:"0.5rem"}}>                                                                        
                                                                <Button variant="outlined" onClick={e => handleClickOpen(0, contrato_id, itemContrato_id, agenda_id)} className="hover:bg-[#29B6D1] hover:text-white hover:transition-colors">
                                                                    <MdCancel className="fill-current h-5 w-5"/>
                                                                    <div className="ml-1">
                                                                        Cancelar servico
                                                                    </div>
                                                                </Button>
                                                            </div>                                                            
                                                            { role === "PROFISSIONAL" && userProfissional_id === userLogadoId ? (
                                                                <Button variant="outlined" onClick={e => handleClickOpen(1, contrato_id, itemContrato_id, agenda_id)} className="hover:bg-[#29B6D1] hover:text-white hover:transition-colors">
                                                                    <MdLibraryAddCheck className="fill-current h-5 w-5"/>
                                                                    <div className="ml-1">
                                                                        Finalizar servico
                                                                    </div>
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
                                                                        {"Certeza que deseja cancelar esse serviço?"}
                                                                    </DialogTitle>  
                                                                ) : (
                                                                    <DialogTitle>
                                                                        {"Certeza que deseja finalizar esse serviço?"}
                                                                    </DialogTitle>
                                                                )}   

                                                                <DialogActions>
                                                                    <Button onClick={handleClose}>
                                                                        Cancelar
                                                                    </Button>
                                                                    { opcao.startsWith('C') ? (
                                                                        <Button onClick={(e) => handleCancelar()} autoFocus>
                                                                            Confirmar
                                                                        </Button>
                                                                    ) : (
                                                                        <Button onClick={(e) => handleFinalizar()} autoFocus>
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
                    )}
                </div>
            </div> 
        </div>
      </>
    );
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