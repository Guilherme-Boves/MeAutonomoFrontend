import React, { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/router";
import { setupAPIClient } from "../../../services/api";
import { canSSRProf } from "../../../utils/canSSRProf";
import { FiTrash } from "react-icons/fi";

import { TextField } from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ptBR } from 'date-fns/locale'

import styles from './styles.module.css'
import { toast } from "react-toastify";
import { containsNumbers, DateFormat, isDataDoisMesesAdiante, isNumeric } from "../../../utils/Functions";
import { ReturnButtonWithFunction } from "../../../components/ui/ReturnButtonWithFunction";

type ItemPublicacaoRecebidaProps = {
    id: string;
    items: [{
            id: string;
            descricao: string;
            publicacao_id: string;
            tipoDoServico_id: string;
            tipoDoServico: {
                id: string;
                nome: string;
                categoria_id: string;
            },
            servicosPrestadosProf: [{
                id: string;
                nome: string;
                preco: string;
                item_id: string;
            }],            
            agenda: [{
                id: string;
                data: string;
                item_id: string;
            }]
        }
    ]
}

type ItemCategoriaProps = {
    id: string;
    nome: string; 
}

type TipoServicoProps = {
    id: string;
    nome: string;
}

type ItemPublicacao = {
    id: string;
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

interface PublicacaoProps {
    publicacaoRecebida: ItemPublicacaoRecebidaProps;
}

export default function NovaPublicacao({publicacaoRecebida}: PublicacaoProps){

    const router = useRouter();
    
    const [pagina, setPagina] = useState(0);

    const [publicacao, setPublicacao] = useState(publicacaoRecebida)
    const [servicos, setServicos] = useState<Servicos[]>();

    const [categoria, setCategoria] = useState('');    
    const [tipoServicoId, setTipoServicoId] = useState('');
    const [tipoServicoNome, setTipoServicoNome] = useState('');

    const [descricao, setDescricao] = useState('');    
    const [nomeServico, setNomeServico] = useState('');
    const [preco, setPreco] = useState('');
    const [dataAgenda, setDataAgenda] = useState(new Date())
    const [itemId, setItemId] = useState<ItemPublicacao>();
 
    const [agendas, setAgendas] = useState<Agendas[]>([]);

    useEffect(() => {
        async function loadInfosLocalStorage() {

            setDescricao(localStorage.getItem("ls_descricao"))
            setServicos(JSON.parse(localStorage.getItem("ls_servicos")))   
            setAgendas(JSON.parse(localStorage.getItem("ls_agendas")))                
            setCategoria(localStorage.getItem("ls_categoria"))       
            
            setTipoServicoId(localStorage.getItem("ls_tiposervicoid"))
            setTipoServicoNome(localStorage.getItem("ls_tiposerviconome"))

            /** Recuperando o id da tabela ItemPublicacao. 
             * ID necessário para quando formos adicionar novos serviços ou agendas para a publicação, desta forma
             * o sistema saberá qual publicação aquele serviço ou agenda pertencerá
             * **/
            const itemId = publicacao.items.map((item) => item.id)            
            setItemId({id: itemId[0].toString()})
            
        }

        loadInfosLocalStorage()
    }, [publicacao.items])
    
    function handleNextForm(){

        if(descricao === '' || descricao.length === 0){
            toast.warning('Insira uma descrição!')
            return;
        }
        setPagina((paginaAtual) => paginaAtual + 1)
    }

    async function handleUpdateInfos(){

        const publicacao_id = router.query.publicacao_id

        if(descricao === '' || descricao.length === 0){
            toast.warning('Insira uma descrição!')
            return;
        }

        if(publicacao_id === ''){
            console.log('Não foi encontrado o ID da publicação!')
            return;
        }

        if(!tipoServicoId){
            console.log('Não foi encontrado o tipoServicoID!')
            return;
        }

        if(!servicos || servicos.length === 0){
            toast.error("Adicione um serviço!")
            return;
        }
        
        if(!agendas || agendas.length === 0){
            toast.error("Adicione uma agenda!")
            return;
        }   
        
        try{
            const api = setupAPIClient();

            await api.put('/publicarservico/update', {
                item_id: itemId.id,
                descricao: descricao,
                publicacao_id: publicacao_id,                
                tipoDoServico_id: tipoServicoId
            })

            localStorage.clear()

            toast.success("Publicação editada com sucesso!")
            router.back()
            
        } catch(err) {
            const { error } = err.response.data
            toast.error(error)
        }
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
        
        await api.post('/servicosprestados', {
            nome: nomeServico,
            preco: preco,
            item_id: itemId.id
                
        }).then(function (response) {
            setServicos((oldArray => [...oldArray, response.data]))
            setNomeServico('')
            setPreco('')
        }).catch(function (err) {
            const {error} = err.response.data
            toast.error(error)            
        });

    }

    const handleChangeAgenda = (newValue) => {
        setDataAgenda(newValue)
    }

    async function handleAddAgenda(e: FormEvent){

        e.preventDefault();

        if(!dataAgenda){
            toast.warning('Informe uma data!');
            return;
        }

        if(Number(dataAgenda) < Date.now()){
            toast.warning("Data inválida!");
            return;
        }

        if(!isDataDoisMesesAdiante(dataAgenda)){
            return;
        }

        const api = setupAPIClient();

        await api.post('/agenda', {
            data: dataAgenda,
            item_id: itemId.id
        }).then(function (response) {
            setAgendas((oldArray => [...oldArray, response.data]))
        }).catch(function (err) {
            const {error} = err.response.data;
            toast.error(error);
        });
    }

    function handleReturn(){
        if(servicos.length === 0) {
            toast.error("Adicione um serviço antes de finalizar a edição!")
            return;
        } else if(agendas.length === 0) {
            toast.error("Adicione uma agenda antes de finalizar a edição!")
            return;
        }

        localStorage.clear()
        router.back()
    }

    const PageDisplay = () => {
        if (pagina == 0){
            return(
                <form className={styles.form}>
                                     
                    <div className={styles.select}>
                        {categoria}
                    </div>
                    <div className={styles.select}>
                        {tipoServicoNome}
                    </div>

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
                        <h1 className={styles.titulo} style={{paddingTop:'0'}}>Agenda</h1>
                        <div className={styles.inputDatePickerContainer}>
                            <div className={styles.datePickerContainer}>
                                <LocalizationProvider adapterLocale={ ptBR } dateAdapter={AdapterDateFns}>
                                    <DateTimePicker
                                        renderInput={(props) => <TextField placeholder={`${Date.now()}`} {...props} />}
                                        label="DateTimePicker"                               
                                        className={styles.datePicker}
                                        value={dataAgenda}
                                        onChange={handleChangeAgenda}
                                    />
                                </LocalizationProvider>
                            </div>
                            <div className={styles.btnAddAgendaContainer}>
                                <button 
                                    className={styles.inputAddAgenda} 
                                    style={{
                                        backgroundColor:'#12AFCB', 
                                        color:'#fff'
                                    }}
                                    type="submit"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </form>
                    {servicos.length === 0 ?(
                        <></>
                    ) : (
                        <div>
                            <div className={styles.subtitle}>
                                <h1>Serviços</h1>
                            </div>
                            {servicos.map((item: Servicos) => {
                                return(
                                    <div key={item.id} className={styles.listaDeServicosAgendas}>
                                        <h1>{item.nome} - R${item.preco}</h1>
                                        <button onClick={e => handleDeleteItemServico(item.id)}>
                                            <FiTrash size={24}/>
                                        </button>
                                    </div>
                                    )
                                })
                            }
                        </div>              
                        )}
                    {agendas.length === 0 ? (
                        <></>
                    ) : (
                        <div>
                            <div className={styles.subtitle}>
                                <h1>Agendas</h1>
                            </div>
                            {agendas.map((item: Agendas) => {
                                return(
                                    <div key={item.id} className={styles.listaDeServicosAgendas}>
                                        <h1>{DateFormat(item.data)}</h1>
                                        <button onClick={e => handleDeleteItemAgenda(item.id)}>
                                            <FiTrash size={24}/>
                                        </button>
                                    </div>
                                    )
                                })
                            }
                        </div>   
                        )}                   
                </div>
            )
        }
    }

    return(

        <>
            <div className='ml-10 p-3'>
                <ReturnButtonWithFunction onClick={handleReturn}/>
            </div>
            <main className="bg-white rounded-md shadow-md mx-auto w-[720px]">
                <h1 className="font-semibold text-3xl ml-12 pt-10 ">Publicar Serviço</h1>

                <div className="{styles.body}">
                    {PageDisplay()}
                </div>

                <div className={styles.botoes}>
                    {pagina == 0 ? (
                        <></>
                    ) : (
                        <button 
                        className={styles.input} 
                        style={{
                            backgroundColor:'#12AFCB', 
                            color:'#fff', 
                            maxWidth:'85%', 
                            fontWeight:"bold"                        
                            }}                    
                        onClick={() => { setPagina((paginaAtual) => paginaAtual - 1) }}
                    >
                        Retornar
                    </button>
                    )}
                    <button 
                        className={styles.input}                        
                        style={{
                            backgroundColor:'#FFD666', 
                            color:'#8D734B', 
                            maxWidth:'100%', 
                            fontWeight:"bold"
                            }}
                            onClick={() => {
                                if(pagina === 1){
                                    handleUpdateInfos();
                                } else {
                                    handleNextForm();
                                }
                            }}
                        >
                        {pagina === 0 ? "Continuar" : "Salvar informações"}
                    </button>
                </div>
            </main>
        </>
    )
}

export const getServerSideProps = canSSRProf(async (ctx) => {

    const api = setupAPIClient(ctx)

    const responsePublicacao = await api.get('/publicacao', {
        params:{
            publicacao_id: ctx.query.publicacao_id
        }
    })

    return{
        props: {            
            publicacaoRecebida: responsePublicacao.data
        }
    }
})