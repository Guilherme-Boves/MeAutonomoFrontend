import { toast } from "react-toastify";

export function validaCadastroProfissional(nome: string, email: string, password: string, cnpj: string, telefone: string, dataNascimento: string) {
    
    if (email === '' || nome === '' || password === '' || cnpj === '' || telefone === '' || dataNascimento === '') {
        toast.error("Preencha todos os campos!")
        return;
    }

    if(!validaEmail(email)){
        toast.error("Email inválido")
        return;
    }
   
    if(!containsNumbers(nome)){ // Verificando se o nome possui números ou caracteres inválidos.
        toast.error("Nome inválido")
        return;
    }
    
    if(!validaSenha(password)){ // Verificando se a senha é válida
        toast.error("A senha deve conter no mínimo 1 letra minúscula e maiúscula, 1 dígito, 1 caracter especial e no mínimo 8 caracteres!");
        return;
    }

    if(cnpj.length < 14){
        toast.error("CNPJ inválido")
        return;
    }

    if(telefone.length < 11){
        toast.error("Telefone incompleto")
        return;
    }

    if(!validaData(dataNascimento)){
        return;
    }

    return true;
}

export function validaCadastroCliente(nome: string, email: string, password: string, cpf: string, telefone: string, dataNascimento: string){
    
    if(email === '' || nome === '' || password === '' || cpf === '' || telefone === '' || dataNascimento === ''){
        toast.error("Preencha todos os campos!")
        return;
    }

    if(!validaEmail(email)){
        toast.error("Email inválido")
        return;
    }
   
    if(!containsNumbers(nome)){ // Verificando se o nome possui números ou caracteres inválidos.
        toast.error("Nome inválido")
        return;
    }
    
    if(!validaSenha(password)){ // Verificando se a senha é válida
        toast.error("A senha deve conter no mínimo 1 letra minúscula e maiúscula, 1 dígito, 1 caracter especial e no mínimo 8 caracteres!");
        return;
    }

    if(cpf.length < 11){
        toast.error("CPF inválido")
        return;
    }

    if(telefone.length < 11){
        toast.error("Telefone incompleto")
        return;
    }

    if(!validaData(dataNascimento)){
        return;
    }
    
    return true;
}


//Função para formatar data
export function DateFormat(str: string){
    //Entrada => 1990-10-10T13:05:00Z
    let data = str.split('T');
    let dataAux = data[0].split('-');
    let horario = data[1].split(':');
    let dataFormatada = `${dataAux[2]}/${dataAux[1]}/${dataAux[0]} - ${horario[0]}:${horario[1]}h`
    return dataFormatada
    // Saída => 10/10/1990 - 13:05h
}

// Função para verificar se o email é válido
export function validaEmail(str){
    const regexEmail = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    return regexEmail.test(str)
}

//Funcção para validar a senha
export function validaSenha(str){
    /*
        (?=.*?[A-Z]) : Pelo menos 1 letra maiúscula
        (?=.*?[a-z]) : Pelo menos 1 letra minúscula
        (?=.*?[0-9]) : Pelo menos 1 dígito
        (?=.*?[#?!@$ %^&*-]) : Pelo menos 1 caracter especial ou espaço
        .{8,} : Mínimo de 8 caracteres
    */
    const regexSenha = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;
    return regexSenha.test(str);
}

//Função para verificar se o nome possui números ou caracteres especiais
export function containsNumbers(str){ 
    const regexNome = /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/;
    return regexNome.test(str);
}

// Função para retirar a máscara do CPF/CNPJ ou Telefone, deixando apenas os números
const onlyNumbers = (str) => str.replace(/[^0-9]/g, '') 
export function retiraMascara(value) {        
    return onlyNumbers(value)
}

//Função para validar a data de nascimento do usuário
export function validaData(data: string){
    
    let anoAtual = new Date().getFullYear();
    let splittedDate = data.split('-')
    let anoAniversarioUsuario = Number(splittedDate[0])
    data = `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`

    if(anoAniversarioUsuario > anoAtual){ // Verificando se a data de nascimento é maior que o ano atual
        toast.error("Insira uma data válida!")
        return;
    } else if(anoAniversarioUsuario < (anoAtual - 120)){ // Verificando se a data de nascimento é menor que 120 anos
        toast.error("Insira uma data válida!")
        return;
    } else if(anoAniversarioUsuario > (anoAtual - 18)){ // Verificando se o usuário é maior de 18 anos
        toast.error("Você deve ser maior de 18 anos para realizar o cadastro!")
        return;
    }
    
    return data; // Se a data for válida, retorna a data formatada => Entrada: 05/10/1997 / Saída: 1997/10/05
}