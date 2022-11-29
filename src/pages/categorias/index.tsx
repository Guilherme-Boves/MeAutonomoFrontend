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
import { MdLibraryAdd } from "react-icons/md";

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
                <div className='ml-10 p-3'>
                    <ReturnButton/>
                </div>
                <div className="bg-white w-[850px] mx-auto rounded-lg flex flex-col p-10 mb-10">
                    <div className="flex justify-between items-center">
                    <h1 className='font-bold text-2xl'>Categorias Cadastradas</h1>
                    <div className="pb-5">
                        <Link href={"/categorias/cadastrar"}>
                            <button  className="group block max-w-xs mx-auto rounded-lg p-6 bg-[#12AFCB] ring-1 ring-slate-900/5 shadow-lg space-y-3 hover:bg-[#56CCF2] transition-colors">
                                <div className="flex items-center space-x-3">
                                    <MdLibraryAdd color='white'/>                              
                                    <h3 className="text-white group-hover:text-white text-sm font-semibold">Nova Categoria</h3>
                                </div>
                                <p className="text-white group-hover:text-white text-sm">Adicione uma nova categoria!</p>
                            </button>
                        </Link>
                    </div>
                </div>
                    <div className={styles.cardContainer} >
                        {categorias.length === 0 ? (
                            <h1>Nenhuma categoria foi encontrada</h1>
                        ) : (
                            categorias.map((item) => {
                                return(
                                    <div key={item.id} className="p-4 mt-4 h-auto border-2 border-[#D3E2E5] rounded-lg w-[770px] shadow-md">
                                        <div className="flex justify-between">
                                            <div>
                                                <div className="font-bold text-xl">{item.nome}</div>
                                            </div>
                                            
                                            <div className="space-x-5 pb-3">
                                                <button className='bg-[#12AFCB] rounded-lg h-7 w-7 hover:bg-[#56CCF2] transition-colors' onClick={e => handleEditCategoria(item.id) }>
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