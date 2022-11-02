import { Fragment, useContext, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { BiBell, BiX } from "react-icons/bi";
import Link from 'next/link';
import { canSSRProf } from '../../../utils/canSSRProf';
import { AuthContext } from '../../../contexts/AuthContext';
import { setupAPIClient } from '../../../services/api';
import Head from 'next/head';

type ItemUserProps = {
  id: string;
  nome: string;
  email: string;
  role: string;
  telefone: string;
  dataNascimento: string;
  endereco: string;
  imagem: string;
  userProfissional:[{
        cnpj: string;
        descricaoSobreMim: string;
    }]
}

interface UserProps {
  userData: ItemUserProps
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Dashboard({ userData }: UserProps) {

  const { signOut } = useContext(AuthContext)

  const [user, setUser] = useState(userData);
  const [nomeUsuario, setNomeUsuario] = useState(user.nome);
  const [imagem, setImagem] = useState(user.imagem);
  
  const userNavigation = [
    { name: 'Gerenciar meu Perfil', href: '/perfil/profissional' },
    { name: 'Sair', onClick: signOut },
  ]

  return (
    <>
        <Head>        
            <title>MeAutonomo</title>
        </Head>
        <div className="min-h-full">
            <div className="bg-gradient-to-b from-[#15B6D6] to-[#15D6D6]">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                            <img
                                className="h-15 w-10"
                                src='/images/Icon.png'
                                alt="MeAutonomo"
                            />
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                            <button
                                type="button"
                                className="rounded-full bg-[#FFD666] p-1 text-[#8D734B] hover:text-[hsl(36,31%,60%)] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-400"
                            >
                                <BiBell className="h-6 w-6" aria-hidden="true" />
                            </button>
                            <Menu as="div" className="relative ml-3">
                                <div>
                                <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-zinc-400">
                                    <img className="h-8 w-8 rounded-full" src={`http://localhost:3333/files/${imagem}`} alt="" />
                                </Menu.Button>
                                </div>
                                <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                                >
                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    {userNavigation.map((item) => (
                                    <Menu.Item key={item.name}>
                                        {({ active }) => (
                                        <a
                                            href={item.href}
                                            onClick={item.onClick}
                                            className={classNames(
                                            active ? 'bg-gray-100' : '',
                                            'block px-4 py-2 text-sm text-gray-700', "cursor-pointer"
                                            )}
                                        >
                                            {item.name}
                                        </a>
                                        )}
                                    </Menu.Item>
                                    ))}
                                </Menu.Items>
                                </Transition>
                            </Menu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#4D6F80]">Bem vindo, {nomeUsuario}!</h1>
                <h1 className="text-base font-semibold tracking-tight text-[#4D6F80]">Ficamos felizes de poder contar com você :)</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white h-[530px] rounded-lg border-2 border-[#D3E2E5] py-8">
                            <div className="flex">
                                <div className='flex mx-auto space-x-12 p-4'>
                                    <Link href={"/contratar/categoria"}>
                                        <a href="">
                                            <div className="w-72 2xl:w-80 rounded-2xl overflow-hidden shadow-lg">

                                            <div className=" bg-[#ccf0fb] w-full max-h-full">
                                                <img src="/images/ContratarServicos.png" alt="" />
                                            </div> 

                                                <div className="text-center px-6 py-8 bg-[#56CCF2] hover:bg-[hsl(195,86%,50%)] transition-colors ">
                                                    <div className="font-extrabold text-xl mb-2 text-white">Contratar Serviços</div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>

                                    <Link href={"/servicoscontratados/pendentes"}>
                                        <a href="">
                                            <div className="w-72 2xl:w-80 rounded-2xl overflow-hidden shadow-lg">

                                            <div className=" bg-[#ccf0fb] w-full max-h-full">
                                                <img src="/images/ServicosContratados.png" alt="" />
                                            </div> 

                                                <div className="text-center px-6 py-8 bg-[#56CCF2] hover:bg-[hsl(195,86%,50%)] transition-colors ">
                                                    <div className="font-extrabold text-xl mb-2 text-white">Serviços Contratados</div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>

                                    <Link href={"/perfil/profissional"}>
                                        <a href="">
                                            <div className="w-72 2xl:w-80 rounded-2xl overflow-hidden shadow-lg">

                                                <div className=" bg-[#ccf0fb] w-full max-h-full">
                                                    <img src="/images/GerenciarPerfil.png" alt="" />
                                                </div> 

                                                <div className="text-center px-6 py-8 bg-[#56CCF2] hover:bg-[hsl(195,86%,50%)] transition-colors ">
                                                    <div className="font-extrabold text-xl mb-2 text-white">Gerenciar Perfil</div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                    
                                    <Link href={"/gerenciarservicos"}>
                                        <a href="">
                                            <div className="w-72 2xl:w-80 rounded-2xl overflow-hidden shadow-lg">

                                                <div className=" bg-[#ccf0fb] w-full max-h-full">
                                                    <img src="/images/ServicosContratados.png" alt="" />
                                                </div> 

                                                <div className="text-center px-6 py-8 bg-[#56CCF2] hover:bg-[hsl(195,86%,50%)] transition-colors ">
                                                    <div className="font-extrabold text-xl mb-2 text-white">Gerenciar serviços prestados</div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>

                                    <Link href={""}>
                                        <a href="">
                                            <div className="w-72 2xl:w-80 rounded-2xl overflow-hidden shadow-lg">

                                                <div className=" bg-[#ccf0fb] w-full max-h-full">
                                                    <img src="/images/ServicosContratados.png" alt="" />
                                                </div> 

                                                <div className="text-center px-6 py-8 bg-[#56CCF2] hover:bg-[hsl(195,86%,50%)] transition-colors ">
                                                    <div className="font-extrabold text-xl mb-2 text-white">Publicar Serviço</div>
                                                </div>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </>
  )
}

export const getServerSideProps = canSSRProf(async (ctx) =>{
  
    const api = setupAPIClient(ctx);

    const user = await api.get('/userinfo');

    return {
        props: {
          userData: user.data
        }
    }
})