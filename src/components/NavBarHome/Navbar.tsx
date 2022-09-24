import { Header } from "../HeaderHome/Header";
import Link from 'next/link';

export function Navbar() {
    return(
        <>
            <div className="w-full py-5 flex items-center justify-around bg-[#29B6D1] border-b border[#c3c4c6]">
                <Header/>

                <ul className="flex">
                    <li className="p-4">
                        <a className="font-extrabold text-white" href="">Home</a>
                    </li>

                    <li className="p-4">
                        <a className="font-extrabold text-white" href="">O MeAutonomo</a>
                    </li>
                </ul>

                <ul className="flex">
                    <li className="p-4">
                        <Link href={"/tipoconta"}>
                            <a className="font-extrabold text-white" href="">
                                Criar Conta
                            </a>
                        </Link>
                    </li>

                    <li className="p-4">
                        <Link href={"/signin"}>
                            <a href="" className="px-10 py-3 text-base bg-[#FFD666] text-[#8D734B] rounded-[12px] font-extrabold gap-2 justify-center shadow-lg hover:bg-yellow-200 transition-colors">
                                Entrar
                            </a>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}