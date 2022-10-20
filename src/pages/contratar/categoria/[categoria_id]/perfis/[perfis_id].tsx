import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react'
import { ReturnButton } from '../../../../../components/ui/ReturnButton';
import { setupAPIClient } from '../../../../../services/api';
import { canSSRAuth } from '../../../../../utils/canSSRAuth'
import styles from '../../styles.module.css'

type ItemProps = {    
    publicacao:{
        user:{
            id: string;
            nome: string;
            imagem: string;
        }
    }
}

interface ListPerfisProps {
    listPerfis: ItemProps[];
}

// Neste componente será listado todos os profissionais que prestam o tipo de serviço escolhido pelo usuário
export default function Perfis({ listPerfis }: ListPerfisProps) {

    const router = useRouter();
    const categoria_id = router.query.categoria_id;
    const tipoServico_id = router.query.perfis_id;

    const [perfis, setPerfis] = useState(listPerfis || []);
    
    return(

        <div className={styles.body}>
            <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.carrossel}>
                    {perfis.length === 0 ? (
                        <h1>Nenhum profissional foi encontrado</h1>
                    ) : (
                        perfis.map((item) => {
                            const {id, nome, imagem} = item.publicacao.user;
                            return(                            
                                <div key={id}>
                                    <Link href={`/contratar/categoria/${categoria_id}/perfis/${tipoServico_id}/perfil/${id}`}>
                                        <a className={styles.item}>
                                            <Image src={`http://localhost:3333/files/${imagem}`} alt={`Foto do Profissional`} width={250} height={250} />
                                            <div className={styles.nome}>{nome}</div>
                                        </a>
                                    </Link>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>
        </div>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    const tipoDoServicoId = ctx.query.perfis_id;

    const api = setupAPIClient(ctx);

    const response = await api.get(`perfis?tipoDoServico_id=${tipoDoServicoId}`)

    return{
        props: {
            listPerfis: response.data
        }
    }
})