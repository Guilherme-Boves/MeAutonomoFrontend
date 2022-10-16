import { FormEvent, useState, useContext, isValidElement } from 'react';
import Head from 'next/head'
import Link from 'next/link';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { AuthContext } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify'
import { canSSRGuest } from '../../../utils/canSSRGuest';
import { Logo } from '../../../components/Logo';
import { AsideSignups } from '../../../components/AsideSignups';
import { FiArrowLeft } from 'react-icons/fi';
import MaskedInput from '../../../components/ui/MaskedInput';

export default function SignUpProfissional() {

    const { signUpP } = useContext(AuthContext);

    const [email, setEmail] = useState('')
    const [nome, setNome] = useState('')
    const [password, setPassword] = useState('')
    const [cnpj, setCnpj] = useState('')
    const [telefone, setTelefone] = useState('')
    let [dataNascimento, setDataNascimento] = useState('')

    const [loading, setLoading] = useState(false);

    const onlyNumbers = (str) => str.replace(/[^0-9]/g, '') // Retira a máscara, deixando apenas os números
    
    function handleRetiraMascara(value) {        
        return onlyNumbers(value)
    }

    function containsNumbers(str){        
        const regexNome = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
        return regexNome.test(str);
    }

    function validaEmail(str){
        const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
        return regexEmail.test(str)
    }

    function validaSenha(str){
        /*
            (?=.*?[A-Z]) : Pelo menos 1 letra maiúscula
            (?=.*?[a-z]) : Pelo menos 1 letra minúscula
            (?=.*?[0-9]) : Pelo menos 1 dígito
            (?=.*?[#?!@$ %^&*-]) : Pelo menos 1 caracter especial ou espaço
            .{8,} : Mínimo de 8 caracteres
        */
        const regexSenha = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
        return regexSenha.test(str);
    }

    async function handleSignUp(e: FormEvent) {
        e.preventDefault();

        if (email === '' || nome === '' || password === '' || cnpj === '' || telefone === '' || dataNascimento === '') {
            toast.error("Preencha todos os campos!")
            return;
        }

        if(!validaEmail(email)){
            toast.error("Email inválido")
            return;
        }
       
        if(!containsNumbers(nome)){ // Verificando se o nome possui números ou caracteres inválidos.
            toast.error("Nome inválido")
            return;
        }
        
        if(!validaSenha(password)){ // Verificando se a senha é válida
            toast.error("A senha deve conter no mínimo 1 letra minúscula e maiúscula, 1 dígito, 1 caracter especial e no mínimo 8 caracteres!");
            return;
        }

        if(cnpj.length < 14){
            toast.error("CNPJ inválido")
            return;
        }

        if(telefone.length < 11){
            toast.error("Telefone incompleto")
            return;
        }

        let anoAtual = new Date().getFullYear();
        let splittedDate = dataNascimento.split('-')
        let anoAniversarioUsuario = Number(splittedDate[0])
        dataNascimento = `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

        if(anoAniversarioUsuario > anoAtual){ // Verificando se a data de nascimento é maior que o ano atual
            toast.error("Insira uma data válida!")
            return;
        } else if(anoAniversarioUsuario < (anoAtual - 120)){ // Verificando se a data de nascimento é menor que 120 anos
            toast.error("Insira uma data válida!")
            return;
        } else if(anoAniversarioUsuario > (anoAtual - 18)){ // Verificando se o usuário é maior de 18 anos
            toast.error("Você deve ser maior de 18 anos para realizar o cadastro!")
            return;
        }

        setLoading(true)

        let data = {
            email,
            nome,
            password,
            cnpj,
            telefone,
            dataNascimento
        }
        
        try{            
            await signUpP(data)
        }
        catch(err){
            console.log("Ops, erro inesperado! Contatar o suporte! ", err)
            setLoading(false)
        }
        setLoading(false)
    }

    const [formStep, setFormStep] = useState(0)
    
    const completeFormStep = () => {

        if(email === '' || nome === '' || password === ''){
            toast.error("Preencha todos os campos!")
            return;
        }

        setFormStep(val => val + 1)
    }

    const goToPreviousStep = () => {
        setFormStep(val => val -1)
    }

    const renderButton = () => {
        if (formStep > 1) {
            return undefined
        } else if (formStep === 0) {
            return (
                <Button 
                    onClick={completeFormStep}
                    type="button" 
                    className="w-[100%] ml-auto mr-auto text-lg mb-6 mx-auto h-14 flex items-center justify-center bg-[#FFD666] text-[#8D734B] rounded-lg font-extrabold gap-2 shadow-lg hover:bg-yellow-200 transition-colors">
                    Continuar
                </Button>
            )
        } else {
            return (          
                <Button 
                    onClick={handleSignUp}
                    type="submit" 
                    loading={loading}
                    className="w-[100%] ml-auto mr-auto text-lg mb-6 mx-auto h-14 flex items-center justify-center bg-[#FFD666] text-[#8D734B] rounded-lg font-extrabold gap-2 shadow-lg hover:bg-yellow-200 transition-colors">
                    Cadastrar
                </Button>
            )
        } 
    }

    return (
        <>
            <Head>
                <title>Faça seu cadastro!</title>
            </Head>

            <div className='flex flex-row-reverse'>
                <aside className="w-[1000px]">
                    <div className="mx-auto text-center justify-center">     
                        <div className="flex justify-center mt-3 pb-3 2xl:mt-16 2xl:pb-6">                           
                            <div className='fixed mr-96'>
                                {formStep > 0 &&(
                                    <button 
                                    onClick={goToPreviousStep}
                                    type="button"
                                    className='bg-[#12AFCB] rounded-xl w-10 h-10 shadow hover:bg-[#56CCF2] transition-colors'>
                                        <FiArrowLeft size={28} color="white" className='mx-auto'/>
                                    </button>
                                )}
                            </div>     
                            
                            <Logo />                      
                        </div>
                            
                        <h1 className="text-3xl font-extrabold text-white">
                            Criar uma nova conta :)
                        </h1>

                        <div>
                            <p className="text-base font-bold py-3 text-white">
                                Amplie suas oportunidades e conquiste mais clientes!
                            </p>
                        </div>

                        <div>
                            <p className="text-base font-bold pb-3 text-white">
                                Tudo de graça.
                            </p>
                        </div>

                        <a href="" className="w-2/3 ml-auto mr-auto text-lg my-4 mx-auto h-14 flex items-center justify-center bg-white text-[rgba(77,111,128,0.75)] rounded-lg font-bold gap-2 shadow-lg hover:bg-sky-200 hover:text-white transition-colors">
                            Cadastrar com o Google
                        </a>

                        <div className="flex w-2/3 ml-auto mr-auto py-3 items-center">
                            <div className="flex-grow border-t-2 border-white "></div>
                            <span className="flex-shrink mx-4 text-white font-bold">ou</span>
                            <div className="flex-grow border-t-2 border-white"></div>
                        </div>

                        <form onSubmit={handleSignUp} action="" className="flex flex-col gap-5 w-2/3 ml-auto mr-auto">
                            {formStep === 0 &&(
                                <section className='flex flex-col gap-5 w-full ml-auto mr-auto'>
                                    <Input 
                                        className="bg-white rounded-lg px-5 h-14 2xl:my-2 font-bold text-[rgba(77,111,128,0.75)] shadow-md"
                                        placeholder="E-mail" 
                                        type="email" 
                                        value={email}
                                        onChange={ (e) => setEmail(e.target.value)}
                                    />

                                    <Input 
                                        className="bg-white rounded-lg px-5 h-14 font-bold text-[rgba(77,111,128,0.75)] shadow-md"
                                        placeholder="Nome completo" 
                                        type="text" 
                                        value={nome}
                                        onChange={ (e) => setNome(e.target.value)}
                                    />
                                    
                                    <Input 
                                        className="bg-white rounded-lg px-5 h-14 2xl:my-2 font-bold text-[rgba(77,111,128,0.75)] shadow-md" 
                                        placeholder="Senha"
                                        type="password"
                                        value={password}
                                        onChange={ (e) => setPassword(e.target.value)}
                                    />
                                </section>
                            )}
                            
                            {formStep === 1 &&(
                                <section className='flex flex-col gap-5 w-full ml-auto mr-auto'>
                                    <MaskedInput 
                                        className="bg-white rounded-lg px-5 h-14 2xl:my-2 font-bold text-[rgba(77,111,128,0.75)] shadow-md" 
                                        placeholder="CNPJ"
                                        mask={"99.999.999/9999-99"}                        
                                        maskChar={''}
                                        value={cnpj}
                                        onChange={ (e) => setCnpj(handleRetiraMascara(e.target.value))}
                                    />

                                    <MaskedInput 
                                        className="bg-white rounded-lg px-5 h-14 font-bold text-[rgba(77,111,128,0.75)] shadow-md" 
                                        placeholder="Telefone"
                                        mask={"(99) 99999-9999"}
                                        maskChar={''}                                        
                                        value={telefone}
                                        onChange={ (e) => setTelefone(handleRetiraMascara(e.target.value))}
                                    />

                                    <Input 
                                        className="bg-white rounded-lg px-5 h-14 2xl:my-2 font-bold text-[rgba(77,111,128,0.75)] shadow-md" 
                                        placeholder="Data de Nascimento"
                                        type="date"
                                        value={dataNascimento}
                                        onChange={ (e) => setDataNascimento(e.target.value)}
                                    />
                                </section>
                            )}
                        </form> 

                        <div className='my-2 flex flex-col gap-5 w-2/3 ml-auto mr-auto mt-5'>
                            {renderButton()}
                        </div>

                        <div className="h-full w-full py-0">
                            <div className="mx-auto flex justify-center space-x-5">
                                <div className="bg-white h-3 w-3 rounded-full shadow flex items-center justify-center -mr-3 relative">
                                    {formStep === 0 &&(
                                        <div className="h-3 w-3 bg-[#FFD666] rounded-full"></div>
                                    )}
                                </div>

                                <div className="bg-white h-3 w-3 rounded-full shadow flex items-center justify-center -mr-3 relative">
                                    {formStep === 1 &&(
                                        <div className="h-3 w-3 bg-[#FFD666] rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mx-auto text-center justify-center mt-3 2xl:mt-[100px] ">
                            <span className="font-extrabold text-white">
                                Já possui uma conta?
                            </span>

                            <Link href="/signin">
                                <a href="" className="font-extrabold text-[#FFD666]">
                                    &nbsp; Entrar
                                </a>
                            </Link>
                        </div>
                    </div>
                </aside>
                <AsideSignups />
            </div>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
    return {
        props: {}
    }
})