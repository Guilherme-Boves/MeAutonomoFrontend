import { FormEvent, useContext, useState } from 'react'

import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify'

export default function SignIn() {

    const { signIn } = useContext(AuthContext)

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    async function handleLogin(e: FormEvent) {
        e.preventDefault();
        
        if(email === '' || password === ''){
            toast.error("Preencha todos os campos!")
            return;
        }

        setLoading(true);

        let data = {
            email,
            password
        }
        await signIn(data)

        setLoading(false);
    }

    return (
      <>
        <Head>        
          <title>MeAutonomo - Faça seu Login</title>
        </Head>
        
        <div className={styles.container}>
            <div className={styles.login}>        
                <h1 className={styles.h1}>Boas-vindas de volta!</h1>
                <form className={styles.form} onSubmit={handleLogin}>
                    <Input
                        placeholder='E-mail'
                        type="text"
                        value={email}
                        onChange={ (e) => setEmail(e.target.value)}
                    />                    
                    <Input
                        placeholder='Senha'
                        type="password" 
                        value={password}
                        onChange={ (e) => setPassword(e.target.value)}                       
                    />
                    
                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Entrar
                    </Button>
                </form>
                
                <Link href="/tipoconta">
                    <a className={styles.text}>
                        Não possui uma conta? Cadastre-se
                    </a>
                </Link>
            </div>
        </div>
      </>
    )
  }