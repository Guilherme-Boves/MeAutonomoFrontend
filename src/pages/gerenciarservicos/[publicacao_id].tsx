import React, { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/router";
import { setupAPIClient } from "../../services/api";
import { canSSRProf } from "../../utils/canSSRProf";
import { FiTrash } from "react-icons/fi";

import { TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ptBR } from 'date-fns/locale'

import styles from './styles.module.css'
import { toast } from "react-toastify";
import { DateFormat } from "../../utils/Functions";

type ItemCategoriaProps = {
    id: string;
    nome: string; 
}

type TipoServicoProps = {
    id: string;
    nome: string;
}

type ItemPublicacao = {
    descricao: string;
    id: string;
    publicacao_id: string;
    tipoDoServico_id: string;
}

type Servicos = {
    id: string;
    nome: string;
    preco: string;
    item_id: string;
}

type Agendas = {
    id: string;
    data: string;
    item_id: string;
}
 
interface CategoriaProps {
    listCategoria: ItemCategoriaProps[];
}

export default function NovaPublicacao({ listCategoria }: CategoriaProps){

    const router = useRouter();
    
    const [pagina, setPagina] = useState(0);
    
    const [categorias, setCategorias] = useState(listCategoria || []);
    const [categoriaSelecionada, setCagoriaSelecionada] = useState(0);

    const [tipoServico, setTipoServico] = useState<TipoServicoProps[] | []>([]);
    const [tipoServicoSelecionada, setTipoServicoSelecionada] = useState(0);

    const [descricao, setDescricao] = useState('');

    const [nomeServico, setNomeServico] = useState('');
    const [preco, setPreco] = useState('');

    const [dataAgenda, setDataAgenda] = useState(new Date())

    const [itemId, setItemId] = useState<ItemPublicacao>();
    const [itemIdAux, setitemIdAux] = useState('');

    const [servicos, setServicos] = useState<Servicos[]>([]);
    const [agendas, setAgendas] = useState<Agendas[]>([]);

    const [loadingServicos, setLoadingServicos] = useState(false)
    const [loadingAgenda, setLoadingAgenda] = useState(false)

    const [countServicos, setCountServicos] = useState(0)
    const [countAgendas, setCountAgendas] = useState(0)
    

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
   
    function handleChangeCategoria(event){
        setCagoriaSelecionada(event.target.value)
    }

    function handleChangeTipoServico(event){
        setTipoServicoSelecionada(event.target.value)
    }

    function containsNumbers(str){        
        const regexNome = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
        return regexNome.test(str);
    }

    function isNumeric(str) {
        return /^-?\d+$/.test(str);
    }

    async function handleCadastarPrimeirasInfos(){

        const publicacao_id = router.query.publicacao_id

        if(categorias.length === 0){
            toast.error("Selecione uma categoria!")
            return;
        }

        if(tipoServico.length === 0){
            toast.error("Selecione um Serviço!")
            return;
        }

        if(descricao === ''){
            toast.warning('Preencha todos os campos!')
            return;
        }

        if(publicacao_id === ''){
            console.log('Não foi encontrado o ID da publicação!')
            return;
        }

        if(tipoServico[tipoServicoSelecionada].id === ''){
            toast.warning('Selecione o tipo de serviço!')
            return;
        }        
        
        const api = setupAPIClient();

        try{
            const response = await api.post('/publicarservico/add', {
                descricao: descricao,
                publicacao_id: publicacao_id,
                tipoDoServico_id: tipoServico[tipoServicoSelecionada].id
            })
            
            const idItem = response.data
            setItemId(idItem.id)
            setitemIdAux(idItem.id)
            setPagina((paginaAtual) => paginaAtual + 1)
        } catch(err){
            toast.error(`Você já têm uma publicação como: ${tipoServico[tipoServicoSelecionada].nome}`)
            return;
        }
    }

    async function handleUpdateInfos(item_id: string){
        
        const publicacao_id = router.query.publicacao_id

        if(descricao === ''){
            toast.warning('Preencha todos os campos!')
            return;
        }

        if(publicacao_id === ''){
            console.log('Não foi encontrado o ID da publicação!')
            return;
        }

        if(tipoServico[tipoServicoSelecionada].id === ''){
            toast.warning('Selecione o tipo de serviço!')
            return;
        }      
        
        const api = setupAPIClient();

        await api.put('/publicarservico/update', {
            item_id: item_id,
            descricao: descricao,
            publicacao_id: publicacao_id,
            tipoDoServico_id: tipoServico[tipoServicoSelecionada].id
        })

        setitemIdAux(item_id)
        
        setPagina((paginaAtual) => paginaAtual + 1)

    }
    

    async function handleDeleteItemServico(servico_id: string){
        
       const api = setupAPIClient();

        await api.delete('/servicosprestados/delete', {
            params:{
                servico_id: servico_id
            }
        })

        let removeItemServico = servicos.filter( item => {
            return (item.id !== servico_id)
        })

        setServicos(removeItemServico)
        setCountServicos(-1);
        
    }

    async function handleDeleteItemAgenda(agenda_id: string){
        
        const api = setupAPIClient();

        await api.delete('/agenda/delete', {
            params:{
                agenda_id: agenda_id
            }
        })

        let removeItemAgenda = agendas.filter( item => {
            return (item.id !== agenda_id)
        })

        setAgendas(removeItemAgenda)
        setCountAgendas(-1);
    }

    async function handleDeleteItem(item_id: string) {
        
        const api = setupAPIClient();

        await api.delete('/publicarservico/delete', {           
            params:{
                item_id: item_id
            }
        })     

    }

    async function handlePublicar() {

        if(countServicos === 0){
            toast.error("Adicione um serviço!")
            return;
        }
        
        if(countAgendas === 0){
            toast.error("Adicione uma agenda!")
            return;
        }

        const publicacao_id = router.query.publicacao_id

        const api = setupAPIClient();

        await api.put('/publicarservico', {
                publicacao_id: publicacao_id                
        }).then(function (response) {
            toast.success('Publicação criada com sucesso!')
            router.back();
        }).catch(function (error) {
            console.log(error);
        });

    }

    async function handleAddServicoPrestado(e: FormEvent){
        e.preventDefault();

        if(nomeServico === ''){
            toast.warning('Preencha todos os campos (Nome do serviço e Preço)');
            return;
        }
        
        if(preco === ''){
            toast.warning('Preencha todos os campos (Nome do serviço e Preço)');
            return;
        }

        if(!containsNumbers(nomeServico)){ // Verificando se o nome do serviço prestado possui números ou caracteres inválidos.
            toast.error("Nome do serviço prestado inválido")
            return;
        }

        if(!isNumeric(preco)){
            toast.error("Preço inválido!")
            return;
        }

        const api = setupAPIClient();
        
        setLoadingServicos(true)
        await api.post('/servicosprestados', {
            nome: nomeServico,
            preco: preco,
            item_id: itemId
                
        }).then(function (response) {
            setServicos((oldArray => [...oldArray, response.data]))
            setLoadingServicos(false)
            setNomeServico('')
            setPreco('')

            setCountServicos(+1);

        }).catch(function (error) {
            setLoadingServicos(false)            
        });

    }

    const handleChangeAgenda = (newValue) => {
        setDataAgenda(newValue)
    }

    async function handleAddAgenda(e: FormEvent){

        e.preventDefault();

        // if(dataAgenda === ''){
        //     toast.warning('Informe uma data!');
        //     return;
        // }

        //let splittedDate = dataAgenda.split('-')
        //dataAgenda = `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        
        const api = setupAPIClient();

        setLoadingAgenda(true)
        await api.post('/agenda', {
            data: dataAgenda,
            item_id: itemId
        }).then(function (response) {

            setAgendas((oldArray => [...oldArray, response.data]))
            setLoadingAgenda(false)

            setCountAgendas(+1);

        }).catch(function (err) {
            setLoadingAgenda(false)
            const {error} = err.response.data;
            toast.error(error);
        });
    }

    async function deletePublicacao() {

        const api = setupAPIClient();
        
        if(servicos.length > 0) {
            servicos.map((item) => {
                handleDeleteItemServico(item.id)
                setNomeServico('')
                setPreco('')
                setServicos([])
            })
        }

        if(agendas.length > 0) {
            agendas.map((item) => {
                handleDeleteItemAgenda(item.id)
                //setDataAgenda('');                
                setAgendas([])
            })
        }

        if(itemIdAux != ''){
            handleDeleteItem(itemIdAux)
        }
        
        await api.delete('/publicarservico', {
            params:{
                publicacao_id: router.query.publicacao_id
            } 
        })

        
    }

    const PageDisplay = () => {
        if (pagina == 0){
            return(
                <form className={styles.form}>
                 
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

                    {tipoServico.length === 0 ? (
                        <select className={styles.select}>                                                                    
                            <option>
                                {"Selecione um tipo de serviço"}
                            </option>    
                        </select>
                    ) : (
                        <select className={styles.select} value={tipoServicoSelecionada} onChange={handleChangeTipoServico}>
                            {tipoServico.map( (item, index) => {
                                return(
                                    <option key={item.id} value={index}>
                                        {item.nome}
                                    </option>
                                )
                            })}
                        </select>
                    )}
                    
                    <h1 className={styles.titulo} style={{paddingTop:'1rem'}}>Descrição</h1>
                    
                    <textarea                     
                        className={styles.descricao}
                        maxLength={265}
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </form>
            )
        } else {
            return(
                <div>
                    <form className={styles.form} onSubmit={handleAddServicoPrestado}>
                        <h1 className={styles.titulo} style={{paddingTop:'1rem'}}>Serviços Prestados</h1>                
                        <div className={styles.inputContainer}>
                            <input className={styles.input}
                                placeholder="Nome"
                                type='text'
                                value={nomeServico}
                                onChange={(e) => setNomeServico(e.target.value)}
                            />

                            <input 
                                className={styles.input}
                                placeholder="Preço"
                                type='text'
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                            />

                            <button 
                                className={styles.input} 
                                style={{
                                    backgroundColor:'#12AFCB', 
                                    color:'#fff'
                                    }}
                                type="submit"
                            >
                                +
                            </button>

                        </div>
                        
                    </form>

                    <form className={styles.form} onSubmit={handleAddAgenda}>
                        <h1 className={styles.titulo} style={{paddingTop:'1rem'}}>Agenda</h1>
                        <div className={styles.inputContainer}>
                            <LocalizationProvider adapterLocale={ ptBR } dateAdapter={AdapterDateFns}>
                                <DateTimePicker
                                    renderInput={(props) => <TextField placeholder={`${Date.now()}`} {...props} />}
                                    label="DateTimePicker"                               
                                    className={styles.datePicker}
                                    value={dataAgenda}
                                    onChange={handleChangeAgenda}
                                />
                            </LocalizationProvider>
                            <button 
                                className={styles.input} 
                                style={{
                                    backgroundColor:'#12AFCB', 
                                    color:'#fff'
                                }}
                                type="submit"
                            >
                                +
                            </button>
                        </div>
                    </form>
                    {loadingServicos ? (
                        <></>
                    ) : (
                        servicos.map((item: Servicos) => {
                            return(
                                <div key={item.id} className={styles.items}>
                                    <h1>{item.nome} - R${item.preco}</h1>
                                    <button onClick={e => handleDeleteItemServico(item.id)}>
                                        <FiTrash size={24}/>
                                    </button>
                                </div>
                                )
                            })
                        )}

                    {loadingAgenda ? (
                        <></>
                    ) : (
                        agendas.map((item: Agendas) => {
                            return(
                                <div key={item.id} className={styles.items}>
                                    <h1>{DateFormat(item.data)}</h1>
                                    <button onClick={e => handleDeleteItemAgenda(item.id)}>
                                        <FiTrash size={24}/>
                                    </button>
                                </div>
                                )
                            })
                        )}   
                </div>
            )
        }
    }

    return(

        <>
            <main className={styles.container}>
                <h1 className={styles.titulo}>Publicar Serviço</h1>

                <div className={styles.body}>
                    {PageDisplay()}
                </div>

                <div className={styles.botoes}>
                    <button 
                        className={styles.input} 
                        style={{
                            backgroundColor:'#12AFCB', 
                            color:'#fff', 
                            maxWidth:'85%', 
                            fontWeight:"bold"                        
                            }}                    
                        onClick={() => {
                                if( pagina === 0) {
                                    deletePublicacao();                                           
                                    router.back()
                                } else {
                                    setPagina((paginaAtual) => paginaAtual - 1)
                                }
                            }
                        }
                    >
                        Retornar
                    </button>
                    <button 
                        className={styles.input} 
                        style={{
                            backgroundColor:'#12AFCB', 
                            color:'#fff', 
                            maxWidth:'85%', 
                            fontWeight:"bold"
                            }}
                        onClick={() => {
                            if(pagina === 1){
                                handlePublicar();
                            } else {
                                if(itemIdAux != ''){
                                    handleUpdateInfos(itemIdAux);
                                } else {
                                    handleCadastarPrimeirasInfos();
                                }
                            }
                        }}
                    >
                        {pagina === 0 ? "Continuar" : "Publicar"}
                    </button>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRProf(async (ctx) => {

    const api = setupAPIClient(ctx)

    const response = await api.get('/categoria')

    return{
        props: {
            listCategoria: response.data
        }
    }
})