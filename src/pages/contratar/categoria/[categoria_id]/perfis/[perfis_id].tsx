import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { ReturnButton } from '../../../../../components/ui/ReturnButton';
import { setupAPIClient } from '../../../../../services/api';
import { canSSRAuth } from '../../../../../utils/canSSRAuth'
import styles from '../../styles.module.css'

type ItemProps = {    
    user:{
        id: string;
        nome: string;
    }
}

interface ListPerfisProps {
    listPerfis: ItemProps[];
}

export default function Perfis({ listPerfis }: ListPerfisProps) {

    const [perfis, setPerfis] = useState(listPerfis || []);

    return(

        <div className={styles.body}>
            <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.carrossel}>
                    {perfis.map((item) => {

                        const {id, nome} = item.user

                        return(                            
                            <div key={id}>
                                <Link href={``}>
                                    <a className={styles.item}>
                                        <Image src={``} alt={`Foto do Profissional`} width={250} height={250} />
                                        <div className={styles.nome}>{nome}</div>
                                    </a>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


export const getServerSideProps = canSSRAuth(async (ctx) => {

    const tipoDoServicoId = ctx.query.perfis_id;

    const api = setupAPIClient(ctx);

    const response = await api.get(`publicarservico?tipoDoServico_id=${tipoDoServicoId}`)

    return{
        props: {
            listPerfis: response.data
        }
    }
})