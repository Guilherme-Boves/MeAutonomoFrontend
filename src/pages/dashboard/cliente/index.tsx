import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link';
import { ButtonSignOut } from '../../../components/ui/ButtonSignOut';
import { canSSRCliente } from '../../../utils/canSSRCliente';

export default function DashboardCliente() {
    
    return (
      <>
        <Head>        
          <title>MeAutonomo</title>
        </Head>
        
        <div className={styles.container}>
            <div className={styles.containerOpcoes}>
                <div>        
                    <Link href={"/contratar/categoria"}>
                        <button>
                            <a>Contratar Serviços</a>
                        </button>
                    </Link>
                    </div>
                <div>        
                    <Link href={"/servicoscontratados/pendentes"}>
                        <button>
                            <a>Serviços contratados</a>
                        </button>
                    </Link>
                </div>
                <div>        
                    <Link href={"/perfil/cliente"}>
                        <button>
                            <a>Gerenciar meu perfil</a>
                        </button>
                    </Link>
                </div>
                <div>
                    <ButtonSignOut/>
                </div>
            </div>
        </div>
      </>
    )
}

export const getServerSideProps = canSSRCliente(async (ctx) =>{
    
    return {
        props: {}
    }
})