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
import { AiFillHome } from "react-icons/ai"
import { DateFormat } from "../../../../../../../../../utils/Functions";
import { ReturnButtonWithFunction } from "../../../../../../../../../components/ui/ReturnButtonWithFunction";
import { BsPersonCheckFill } from "react-icons/bs";
import { ButtonCancelWithFunction } from "../../../../../../../../../components/ui/ButtonCancelWithFunction";
import { Confeti } from "../../../../../../../../../components/Confeti";

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

type ServicosProps = {
    id: string;
    nome: string;
    preco: string;
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
                    nomePreco: servicos[i]
                })                
                i++;
            }

            //Split necessário para separar o id e a data da agenda selecionada pelo usuário
            let splittedAgendaIdData = agenda.split('/')
            let agenda_id = splittedAgendaIdData[0]
            let data = splittedAgendaIdData[1]

            await api.post('/contrato/addagenda', {
                contrato_id: contrato_id,
                itemContrato_id: id,
                data: data,
                agenda_id: agenda_id
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
                     {/* <div onClick={handleDeleteContrato} className={styles.containerButtonRetornarPagina}>
                         <FiArrowLeft size={28} className={styles.buttonRetornarPagina} />
                     </div> */}
                     <div className=" bg-fundo bg-cover bg-no-repeat bg-current w-screen h-screen flex flex-row justify-center items-center ">
                        <div className="w-[710px] h-[490px] mx-auto  flex flex-col justify-center border-collapse rounded-xl shadow-xl bg-gradient-to-b from-[#15B6D6] to-[#15D6D6] ">
                            
                            <h1 className="text-3xl text-center font-extrabold text-white p-8">
                                Escolha os serviços desejados e horários :)
                            </h1>
                            
                            <div className="flex flex-row ml-14">
                                <p className="text-xl font-extrabold py-3 text-[rgba(77,111,128,0.75)]">
                                    Serviços Prestados
                                </p>
                            </div>

                            <div className="flex flex-row ml-14 items-center">                              
                                 {perfil.map((item) => {
                                    return(
                                         <div key={item.id}>
                                             <FormControl className="bg-white rounded-md" sx={{ minWidth: 600}} size="medium">
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
                                                             value={`${item.nome}-${item.preco}`} //Passando o nome e o preço do serviço no array de serviços
                                                             //value={item.id}
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

                             <div className="flex flex-row ml-14">
                                <p className="text-xl font-extrabold py-3 text-[rgba(77,111,128,0.75)]">
                                    Agenda Disponível
                                </p>
                            </div>

                            <div className="flex flex-row ml-14 items-center">    
                                {perfil.map((item) => {
                                    return(
                                        <div key={item.id}>
                                            <FormControl className="bg-white rounded-md" sx={{ minWidth: 600}} size="medium">
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
                                                            //value={item.data}  
                                                            value={`${item.id}/${item.data}`} //Passando o Id e a data da agenda
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

                            <div className="flex flex-row items-center justify-end mr-14 mt-3">
                                <div className="m-10">
                                    <ButtonCancelWithFunction onClick={handleDeleteContrato}/>
                                </div>

                                <button className="w-52 text-lg h-14 flex items-center justify-center bg-[#FFD666] text-[#8D734B] rounded-lg font-extrabold gap-2 shadow-lg hover:bg-yellow-200 transition-colors" onClick={handleContratar}>
                                    <BsPersonCheckFill size={22}/>
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

                
                 <div className="flex justify-center items-center flex-col min-h-[100vh]">
                    <Confeti/>
                    <img src="/images/ContratoRealizado2.png" width={300} height={300} alt="" />
                    
                    <p className="my-5 text-white font-bold text-2xl">
                        Contrato Realizado com Sucesso!
                    </p>

                    <button className="w-56 text-lg h-14 flex items-center justify-center bg-[#FFD666] text-[#8D734B] rounded-lg font-extrabold gap-2 shadow-lg hover:bg-yellow-200 transition-colors" onClick={handleRetornarMenuPrincipal}>
                        <AiFillHome/>
                        Menu Principal
                    </button>

                    <div className='text-xs text-white flex justify-center pt-20'>
                        Illustration by <a href="https://icons8.com/illustrations/author/zD2oqC8lLBBA">Icons 8</a> from <a href="https://icons8.com/illustrations">Ouch!</a>
                    </div>
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