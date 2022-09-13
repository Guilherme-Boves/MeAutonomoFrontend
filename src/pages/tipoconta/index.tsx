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
            <h1 className={styles.titulo}>Escolha o tipo de conta</h1>
            <div>       
                <Link href={"/signupcliente"}>
                    <button>
                        <a>Contratar Serviços</a>
                    </button>
                </Link>
            </div>
            <div>        
                <Link href={"/signupprofissional"}>
                    <button>
                        <a>Cadastrar meus serviços</a>
                    </button>
                </Link>
            </div>
        </div>
      </>
    )
  }