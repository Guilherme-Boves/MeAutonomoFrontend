import Head from "next/head"
import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { canSSRAdmin } from "../../../utils/canSSRAdmin"
import styles from './styles.module.css'
import { FiUpload } from "react-icons/fi"
import { toast } from "react-toastify"
import { setupAPIClient } from "../../../services/api"
import { ReturnButton } from "../../../components/ui/ReturnButton"
import { useRouter } from "next/router"

export default function CadastrarCategoria(){

    const router = useRouter();
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(''); //Armazendo uma URL para mostrar o Preview da imagem
    const [imageAvatar, setImageAvatar] = useState(null) //Armazendo o File para ser enviado para o banco de dados

    const [loading, setLoading] = useState(false)

    function containsNumbers(str){        
        const regexNome = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
        return regexNome.test(str);
    }

    function handleFile(e: ChangeEvent<HTMLInputElement>){
       
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){

            setImageAvatar(image) // Armazendo a imagem no useState para enviar para o banco de dados
            setAvatarUrl(URL.createObjectURL(e.target.files[0])) // Armazenando a imagem no useState para fazer o preview da imagem
        }

    }

    async function handleRegister(e: FormEvent) {
        e.preventDefault();
        
        try{
            const data = new FormData();

            if(nomeCategoria === '' || imageAvatar === null){
                toast.error("Preencha todos os campos!");
                return;
            }

            if(!containsNumbers(nomeCategoria)){ // Verificando se o nome da categoria possui números ou caracteres inválidos.
                toast.error("Nome inválido")
                return;
            }

            setLoading(true);
            data.append('nome', nomeCategoria)
            data.append('file', imageAvatar)

            const apiClient = setupAPIClient();
            await apiClient.post('/categoria', data);

            toast.success('Categoria cadastrada com sucesso!');

            setNomeCategoria('');
            setAvatarUrl('');
            setImageAvatar(null);
            setLoading(false);
            router.back();

        }catch(err){  
            const { error } = err.response.data          
            toast.error(error);
            setLoading(false);
        }

        
    }

    return(
        <>
            <Head>
                <title>Cadastrar cotegoria</title>
            </Head>

            <div>
                <div className='ml-10 p-3'>
                    <ReturnButton/>
                </div>
                <main className={styles.container}>
                    <h1 className={styles.title}>Nova Categoria</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <Input
                            type="text" 
                            placeholder="Nome da categoria"                            
                            value={nomeCategoria}
                            onChange={(e) => setNomeCategoria(e.target.value)}
                        />

                        <label className={styles.label}>
                            <span className={styles.span}>
                                <FiUpload size={25} />
                            </span>

                            <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>

                            {avatarUrl && (
                                <img
                                    className={styles.preview}
                                    src={avatarUrl}
                                    alt="Foto da categoria"
                                    width={250}
                                    height={250}
                                />
                            )}
                        </label>

                        <Button className="border rounded-lg bg-[#FFD666] p-1 text-[#8D734B] hover:text-[hsl(36,31%,60%)]" type="submit" loading={loading} style={{maxWidth: '720px'}}>
                            Cadastrar
                        </Button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAdmin(async (ctx) => {
    return {
        props: {}
    }
})