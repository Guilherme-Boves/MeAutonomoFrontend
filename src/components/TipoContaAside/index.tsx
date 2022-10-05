import { Logo } from "../Logo";
import Link from 'next/link';

export function TipoContaAside(){
    return(
        <>
            <aside className="w-[450px]">
                <div className="mx-auto text-center justify-center">
                    <div className="flex justify-center mt-16">
                        <Logo/>
                    </div>

                    <div>
                        <h3 className="text-white font-extrabold text-3xl my-16">Escolha um tipo de <br /> conta ao lado</h3>
                    </div>

                    <div>
                        <p className="text-white font-semibold text-base">Não se preocupe com a escolha, <br /> profissionais autônomos também podem <br /> contratar :)</p>
                    </div>

                    <div className="mx-auto text-center justify-center mt-64 2xl:mt-[450px] ">
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
        </>
    )
}

