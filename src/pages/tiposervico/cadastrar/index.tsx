import Head from "next/head"
import { useState, ChangeEvent, FormEvent } from 'react'
import styles from './styles.module.css'
import { FiUpload } from "react-icons/fi"
import { toast } from "react-toastify"
import { setupAPIClient } from "../../../services/api"
import { Input } from "../../../components/ui/Input"
import { Button } from "../../../components/ui/Button"
import { canSSRAdmin } from "../../../utils/canSSRAdmin"
import { ReturnButton } from "../../../components/ui/ReturnButton"
import { containsNumbers } from "../../../utils/Functions"
import Router from "next/router"

type ItemProps = {
    id: string;
    nome: string;
    imagem: string;
}

export interface CategoriaProps{
    listaCategorias: ItemProps[];
}


export default function CadastrarTipoServico({ listaCategorias }: CategoriaProps){

    const [nomeServico, setNomeServico] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(''); //Armazendo uma URL para mostrar o Preview da imagem
    const [imageAvatar, setImageAvatar] = useState(null) //Armazendo o File para ser enviado para o banco de dados

    const [categorias, setCategorias] = useState(listaCategorias || []) // UseState recebe a lista de categorias ou um array vazio
    const [categoriaSelecionada, setCagoriaSelecionada] = useState(0)

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

        if(categorias.length === 0){
            toast.error("Categoria não selecionada")
            return;
        }

        try{
            const data = new FormData();

            if(nomeServico === '' || imageAvatar === null){
                toast.error("Preencha todos os campos!");
                return;
            }

            if(!containsNumbers(nomeServico)){ // Verificando se o nome do serviço possui números ou caracteres inválidos.
                toast.error("Nome inválido")
                return;
            }

            setLoading(true);

            data.append('nome', nomeServico)            
            data.append('file', imageAvatar)
            data.append('categoria_id', categorias[categoriaSelecionada].id)

            const apiClient = setupAPIClient();
            await apiClient.post('/tiposervico', data);


            toast.success('Serviço cadastrado com sucesso!');

            setNomeServico('');
            setAvatarUrl('');
            setImageAvatar(null);
            setLoading(false);
            setCagoriaSelecionada(0)
            Router.back();

        }catch(err){
            const { error } = err.response.data
            toast.error(error);
            setLoading(false)
        }

        
    }

    // Quando selecionar uma nova categoria na lista
    function handleChangeCategoria(event){
        //console.log("Posição da categoria selecionada: ", event.target.value)
        //console.log("Categoria Selecionada: ", categorias[event.target.value])

        setCagoriaSelecionada(event.target.value)
    }

    return(
        <>
            <Head>
                <title>Cadastrar Tipo de Serviço</title>
            </Head>

            <div>
                <ReturnButton/>
                <main className={styles.container}>
                    <h1 className={styles.title}>Novo Tipo de Serviço</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <Input
                            type="text" 
                            placeholder="Nome do Tipo de Serviço"                            
                            value={nomeServico}
                            onChange={(e) => setNomeServico(e.target.value)}
                        />

                        {categorias.length === 0 ? (
                            <select className={styles.select}>                                                                    
                                <option>
                                    {"Selecione uma categoria"}
                                </option>    
                            </select>
                        ) : (
                            <select className={styles.select} value={categoriaSelecionada} onChange={handleChangeCategoria}>
                                {categorias.map( (item, index) => {
                                    return(                                    
                                        <option key={item.id} value={index}>
                                            {item.nome}
                                        </option>
                                    )
                                })}
                            </select>
                        )}

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
    
    const apiClient = setupAPIClient(ctx);

    const response = await apiClient.get('/categorias')
    
    return {
        props: {
            listaCategorias: response.data
        }
    }
})