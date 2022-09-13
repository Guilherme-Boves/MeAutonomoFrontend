import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link';

export default function TipoConta() {
    return (
      <>
        <Head>        
          <title>MeAutonomo</title>
        </Head>
        
        <div className={styles.servicosContainer}>
            <div>        
                <Link href={"/cadastrocliente"}>
                    <button>
                        <a>Contratar Serviços</a>
                    </button>
                </Link>
            </div>
            <div>        
                <Link href={"/cadastroprofissional"}>
                    <button>
                        <a>Cadastrar meus serviços</a>
                    </button>
                </Link>
            </div>
        </div>
      </>
    )
  }