import React, { useState } from 'react'
import styles from './styles.module.css'
import Image from 'next/image';
import { ReturnButton } from '../../../components/ui/ReturnButton';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../services/api';
import Link from 'next/link';

type ItemProps = {
    id: string;
    nome: string;
    imagem: string;
    categoria_id: string;    
}

interface TipoServicoProps {
    listaTipoServico: ItemProps[];
}

export default function TipoServico({ listaTipoServico }: TipoServicoProps ){

    const [tipoServico, setTipoServico] = useState(listaTipoServico || []);

    return(

        <div className={styles.body}>
            <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.carrossel}>

                    {tipoServico.length === 0 ? (
                        <div>Nenhum serviço encontrado</div>
                    ) : (

                        tipoServico.map((item) => {
                            const {id, nome, imagem, categoria_id} = item;
     
                             return(
                                 <div key={id}>
                                     <Link href={`/contratar/categoria/${categoria_id}/perfis/${id}`}>
                                         <a className={styles.item}>
                                             <Image src={`http://localhost:3333/files/${imagem}`} alt={nome} width={250} height={250} />
                                             <span className={styles.nome}>{nome}</span>
                                         </a>
                                     </Link>                            
                                 </div>
                             );
                         })
                    )}
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const id = ctx.query.categoria_id;

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get(`/tiposervico?categoria_id=${id}`)
    
    return {
        props: {
            listaTipoServico: response.data
        }
    }
})
