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
import { containsNumbers } from "../../../utils/Functions"
import { useRouter } from "next/router"

interface TipoSerivcoProps {
    servicoRecebido: {
        id: string;
        nome: string;
        imagem: string;
    };
}

export default function EditarTipoServico({ servicoRecebido }: TipoSerivcoProps){
    
    const router = useRouter();
    const [tipoServico, setTipoServico] = useState(servicoRecebido)
    
    const [nomeServico, setNomeServico] = useState('');
    const [nomeServicoPlaceHolder, setNomeServicoPlaceHolder] = useState('');
    const [imageServicoUrl, setimageServicoUrl] = useState(''); //Armazendo uma URL para mostrar o Preview da imagem    ;
    const [imageServico, setimageServico] = useState(null) //Armazendo o File para ser enviado para o banco de dados
    const [cadastrou, setCadastrou] = useState(false)

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

            setimageServico(image) // Armazendo a imagem no useState para enviar para o banco de dados
            setimageServicoUrl(URL.createObjectURL(e.target.files[0])) // Armazenando a imagem no useState para fazer o preview da imagem
        }

    }

    async function handleEdittipoServico(e: FormEvent) {
        e.preventDefault();
        
            if(nomeServico === '' && imageServico === null){                
                return;
            }

            if(nomeServico){
                if(!containsNumbers(nomeServico)){ // Verificando se o nome da tipoServico possui números ou caracteres inválidos.
                    toast.error("Nome inválido")
                    return;
                }
            }

        try{

            const data = new FormData();
            const tipoServico_id  = router.query.tiposervico_id as string;
            
            if(nomeServico && imageServico){
                data.append('tipoServico_id', tipoServico_id)
                data.append('nome', nomeServico)
                data.append('file', imageServico)
            } else if(nomeServico && imageServico === null) {
                data.append('tipoServico_id', tipoServico_id)
                data.append('nome', nomeServico)
                data.append('file', '')
            } else if(nomeServico === '' && imageServico){
                data.append('tipoServico_id', tipoServico_id)
                data.append('nome', '')
                data.append('file', imageServico)
            }

            setLoading(true);

            const apiClient = setupAPIClient();
            await apiClient.post('/tiposervico/edit', data);

            toast.success('Serviço editado com sucesso!');

        }catch(err){  
            const { error } = err.response.data          
            toast.error(error);
            console.log(err)
        }

        
        setCadastrou(true)
        if(nomeServico === ''){
            setNomeServicoPlaceHolder(tipoServico.nome)
        } else{
            setNomeServicoPlaceHolder(nomeServico)
        }
        setNomeServico('');
        setimageServico(null);
        setLoading(false);
        router.back()
    }

    return(
        <>
            <Head>
                <title>Editar Serviço</title>
            </Head>

            <div>
                <ReturnButton/>
                <main className={styles.container}>
                    
                    <div>
                        <h1 className={styles.title}>Editar Serviço</h1>
                    </div>

                    <form className={styles.form} onSubmit={handleEdittipoServico}>
                        {cadastrou === true ? (
                            <Input
                                type="text" 
                                placeholder={nomeServicoPlaceHolder}
                                value={nomeServico}
                                onChange={(e) => setNomeServico(e.target.value)}
                            />
                        ) : (
                            <Input
                                type="text" 
                                placeholder={tipoServico.nome}
                                value={nomeServico}
                                onChange={(e) => setNomeServico(e.target.value)}
                            />
                        )}

                        <label className={styles.label}>
                            <span className={styles.span}>
                                <FiUpload size={25} />
                            </span>

                            <input type="file" accept="image/png, image/jpeg"  className={styles.input} onChange={handleFile}/>

                            {imageServicoUrl.length === 0 ? (
                                <img
                                    className={styles.preview}
                                    src={`http://localhost:3333/files/${tipoServico.imagem}`}
                                    alt="Foto da tipoServico"
                                    width={250}
                                    height={250}                   
                                />
                            ) : (
                                <img
                                    className={styles.preview}
                                    src={imageServicoUrl}
                                    alt="Foto da tipoServico"
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
    
    const tipoServico_id = ctx.query.tiposervico_id
    const api = setupAPIClient(ctx)

    const response = await api.get('/tiposervico/id',{
        params:{
            tipoServico_id: tipoServico_id
        }
    })
    
    return {
        props: {
            servicoRecebido: response.data
        }
    }
})