import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from 'nookies';
import jsonWebTokenService from 'jsonwebtoken'

// Páginas que só podem ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {

    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

    const cookies = parseCookies(ctx);
    const token = cookies['@meautonomo.token']
    const decoded = jsonWebTokenService.decode(token)
    
    // Se o usuário tentar acessar a página de login ou de cadastro, porém está logado, iremos redireciona-lo 
    
    if(token){ // Se token = True - O usuário está logado
        if(decoded.role === 'CLIENTE'){
            return {
                redirect: {
                    destination: '/dashboard/cliente',
                    permanent: false,
                }
            }
        } else if(decoded.role === 'PROFISSIONAL') {
            return {
                redirect: {
                    destination: '/dashboard/profissional',
                    permanent: false,
                }
            }
        }        
    }
        return await fn(ctx);
    }
}