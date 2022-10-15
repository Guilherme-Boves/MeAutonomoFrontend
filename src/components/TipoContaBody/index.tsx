import Head from 'next/head'
import Link from 'next/link';

export function TipoContaBody() {
    return (
      <>
        <Head>        
            <title>MeAutonomo - Tipo de Conta</title>
        </Head>
        
        <div className=" bg-fundo bg-cover bg-no-repeat bg-current w-screen h-screen flex flex-row justify-center items-center ">
            <div className="w-[710px] h-[670px] 2xl:w-[850px] 2xl:h-[800px] mx-auto text-center flex flex-col justify-center border-collapse rounded-xl shadow-xl bg-gradient-to-b from-[#15B6D6] to-[#15D6D6] ">
                <h1 className="text-4xl 2xl:text-5xl font-extrabold text-white p-10">
                    O que você deseja?
                </h1>

                <div className='grid grid-cols-2 mx-auto space-x-3 p-4'>

                    <Link href={"/signupcliente"}>
                        <a href="">
                            <div className="w-72 2xl:w-80 rounded-2xl overflow-hidden shadow-lg">
                    
                            <div className=" bg-[rgb(255,255,255,0.7)] w-full max-h-full">
                                <img src="/images/tipoConta1.png" alt="" />
                            </div>

                                <div className="px-6 py-8 bg-[#56CCF2] hover:bg-[hsl(195,86%,50%)] transition-colors ">
                                
                                    <div className="font-extrabold text-xl mb-2 text-white">Contratar Serviços</div>
                                
                                    <p className="text-white text-base font-bold">
                                        Peça pelo serviço que deseja e te indicaremos com prazer
                                    </p>
                                </div>
                            </div>
                        </a>
                    </Link>

                    <Link href={"/signupprofissional"}>
                        <a href="">
                            <div className="w-72 2xl:w-80 rounded-2xl overflow-hidden shadow-lg">
                                
                                <div className=" bg-[rgb(255,255,255,0.7)] w-full max-h-full">
                                    <img src="/images/tipoConta2.png" alt="" />
                                </div>
                                
                                <div className="px-6 py-8 bg-[#56CCF2] hover:bg-[hsl(195,86%,50%)] transition-colors">
                                
                                    <div className="font-extrabold text-xl mb-2 text-white">Cadastrar meus serviços</div>
                                
                                    <p className="text-white text-base font-bold">
                                        Receba pedidos de clientes e escolha quais enviar orçamento
                                    </p>
                                </div>
                            </div>
                        </a>
                    </Link>
                </div>
            </div>
        </div>
      </>
    )
}

