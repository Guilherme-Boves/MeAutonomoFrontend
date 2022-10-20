import React, { useState } from "react";
import { useRouter } from "next/router";
import { canSSRAuth } from "../../../../../../../../../utils/canSSRAuth";
import { setupAPIClient } from "../../../../../../../../../services/api";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import styles from './styles.module.css'
import jsonWebTokenService from 'jsonwebtoken'
import { parseCookies } from 'nookies';
import { FiArrowLeft } from 'react-icons/fi'
import { toast } from "react-toastify";
import { FiThumbsUp } from "react-icons/fi"
import { DateFormat } from "../../../../../../../../../utils/Functions";

type ItemProps = {
    id: string;
    descricao: string;
    publicacao_id: string;
    tipoDoServico: {
        id: string;
        nome: string;
        imagem: string;
    },
    publicacao:{
        id:string;
        user:{
            id: string;
            nome: string;
            imagem: string;
            userProfissional: {
                descricaoSobreMim: string;
            }
        }
    },
    servicosPrestadosProf:[{
        id: string;
        nome: string;
        preco: string;        
    }],
    agenda: [{
        id: string;
        data: string;
        status: boolean;
    }]
}

interface PerfilProps {
    perfilProf: ItemProps[];
}

export default function Contrato({ perfilProf }: PerfilProps){
    
    const router = useRouter();
    const [pagina, setPagina] = useState(0)
    const [perfil, setPerfil] = useState(perfilProf || []);
    const [servicos, setServicos] = useState<string[] | []>([]);
    const [agenda, setAgenda] = useState('');
  
    const handleChangeServico = (event: SelectChangeEvent<typeof servicos>) => {
        setServicos(event.target.value as string[]);
    };

    const handleChangeAgenda = (event: SelectChangeEvent) => {
        setAgenda(event.target.value as string);        
      };

    function handleRetornarMenuPrincipal(){

        const { '@meautonomo.token': token } = parseCookies();
        const decodedJwt = jsonWebTokenService.decode(token)
            
        if(decodedJwt.role === "CLIENTE"){
            router.push('/dashboard/cliente')
        } else if(decodedJwt.role === "PROFISSIONAL") {
            router.push('/dashboard/profissional')
        } else if(decodedJwt.role === "ADMIN") {
            router.push('/dashboard/admin')
        }
    }

    async function handleDeleteContrato(){
        
        const contrato_id = router.query.contrato_id

        const api = setupAPIClient();

        try{
            await api.delete('/contrato', {
                params:{
                    contrato_id
                }
            })

            router.back()
        } catch(err){
            console.log('Erro ao deletar contrato')
        }       
        
    }

    async function handleContratar(){

        if(servicos.length === 0){
            toast.warn('Selecione 1 ou mais serviços')
            return;
        }

        if(agenda === undefined || agenda === ''){
            toast.warn('Selecione um horário')
            return;
        }
        
        let publicacaoId = perfil.map((item) => item.publicacao_id)        
        const contrato_id = router.query.contrato_id;

        const api = setupAPIClient();

        try{
            const response = await api.post('/contrato/item', {
                contrato_id: contrato_id,
                publicacao_id: publicacaoId[0]
            })

            const { createItemContrato } = response.data
            const { id } = createItemContrato

            let i = 0;
            while(i < servicos.length){
                await api.post('/contrato/addservico', {
                    itemContrato_id: id,
                    servico_id: servicos[i]
                })                
                i++;
            }

            await api.post('/contrato/addagenda', {
                itemContrato_id: id,
                agenda_id: agenda
            })    

            toast.success('Contrato realizado com sucesso!')
            setPagina((paginaAtual) => paginaAtual + 1)

        } catch(err){
            toast.error('Ops! Erro inesperado! Contate o suporte!')
        }

    }

    const PageDisplay = () => {
        if(pagina === 0){
            return(
                <>
                    <div onClick={handleDeleteContrato} className={styles.containerButtonRetornarPagina}>
                        <FiArrowLeft size={28} className={styles.buttonRetornarPagina} />
                    </div>

                    <div className={styles.container}>
                        <h1 className={styles.title}>Escolha os serviços desejados e horários</h1>
                        <div className={styles.cardContainer}>
                            <h1 className={styles.cardTitle}>Serviços Prestados</h1>
                            <div>                              
                                {perfil.map((item) => {

                                    return(
                                        <div key={item.id}>
                                            <FormControl sx={{ minWidth: 300, marginTop: '2rem' }} size="medium">
                                                <InputLabel id="demo-multiple-name-label">Serviços</InputLabel>
                                                    <Select
                                                        labelId="demo-multiple-name-label"
                                                        id="demo-multiple-name"
                                                        label={'Serviços'}                                                        
                                                        multiple                                                        
                                                        value={servicos}
                                                        onChange={handleChangeServico}
                                                    >
                                                    {item.servicosPrestadosProf.map((item) => (
                                                        <MenuItem
                                                            key={item.id}
                                                            value={item.id}                                                    
                                                        >
                                                            {item.nome} - R${item.preco}                                                    
                                                        </MenuItem>
                                                    ))} 
                                                    </Select>
                                            </FormControl>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={styles.cardContainer}>
                            <h1 className={styles.cardTitle}>Agenda Disponível</h1>
                            <div>        
                                {perfil.map((item) => {
                                    return(
                                        <div key={item.id}>
                                            <FormControl sx={{ minWidth: 300, marginTop: '2rem' }} size="medium">
                                                <InputLabel id="demo-multiple-name-label">Agenda</InputLabel>
                                                <Select
                                                    labelId="demo-multiple-name-label"
                                                    id="demo-multiple-name"      
                                                    label={'Agenda'}                                                                                                      
                                                    value={agenda}                                                    
                                                    onChange={handleChangeAgenda}
                                                    >
                                                    {item.agenda.map((item) => (
                                                        <MenuItem
                                                            key={item.id}
                                                            value={item.id}                                                    
                                                        >
                                                            {DateFormat(item.data)}
                                                        </MenuItem>
                                                    ))} 
                                                </Select>
                                            </FormControl>   
                                        </div>
                                    )
                                })}
                            </div>
                            
                            <div className={styles.buttonContainer}>
                                <button className={styles.button} onClick={handleContratar}>
                                    Contratar
                                </button>                        
                            </div>
                        </div>
                    </div>                    
                </>
            )
            
        }
        else{
            return(
                <div className={styles.contratoRealizado}>
                    <FiThumbsUp size={40} style={{marginBottom: '1rem'}}/>
                    Contrato Realizado com Sucesso!
                    <button className={styles.buttonRetornar} onClick={handleRetornarMenuPrincipal}>
                        Retornar para o menu principal
                    </button>
                </div>
            )
        }
    }
    
    return ( 
        <>
            <div>
                {PageDisplay()}
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    
    const tipoServicoId = ctx.query.perfis_id
    const profissionalId = ctx.query.perfil_id
    
    const api = setupAPIClient(ctx);
    
    const response = await api.get(`/perfil?perfis_id=${tipoServicoId}&perfil_id=${profissionalId}`)
    
    return {
        props: {
            perfilProf: response.data
        }
    }
    
})