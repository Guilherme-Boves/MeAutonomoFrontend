import React, { useContext, useState } from "react";
import { ReturnButton } from "../../../../../../../../../components/ui/ReturnButton";
import styles from './styles.module.css'
import { canSSRAuth } from "../../../../../../../../../utils/canSSRAuth";
import { setupAPIClient } from "../../../../../../../../../services/api";
import 'antd/dist/antd.css';
import { Select } from 'antd';
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { FiThumbsUp } from "react-icons/fi"
import jsonWebTokenService from 'jsonwebtoken'
import {parseCookies } from 'nookies';

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
        dia: string;
        mes: string;
        horario: string;
        status: boolean;
    }]
}

interface PerfilProps {
    perfilProf: ItemProps[];
}

type ServicoProps = {
    id: string;
}

export default function Contrato({ perfilProf }: PerfilProps){
    
    const router = useRouter();
    const [pagina, setPagina] = useState(0)
    const [perfil, setPerfil] = useState(perfilProf || []);
    const [servicos, setServicos] = useState<ServicoProps[] | []>([]);
    const [agendas, setAgendas] = useState([]);
    
   
    const handleServico = (servico) => {                                             
        setServicos(servico)        
    }

    const handleAgenda = (agenda) => {                                             
        setAgendas(agenda)        
    }

    function handleRetornar(){

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

    async function handleContratar(){

        if(servicos.length === 0){
            toast.warn('Selecione 1 ou mais serviços')
            return;
        }

        if(agendas.length === 0){
            toast.warn('Selecione 1 ou mais horários')
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

            const { id } = response.data
            let i = 0;
        
            while(i < servicos.length){
                console.log('entro servico')
                await api.post('/contrato/addservico', {
                    itemContrato_id: id,
                    servico_id: servicos[i]
                })                
                i++;
            }

            i = 0;
            while(i < agendas.length){
                console.log('entro agenda')
                await api.post('/contrato/addagenda', {
                    itemContrato_id: id,
                    agenda_id: agendas[i]
                })                
                i++;
            }

            toast.success('Contrato realizado com sucesso!')
            setPagina((paginaAtual) => paginaAtual + 1)

        } catch(err){
            console.log('Ops! Erro inesperado: ' + err)
        }

    }

    const PageDisplay = () => {
        if(pagina === 0){
            return(
                <>
                    <ReturnButton/>
                    <div className={styles.container}>
                        <h1 className={styles.title}>Escolha os serviços desejados e horários</h1>
                        <div className={styles.cardContainer}>
                            <h1 className={styles.cardTitle}>Serviços Prestados</h1>
                            <div >
                                                                    
                                {perfil.map((item) => {

                                    return(
                                        <div key={item.id}>
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{
                                                    width: '50%',
                                                }}
                                                placeholder="Selecione um ou mais serviços"
                                                defaultValue={[]}
                                                onChange={handleServico}
                                            >
                                                {item.servicosPrestadosProf.map((item)=> {
                                                    
                                                    return(
                                                        <Select.Option key={item.id}>{item.nome} - R${item.preco}</Select.Option>
                                                    )
                                                })}
                                            </Select>
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
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                style={{
                                                    width: '50%',
                                                }}
                                                placeholder="Selecione um ou mais horários"
                                                defaultValue={[]}
                                                onChange={handleAgenda}
                                            >
                                                {item.agenda.map((item)=> {                                        
                                                    return(
                                                        <Select.Option key={item.id} value={item.id}>{item.dia} de {item.mes} - {item.horario}h</Select.Option>
                                                    )
                                                })}
                                            </Select>
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
                    <button className={styles.buttonRetornar} onClick={handleRetornar}>
                        Retornar para o menu principal
                    </button>
                </div>
            )
        }
    }
    
    return(
 
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