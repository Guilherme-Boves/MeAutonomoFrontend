import Head from "next/head"
import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { Button } from "../../../components/ui/Button"
import { Input } from "../../../components/ui/Input"
import { canSSRAdmin } from "../../../utils/canSSRAdmin"
import styles from './styles.module.css'
import { FiUpload } from "react-icons/fi"
import { toast } from "react-toastify"
import { setupAPIClient } from "../../../services/api"
import { ReturnButton } from "../../../components/ui/ReturnButton"
import { containsNumbers } from "../../../utils/Functions"
import { useRouter } from "next/router"

interface CategoriaProps {
    categoriaRecebida: {
        id: string;
        nome: string;
        imagem: string;
    };
}

export default function EditarCategoria({categoriaRecebida}: CategoriaProps){
    
    const router = useRouter();
    const [categoria, setCategoria] = useState(categoriaRecebida)
    
    const [nomeCategoria, setNomeCategoria] = useState('');
    const [imageCategoriaUrl, setImageCategoriaUrl] = useState(''); //Armazendo uma URL para mostrar o Preview da imagem    ;
    const [imageCategoria, setimageCategoria] = useState(null) //Armazendo o File para ser enviado para o banco de dados

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadCategoriaInfo(){

            setNomeCategoria(categoria.nome)
        }
        loadCategoriaInfo()
    }, [categoria.nome])

    function handleFile(e: ChangeEvent<HTMLInputElement>){
       
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        if(!image){
            return;
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){

            setimageCategoria(image) // Armazendo a imagem no useState para enviar para o banco de dados
            setImageCategoriaUrl(URL.createObjectURL(e.target.files[0])) // Armazenando a imagem no useState para fazer o preview da imagem
        }

    }

    async function handleEditCategoria(e: FormEvent) {
        e.preventDefault();

            if(nomeCategoria.length === 0) {
                toast.error("Nome inválido!")
                return;
            }
        
            if(nomeCategoria === '' && imageCategoria === null){                
                return;
            }

            if(nomeCategoria === categoria.nome && imageCategoria === null){                
                return;
            }

            if(nomeCategoria){
                if(!containsNumbers(nomeCategoria)){ // Verificando se o nome da categoria possui números ou caracteres inválidos.
                    toast.error("Nome inválido")
                    return;
                }
            }

        try{

            const data = new FormData();
            const categoria_id  = router.query.categoria_id as string;
            
            if(nomeCategoria === categoria.nome && imageCategoria){
                data.append('categoria_id', categoria_id)
                data.append('nome', '')
                data.append('file', imageCategoria)
            } else if(nomeCategoria && imageCategoria){
                data.append('categoria_id', categoria_id)
                data.append('nome', nomeCategoria)
                data.append('file', imageCategoria)
            } else if(nomeCategoria && imageCategoria === null) {
                data.append('categoria_id', categoria_id)
                data.append('nome', nomeCategoria)
                data.append('file', '')
            } else if(nomeCategoria === '' && imageCategoria){
                data.append('categoria_id', categoria_id)
                data.append('nome', '')
                data.append('file', imageCategoria)
            }

            setLoading(true);

            const apiClient = setupAPIClient();
            await apiClient.post('/categoria/edit', data);

            toast.success('Categoria editada com sucesso!');

            setNomeCategoria('');
            setimageCategoria(null);
            setLoading(false);
            router.back()

        }catch(err){  
            const { error } = err.response.data          
            toast.error(error);
            setLoading(false);
        }

        
    }

    return(
        <>
            <Head>
                <title>Editar cotegoria</title>
            </Head>

            <div>
                <div className='ml-10 p-3'>
                    <ReturnButton/>
                </div>
                <main className={styles.container}>
                    
                    <div>
                        <h1 className={styles.title}>Editar Categoria</h1>
                    </div>

                    <form className={styles.form} onSubmit={handleEditCategoria}>
                        <Input
                            type="text" 
                            placeholder={"Nome da Categoria"}
                            value={nomeCategoria}
                            onChange={(e) => setNomeCategoria(e.target.value)}
                        />

                        <label className={styles.label}>
                            <span className={styles.span}>
                                <FiUpload size={25} />
                            </span>

                            <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>

                            {imageCategoriaUrl.length === 0 ? (
                                <img
                                    className={styles.preview}
                                    src={`http://localhost:3333/files/${categoria.imagem}`}
                                    alt="Foto da categoria"
                                    width={250}
                                    height={250}                   
                                />
                            ) : (
                                <img
                                    className={styles.preview}
                                    src={imageCategoriaUrl}
                                    alt="Foto da categoria"
                                    width={250}
                                    height={250}                   
                                />
                            )}
                            
                        </label>

                        <Button className="rounded-lg bg-[#FFD666] p-1 text-[#8D734B] hover:text-[hsl(36,31%,60%)]" type="submit" loading={loading} style={{maxWidth: '720px'}}>
                            Salvar Informações
                        </Button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAdmin(async (ctx) => {
    
    const categoria_id = ctx.query.categoria_id
    const api = setupAPIClient(ctx)

    const response = await api.get('/categoria',{
        params:{
            categoria_id: categoria_id
        }
    })
    
    return {
        props: {
            categoriaRecebida: response.data
        }
    }
})