import { createContext, ReactNode, useState } from 'react';

import { api } from '../services/apiClient';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import jsonWebTokenService from 'jsonwebtoken'
import { toast } from 'react-toastify'

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUpC: (credentials: SignUpCProps) => Promise<void>;
    signUpP: (crendtials: SignUpPProps) => Promise<void>;
}

type UserProps = {
    id: string;
    nome: string;
    email: string;    
}

type SignInProps = {
    email: string;
    password: string;
}

type SignUpCProps = {
    email: string;
    nome: string;    
    password: string;
    cpf: string;
    telefone: string;
    dataNascimento: string;
}

type SignUpPProps = {
    email: string;
    nome: string;    
    password: string;
    cnpj: string;
    telefone: string;
    dataNascimento: string;
}

type AuthProviderProps = {
    children: ReactNode;
}


export const AuthContext = createContext({} as AuthContextData)

export function signOut(){
    try {
        destroyCookie(undefined, '@meautonomo.token')
        Router.push('/')
    } catch {
        console.log('erro ao deslogar')
    }
}

export function AuthProvider({ children }: AuthProviderProps){

    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInProps){
        try{
            const response = await api.post('/session',{
                email,
                password
            })

            const {id, nome, token} = response.data

            setCookie(undefined, '@meautonomo.token', token, {
                maxAge: 60 * 60 * 24 * 30, //Expira em 1 mês
                path: "/" // Quais caminhos terão acesso ao cookie
            })

            setUser({
                id,
                nome,
                email,
            })

            // Passar para as próximas requisições o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`
            
            const decodedJwt = jsonWebTokenService.decode(token)
            
            if(decodedJwt.role == "CLIENTE"){
                toast.success("Logado com sucesso!")
                Router.push('/dashboardcliente')
            } else if(decodedJwt.role == "PROFISSIONAL") {
                toast.success("Logado com sucesso!")
                Router.push('/dashboardprofissional')
            }
            
        }catch(err){
            toast.error("Erro ao acessar!")
            console.log("ERRO AO ACESSAR ", err)
        }
    }

    // signUpC = Cadastro de Clientes
    async function signUpC({ email, nome, password, cpf, telefone, dataNascimento }: SignUpCProps) {
        
        try{
            const response = await api.post('/users/cliente', {
                nome,
                email,
                password,
                cpf,
                telefone,
                dataNascimento
            })

            toast.success("Conta criada com sucesso!")
            
            Router.push('/signin')
        }catch(err){
            toast.error("Erro ao acessar!")
            console.log("ERRO AO CADASTRAR ", err)
        }
    }

    // signUpP = Cadastro de Profissionais
    async function signUpP({ email, nome, password, cnpj, telefone, dataNascimento }: SignUpPProps) {
        
        try{
            const response = await api.post('/users/profissional', {
                nome,
                email,
                password,
                cnpj,
                telefone,
                dataNascimento
            })

            toast.success("Conta criada com sucesso!")
            
            Router.push('/signin')
        }catch(err){
            toast.error("Erro ao acessar!")
            console.log("ERRO AO CADASTRAR ", err)
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUpC, signUpP }} >
            {children}
        </AuthContext.Provider>
    )
}