import { useState } from 'react';
import styles from './styles.module.css'
import Image from 'next/image';
import { ReturnButton } from '../../../components/ui/ReturnButton';
import { canSSRAuth } from '../../../utils/canSSRAuth';
import { setupAPIClient } from '../../../services/api';
import { CategoriaProps } from '../../tiposervico/cadastrar'
import Link from 'next/link';


export default function Categoria({ listaCategorias }: CategoriaProps){

    const [categorias, setCategorias] = useState(listaCategorias || []);

    return(

        <div className={styles.body}>
            <ReturnButton/>
            <div className={styles.container}>
                <div className={styles.carrossel}>
                    
                    {categorias.length === 0 ? (
                        <h1>Nenhuma categoria encontrada</h1>
                    ) : (
                        categorias.map((item) => {
                            const {id, nome, imagem} = item;     
                             return(            
                                 <div key={id}>
                                     <Link href={`/contratar/categoria/${id}`}>
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

    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/categoria')
  
    return {
        props: {
            listaCategorias: response.data
        }
    }
})
