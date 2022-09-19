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

export default function CadastrarCategoria(){

    const [nomeCategoria, setNomeCategoria] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(''); //Armazendo uma URL para mostrar o Preview da imagem
    const [imageAvatar, setImageAvatar] = useState(null) //Armazendo o File para ser enviado para o banco de dados

    const [loading, setLoading] = useState(false)

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

            setLoading(true);
            data.append('nome', nomeCategoria)
            data.append('file', imageAvatar)

            const apiClient = setupAPIClient();
            await apiClient.post('/categoria', data);


            toast.success('Categoria cadastrada com sucesso!');

        }catch(err){
            console.log(err);
            toast.error("Erro ao cadastrar");
        }

        setNomeCategoria('');
        setAvatarUrl('');
        setImageAvatar(null);
        setLoading(false);
    }

    return(
        <>
            <Head>
                <title>Cadastrar cotegoria</title>
            </Head>

            <div>
                <ReturnButton/>
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

                        <Button type="submit" loading={loading} style={{maxWidth: '720px'}}>
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