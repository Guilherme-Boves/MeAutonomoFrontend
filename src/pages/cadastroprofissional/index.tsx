import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link';
import { Input } from '../../components/ui/Input';

export default function CadastroProfissional() {
    return (
      <>
        <Head>        
          <title>MeAutonomo</title>
        </Head>
        
        <div className={styles.container}>
            <div className={styles.login}>        
                <h1 className={styles.h1}>Criar uma conta nova :)</h1>
                <form className={styles.form}>
                    <Input
                        placeholder='E-mail'
                        type="text"                        
                    />
                    <Input
                        placeholder='Nome Completo'
                        type="text"                        
                    />
                    <Input
                        placeholder='Senha'
                        type="text"                        
                    />
                    <Input
                        placeholder='CNPJ'
                        type="text"                        
                    />
                    <Input
                        placeholder='Telefone'
                        type="text"                        
                    />
                    <Input
                        placeholder='Data de Nascimento'
                        type="text"                        
                    />

                    <Link href="/dashboardprofissional">
                        <button className={styles.button} type='submit'> 
                            Cadastrar
                        </button>
                    </Link>
                </form>
            </div>
        </div>
      </>
    )
  }