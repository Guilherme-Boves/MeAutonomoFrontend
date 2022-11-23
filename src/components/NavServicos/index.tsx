import Link from "next/link";
import { BsUiChecksGrid } from "react-icons/bs";
import { MdLibraryAddCheck } from "react-icons/md";
import { Logo } from "../Logo";

export function NavServicos(){
    return(
        <div>
            <aside className="flex flex-col bg-[#29B6D1] w-72 min-h-screen px-4">
                <div className="flex flex-wrap mt-8">
                    <div className="mx-auto">
                        <Logo/>
                    </div>

                </div>
                <div className="mt-10 mb-4">
                    <ul className="ml-4">
                        <li className="mb-2 px-4 py-4 text-white flex flex-row hover:bg-[#FFD666] hover:text-[#8D734B] hover:font-bold rounded rounded-lg">
                            <span>
                                <BsUiChecksGrid className="fill-current h-5 w-5"/>
                            </span>
                            <Link href={'/servicoscontratados/pendentes'}>
                                <a>
                                    <span className="ml-2">Serviços Pendentes</span>
                                </a>
                            </Link>
                        </li>
                        <li className="mb-2 px-4 py-4 text-gray-100 flex flex-row hover:bg-[#FFD666] hover:text-[#8D734B]  hover:font-bold rounded rounded-lg">
                            <span>
                                <MdLibraryAddCheck className="fill-current h-5 w-5"/>
                            </span>

                            <Link href={'/servicoscontratados/finalizados'}>
                                <a>
                                    <span className="ml-2">Serviços Finalizados</span>
                                </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>
            </div>
    )
}