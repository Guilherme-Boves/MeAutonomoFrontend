import React, { useContext, useState } from 'react';
import { canSSRAuth } from '../../../../../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../../../../../services/api';
import Image from 'next/image';
import styles from './styles.module.css'
import { ReturnButton } from '../../../../../../../components/ui/ReturnButton';
import { useRouter } from 'next/router';
import { AuthContext } from '../../../../../../../contexts/AuthContext';
import { DateFormat } from '../../../../../../../utils/Functions';

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

// Neste componente será exibido a página do perfil do usuário escolhido
export default function Perfil({ perfilProf }: PerfilProps){

    const user = useContext(AuthContext)
    const [perfil, setPerfil] = useState(perfilProf || []) 

    const router = useRouter();
    const categoria_id = router.query.categoria_id;
    const tipoServico_id = router.query.perfis_id;
    const perfil_id = router.query.perfil_id;

    async function handleCriarContrato(){

        const api = setupAPIClient();

        //Não é necessário passar o ID do userCliente_id pois o sistema pega o ID automaticamente pelo token de quem está logado
        const response = await api.post(`contrato?profissional_id=${perfil_id}`)

        const { id } = response.data
        
        router.push(`/contratar/categoria/${categoria_id}/perfis/${tipoServico_id}/perfil/${perfil_id}/contrato/${id}`)
    }

    return(
        
        <>
            <ReturnButton/>
            <div className={styles.container}>
                <div>
                    {perfil.map((item, index)=> {

                        //const { imagem } = item.publicacao.user.imagem;
                        //const { nome } = item.publicacao.user.nome;
                        // const { tipoServico } = item.tipoDoServico.nome;
                        // const { descricao } = item.descricao;
                        // const { servicos } = item.servicosPrestadosProf.nome
                        // const { agendaDia } = item.agenda.dia
                        // const { agendaMes } = item.agenda.mes
                        // const { agendaHorario } = item.agenda.horario

                        return(
                            <div key={item.id} className={styles.containerMap}>
                                
                                <div className={styles.containerImagem}>
                                        <Image src={`http://localhost:3333/files/${item.publicacao.user.imagem}`} alt={`Foto do Profissional`} width={250} height={250} />
                                </div>
                                
                                <div className={styles.containerNomeTipoServicoBtnContratar}>
                                    
                                    <h1 className={styles.Profnome}> { item.publicacao.user.nome }</h1>
                                    <h1>{ item.tipoDoServico.nome }</h1>

                                    <div>
                                        <button onClick={handleCriarContrato}>
                                            Contratar
                                        </button>
                                    </div>
                                </div>

                                <div className={styles.containerDescricao}>
                                    <h1>Descrição</h1>
                                    <h1>{ item.descricao }</h1>
                                </div>

                                <div className={styles.containerServicoAgenda}>
                                    <div className={styles.containerServicosPrestados}>
                                        <h1>Serviços Prestados</h1>
                                        { item.servicosPrestadosProf.map((item) => 
                                            {
                                                return (
                                                    <div key={item.id} className={styles.itemsServicosPrestados}>                                                    
                                                        <h1>{item.nome} - R${item.preco}</h1>
                                                    </div>
                                                )
                                            }) 
                                        }
                                    </div>

                                    <div className={styles.containerAgenda}>
                                        <h1>Agenda</h1>
                                        { item.agenda.map((item) => {
                                            return (
                                                <div key={item.id}>
                                                    <h1>{DateFormat(item.data)}</h1>                                                    
                                                </div>
                                            )})
                                        }
                                    </div>
                                </div>
                                
                            </div>
                        )
                    })}
                </div>
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