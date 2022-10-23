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
                <ReturnButton/>
                <div className={styles.container}>
                    <div className={styles.containertitle}>
                        <h1>Serviços cadastrados</h1>
                        <div className={styles.novoServico}>
                            <Link href={"/tiposervico/cadastrar"}>
                                <a>
                                    Nova Serviço
                                </a>
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
                                    <div key={item.id} className={styles.card}>
                                        <div className={styles.titleFiEditContainer}>
                                            <div>
                                                <h1 className={styles.title}>{item.nome}</h1>
                                            </div>
                                            <div className={styles.fiButtonsContainer}>
                                                <button onClick={e => handleEditServico(item.id) }>
                                                    <FiEdit size={24} />                                            
                                                </button>
                                                <button onClick={e => {handleClickOpen(item.id, item.nome)}}>
                                                    <FiTrash size={24} />                                            
                                                </button>
                                            </div>  
                                        </div>
                                        <div className={styles.linhaHorizontal}></div>
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