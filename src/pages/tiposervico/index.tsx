import React, { useState, useEffect } from "react";
import styles from './styles.module.css'

import { ReturnButton } from "../../components/ui/ReturnButton";
import Link from "next/link";
import { canSSRAdmin } from "../../utils/canSSRAdmin";
import { setupAPIClient } from "../../services/api";
import Image from "next/image";
import { FiEdit, FiTrash } from "react-icons/fi";
import Router from "next/router";
import Head from "next/head";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { toast } from "react-toastify";
import { MdLibraryAdd } from "react-icons/md";


type ItemCategoriaProps = {
    id: string;
    nome: string;
    imagem: string;
}

type TipoServicoProps = {
    id: string;
    nome: string;
    imagem: string;
}

interface ListCategorias {
    listaCategorias: ItemCategoriaProps[];
}


export default function TipoDeServicos({ listaCategorias }: ListCategorias){

    const [categorias, setCategorias] = useState(listaCategorias || []) // UseState recebe a lista de categorias ou um array vazio
    const [categoriaSelecionada, setCagoriaSelecionada] = useState(0)
    const [open, setOpen] = useState(false)
    const [servicoSelecionadoId, setServicoSelecionadoId] = useState('');
    const [servicoSelecionadoNome, setServicoSelecionadoNome] = useState('');

    const [tipoServico, setTipoServico] = useState<TipoServicoProps[]>([]);

    const handleClickOpen = (servico_id: string, nomeServico: string) => {
        setOpen(true);
        setServicoSelecionadoId(servico_id)
        setServicoSelecionadoNome(nomeServico)
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        async function loadInfo() {

            const api = setupAPIClient();
            try{
                const response = await api.get('/tiposervico',{
                    params:{
                        categoria_id: categorias[categoriaSelecionada].id
                    }
                })

                setTipoServico(response.data)
            } catch(err){ // catch necessário para não quebrar a aplicação, pois se não tiver nenhum serviço cadastrado, irá retornar erro.
                return;
            }
        }

       loadInfo()
    }, [categorias, categoriaSelecionada])

    // Quando selecionar uma nova categoria na lista
    function handleChangeCategoria(event){
        setCagoriaSelecionada(event.target.value)
    }

    function handleEditServico(tipoServico_id: string) {
        Router.push(`/tiposervico/edit/${tipoServico_id}`)
    }

    async function handleDeleteServico(servico_id: string) {
        
        const api = setupAPIClient()
        
        try{
           await api.delete('/tiposervico/delete', {
                params:{
                    tipoServico_id: servico_id,
                }
            })

            let removeServico = tipoServico.filter( item => {
                return (servico_id !== item.id)
            })
    
            setTipoServico(removeServico)
            toast.success("Serviço excluído com sucesso!")
        }catch(err){
            const { error } = err.response.data
            toast.error(error)
        }
        
        setOpen(false)
    }

    return(
        <>
            <Head>
                <title>Tipo de Serviço</title>
            </Head>
            <div>
                <div className='ml-10 p-3'>
                    <ReturnButton/>
                </div>
                <div className="bg-white w-[850px] mx-auto rounded-lg flex flex-col p-10 mb-10">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-2xl'>Serviços Cadastrados</h1>
                        <div className="pb-5">
                            <Link href={"/tiposervico/cadastrar"}>
                                <button  className="group block max-w-xs mx-auto rounded-lg p-6 bg-[#12AFCB] ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-[#56CCF2] transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <MdLibraryAdd color='white'/>                              
                                        <h3 className="text-white group-hover:text-white text-sm font-semibold">Novo Serviço</h3>
                                    </div>
                                    <p className="text-white group-hover:text-white text-sm">Adicione um novo serviço!</p>
                                </button>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.cardContainer} >                       
                        <div className={styles.form}>
                            {categorias.length === 0 ? (
                                <select className={styles.select}>                                                                    
                                    <option>
                                        {"Selecione uma categoria"}
                                    </option>    
                                </select>
                            ) : (
                                <select className={styles.select} value={categoriaSelecionada} onChange={handleChangeCategoria}>
                                    {categorias.map( (item, index) => {
                                        return(                                    
                                            <option key={item.id} value={index}>
                                                {item.nome}
                                            </option>
                                        )
                                    })}
                                </select>
                            )}
                        </div>

                        <div style={{marginBottom:"3rem"}}>
                            {tipoServico.map((item) => {
                                return(
                                    <div key={item.id} className="p-4 mt-4 h-auto border-2 border-[#D3E2E5] rounded-lg w-[770px] shadow-md">
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="font-bold text-xl">{item.nome}</div>
                                            </div>
                                            <div className="space-x-5 pb-3">
                                                <button className='bg-[#12AFCB] rounded-lg h-7 w-7 hover:bg-[#56CCF2] transition-colors' onClick={e => handleEditServico(item.id) }>
                                                    <FiEdit size={20} color="white" className='mx-auto'/>                                            
                                                </button>                                                            
                                                <button className='bg-[#12AFCB] rounded-lg h-7 w-7 hover:bg-[#56CCF2] transition-colors' onClick={e => {handleClickOpen(item.id, item.nome)}}>
                                                    <FiTrash size={20} color="white" className='mx-auto' />                                            
                                                </button>
                                            </div>  
                                        </div>
                                        <div className="w-[100%] border-t-2 border-[#D3E2E5] pt-3"/>
                                        <div className={styles.subtitleImagemContainer}>
                                            <div className={styles.subtitle}>
                                                <h2>Imagem:</h2>
                                            </div>
                                            <div className={styles.imagemContainer}>
                                                <Image 
                                                    src={`http://localhost:3333/files/${item.imagem}`}
                                                    alt={"Imagem do serviço"}
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>
                                        </div>    
                                    </div>
                                )
                            })}
                            <Dialog
                                open={open}
                                onClose={handleClose}                                                                    
                            >
                                <DialogTitle>
                                    {`Você tem certeza que deseja excluir o serviço ${servicoSelecionadoNome}?`}
                                </DialogTitle>     

                                <DialogActions>
                                    <Button onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button onClick={(e) => handleDeleteServico(servicoSelecionadoId)} autoFocus>
                                        Confirmar
                                    </Button>
                                </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAdmin(async (ctx) => {
    
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/categorias')
    
    return {
        props: {
            listaCategorias: response.data
        }
    }
})