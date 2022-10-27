import React, { useState } from "react";
import styles from './styles.module.css'

import { ReturnButton } from "../../components/ui/ReturnButton";
import Link from "next/link";
import { canSSRAdmin } from "../../utils/canSSRAdmin";
import { setupAPIClient } from "../../services/api";
import Image from "next/image";
import { FiEdit, FiTrash } from "react-icons/fi";
import Router from "next/router";
import Head from "next/head";
import { toast } from "react-toastify";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

type ItemCategoriaProps = {
    id: string;
    nome: string;
    imagem: string;
}

interface ListCategorias {
    listaCategorias: ItemCategoriaProps[];
}


export default function Categorias({ listaCategorias }: ListCategorias){

    const [categorias, setCategorias] = useState(listaCategorias || []);
    const [open, setOpen] = useState(false);
    const [categoriaSelecionadaId, setCategoriaSelecionadaId] = useState('');
    const [categoriaSelecionadaNome, setCategoriaSelecionadaNome] = useState('');

    const handleClickOpen = (categoria_id: string, nomeCategoria: string) => {
        setOpen(true);
        setCategoriaSelecionadaId(categoria_id)
        setCategoriaSelecionadaNome(nomeCategoria)
    };

    const handleClose = () => {
        setOpen(false);
    };


    function handleEditCategoria(categoria_id: string) {
        Router.push(`/categorias/edit/${categoria_id}`)
    }

    async function handleDeleteCategoria(categoria_id: string) {
        
        const api = setupAPIClient()
        
        try{
           await api.delete('/categoria/delete', {
                params:{
                    categoria_id: categoria_id,
                }
            })

            let removeCategoria = categorias.filter( item => {
                return (categoria_id !== item.id)
            })
    
            setCategorias(removeCategoria)
            toast.success("Categoria excluída com sucesso!")
        }catch(err){
            const { error } = err.response.data
            toast.error(error)
        }
        
        setOpen(false)
    }

    return(
        <>
            <Head>
                <title>Categorias</title>
            </Head>
            <div>
                <ReturnButton/>
                <div className={styles.container}>
                    <div className={styles.containertitle}>
                        <h1>Categorias cadastradas</h1>
                        <div className={styles.novaCategoria}>
                            <Link href={"/categorias/cadastrar"}>
                                <a>
                                    Nova categoria
                                </a>
                            </Link>
                        </div>
                    </div>
                    <div className={styles.cardContainer} >
                        {categorias.length === 0 ? (
                            <h1>Nenhuma categoria foi encontrada</h1>
                        ) : (
                            categorias.map((item) => {
                                return(
                                    <div key={item.id} className={styles.card}>
                                        <div className={styles.titleFiEditContainer}>
                                            <div>
                                                <h1 className={styles.title}>{item.nome}</h1>
                                            </div>
                                            <div className={styles.fiButtonsContainer}>
                                                <button onClick={e => handleEditCategoria(item.id) }>
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
                                                    alt={"Imagem da categoria"}
                                                    width={100}
                                                    height={100}                                        
                                                />
                                            </div>
                                        </div>    
                                    </div>
                                )
                            })
                        )}
                        <Dialog
                            open={open}
                            onClose={handleClose}                                                                    
                        >
                            <DialogTitle>
                                {`Você tem certeza que deseja excluir a categoria ${categoriaSelecionadaNome}?`}
                            </DialogTitle>     

                            <DialogActions>
                                <Button onClick={handleClose}>
                                    Cancelar
                                </Button>
                                <Button onClick={(e) => handleDeleteCategoria(categoriaSelecionadaId)} autoFocus>
                                    Confirmar
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAdmin(async (ctx) => {
    
    const api = setupAPIClient(ctx);

    const response = await api.get("/categorias")
    
    return{
        props: {
            listaCategorias: response.data
        }
    }
})