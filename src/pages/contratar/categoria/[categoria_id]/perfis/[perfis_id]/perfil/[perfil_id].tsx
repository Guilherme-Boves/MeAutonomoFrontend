import React, { useState } from 'react';
import { canSSRAuth } from '../../../../../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../../../../../services/api';
import Image from 'next/image';
import styles from './styles.module.css'
import { ReturnButton } from '../../../../../../../components/ui/ReturnButton';
import Link from 'next/link';

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

export default function Perfil({ perfilProf }: PerfilProps){

    const [perfil, setPerfil] = useState(perfilProf || []) 
    
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

                                    <Link href={``}>
                                        <a>
                                            Contratar
                                        </a>
                                    </Link>
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
                                        { item.agenda.map((item) => 
                                            {
                                                return (
                                                    <div key={item.id}>

                                                        <h1>{item.dia} de {item.mes} - {item.horario}h</h1>
                                                        
                                                    </div>
                                                )
                                            }) 
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