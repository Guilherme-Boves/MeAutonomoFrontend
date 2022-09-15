import { FormEvent, useState, useContext } from 'react';
import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify'
import { canSSRGuest } from '../../utils/canSSRGuest';

export default function SignUpCliente() {

    const { signUpC } = useContext(AuthContext);

    const [email, setEmail] = useState('')
    const [nome, setNome] = useState('')
    const [password, setPassword] = useState('')
    const [cpf, setCpf] = useState('')
    const [telefone, setTelefone] = useState('')
    const [dataNascimento, setDataNascimento] = useState('')

    const [loading, setLoading] = useState(false);

    async function handleSignUp(e: FormEvent) {
        e.preventDefault();

        if(email === '' || nome === '' || password === '' || cpf === '' || telefone === '' || dataNascimento === ''){
            toast.error("Preencha todos os campos!")
            return;
        }

        setLoading(true)

        let data = {
            email,
            nome,
            password,
            cpf,
            telefone,
            dataNascimento
         }

        await signUpC(data)

    }

    return (
      <>
        <Head>        
          <title>Faça seu cadastro!</title>
        </Head>
        
        <div className={styles.container}>
            <div className={styles.cadastro}>        
                <h1 className={styles.h1}>Criar uma conta nova :)</h1>
                <form className={styles.form} onSubmit={handleSignUp}>
                    <Input
                        placeholder='E-mail'
                        type="text"   
                        value={email}                     
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        placeholder='Nome Completo'
                        type="text"
                        value={nome}                     
                        onChange={(e) => setNome(e.target.value)}                 
                    />
                    <Input
                        placeholder='Senha'
                        type="password"  
                        value={password}                     
                        onChange={(e) => setPassword(e.target.value)}                      
                    />
                    <Input
                        placeholder='CPF'
                        type="text"  
                        value={cpf}                     
                        onChange={(e) => setCpf(e.target.value)}                          
                    />
                    <Input
                        placeholder='Telefone'
                        type="text"
                        value={telefone}                     
                        onChange={(e) => setTelefone(e.target.value)}                 
                    />
                    <Input
                        placeholder='Data de Nascimento'
                        type="text"     
                        value={dataNascimento}                     
                        onChange={(e) => setDataNascimento(e.target.value)}                   
                    />

                    <Button
                        type="submit"
                        loading={loading}
                    >
                        Cadastrar
                    </Button>
                </form>
                <Link href="/signin">
                        <button className={styles.text} type='submit'> 
                            Já possui uma conta?
                        </button>
                </Link>
            </div>
        </div>
      </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {}
    }
}) 