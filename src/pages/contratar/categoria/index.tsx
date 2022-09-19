import { useState } from 'react';
import styles from './styles.module.css'
import Image from 'next/image';
import { ReturnButton } from '../../../components/ui/ReturnButton';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../services/api';
import { CategoriaProps } from '../../tiposervico'


export default function Categoria({ listaCategorias }: CategoriaProps){

    const [categorias, setCategorias] = useState(listaCategorias || []);

    return(

        <div className={styles.body}>
            <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.carrossel}>
                    
                    {categorias.map((item, index) => {
                       
                       const {id, nome, imagem} = item;

                        return(                         
                            <div className={styles.item} key={id}>
                                <Image src={`http://localhost:3333/files/${imagem}`} alt={nome} width={250} height={250} />
                                <span className={styles.nomeCategoria}>{nome}</span>
                            </div>                            
                        );
                    })}


                </div>
            </div>
        </div>
    );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/categoria')
  
    return {
        props: {
            listaCategorias: response.data
        }
    }
})
