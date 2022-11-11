import { useRouter } from 'next/router'

export function ButtonCancelWithFunction({onClick}) {
    
    const router = useRouter()

    return (
        <button onClick={() => router.back()} className="text-white w-36 text-lg h-14 flex items-center justify-center bg-[#12AFCB] rounded-lg font-extrabold gap-2 shadow-lg hover:bg-[#56CCF2] transition-colors">
            Cancelar
        </button>
    )
}