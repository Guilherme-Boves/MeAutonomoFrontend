import { AuthTokenError } from './../services/errors/AuthTokenError';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import jsonWebTokenService from 'jsonwebtoken'

// Função para páginas que só profissionais logados podem ter acesso.

export function canSSRProf<P>(fn: GetServerSideProps<P>){
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

        const cookies = parseCookies(ctx);

        const token = cookies['@meautonomo.token'];
        const decodedToken = jsonWebTokenService.decode(token)

        if(!token) {
            return{
                redirect: {
                    destination: '/signin',
                    permanent: false,
                }
            }
        }

        try {
            if(decodedToken.role === "PROFISSIONAL"){
                return await fn(ctx);
            } else {
                return{
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                }
            }
        }catch(err){
            if(err instanceof AuthTokenError) {
                destroyCookie(ctx, '@meautonomo.token')

                return {
                    redirect:{
                        destination: '/',
                        permanent: false
                    }
                }
            }
        }
    }
}