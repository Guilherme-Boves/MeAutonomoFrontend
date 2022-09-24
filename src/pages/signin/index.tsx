import { FormEvent, useContext, useState } from 'react'

import Head from 'next/head'
import styles from './styles.module.css'
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify'
import { canSSRGuest } from '../../utils/canSSRGuest';
import { Logo } from '../../components/Logo';

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
            <title>MeAutonomo - Realize seu Login</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com"/>
            <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        
        <div className=" bg-fundo bg-cover bg-no-repeat bg-current w-screen h-screen flex flex-row justify-center items-center ">
            <div className="w-[710px] h-[670px] mx-auto text-center flex flex-col justify-center border-collapse rounded-xl shadow-xl bg-gradient-to-b from-[#15B6D6] to-[#15D6D6] ">

                <div className="block ml-auto mr-auto py-5">
                    <Logo/>
                </div>
                <h1 className="text-4xl font-extrabold text-white">
                    Boas-vindas de volta!
                </h1>
                <div>
                    <p className="text-xl font-extrabold py-3 text-[rgba(77,111,128,0.75)]">
                        Ficamos muito felizes em poder te ver novamente!
                    </p>
                </div>

                <a href="" className="w-2/3 ml-auto mr-auto text-lg my-2 mx-auto h-14 flex items-center justify-center bg-white text-[rgba(77,111,128,0.75)] rounded-lg font-bold gap-2 shadow-lg hover:bg-sky-200 hover:text-white transition-colors">
                    Continuar com o Google
                </a>
                
                <div className="flex w-2/3 ml-auto mr-auto py-2 items-center">
                    <div className="flex-grow border-t-2 border-white "></div>
                    <span className="flex-shrink mx-4 text-white font-bold">ou</span>
                    <div className="flex-grow border-t-2 border-white"></div>
                </div>

                <form onSubmit={handleLogin} action="" className="flex flex-col gap-5 w-2/3 ml-auto mr-auto  ">
                    <Input 
                        className="bg-white rounded-lg px-5 h-14 font-bold text-[rgba(77,111,128,0.75)] shadow-md"
                        placeholder="E-mail, CNPJ ou CPF" 
                        type="text" 
                        value={email}
                        onChange={ (e) => setEmail(e.target.value)}
                    />
                    
                    <Input 
                        className="bg-white rounded-lg px-5 h-14 font-bold text-[rgba(77,111,128,0.75)] shadow-md" 
                        placeholder="Senha"
                        type="password"
                        value={password}
                        onChange={ (e) => setPassword(e.target.value)}
                    />

                <div className="flex">
                    <a href="" className="font-extrabold text-[rgba(77,111,128,0.75)]">Esqueceu sua senha?</a>
                </div>
                
                <Button 
                    type="submit" 
                    loading={loading} 
                    className="w-[100%] ml-auto mr-auto text-lg mb-6 mx-auto h-14 flex items-center justify-center bg-[#FFD666] text-[#8D734B] rounded-lg font-extrabold gap-2 shadow-lg hover:bg-yellow-200 transition-colors">
                    Entrar
                </Button>

                </form> 

                <div>
                    <span className="font-extrabold text-white">
                            Não possui uma conta? 
                    </span> 

                    <Link href="/tipoconta">
                        <a href="" className="font-extrabold text-[#FFD666]">
                        &nbsp; Cadastrar-se.
                        </a>
                    </Link>
                </div>           
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