import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link';
import { Input } from '../../../components/ui/Input';
import { ButtonSignOut } from '../../../components/ui/ButtonSignOut';
import { canSSRProf } from '../../../utils/canSSRProf';

export default function DashboardProfissional() {
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
                            <a>Gerenciar serviços prestados</a>
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
                    <Link href={""}>
                        <button>
                            <a>Publicar Serviço</a>
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

export const getServerSideProps = canSSRProf(async (ctx) => {
    return {
        props: {}
    }
})