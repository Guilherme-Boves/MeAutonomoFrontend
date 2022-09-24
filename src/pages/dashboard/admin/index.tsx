import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link';
import { ButtonSignOut } from '../../../components/ui/ButtonSignOut';
import { canSSRAdmin } from '../../../utils/canSSRAdmin';

export default function DashboardAdmin() {
    
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
                    <Link href={""}>
                        <button>
                            <a>Serviços contratados</a>
                        </button>
                    </Link>
                </div>
                <div>        
                    <Link href={""}>
                        <button>
                            <a>Gerenciar Serviços Prestados</a>
                        </button>
                    </Link>
                </div>
                <div>        
                    <Link href={""}>
                        <button>
                            <a>Gerenciar meu perfil</a>
                        </button>
                    </Link>
                </div>
                <div>        
                    <Link href={"/categoria/cadastrar"}>
                        <button>
                            <a>Gerenciar Categorias</a>
                        </button>
                    </Link>
                </div>
                <div>        
                    <Link href={"/cadastrartiposervico"}>
                        <button>
                            <a>Gerenciar Serviços</a>
                        </button>
                    </Link>
                </div>
                <div>        
                    <Link href={""}>
                        <button>
                            <a>Gerenciar Usuários</a>
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

export const getServerSideProps = canSSRAdmin(async (ctx) =>{
    
    return {
        props: {}
    }
})