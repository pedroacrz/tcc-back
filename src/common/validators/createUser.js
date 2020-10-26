class CreateUser{
    validate(name,email,password,confirmpassword){
        if(name == undefined || name == ''){
            return {success: false, message: 'Campo name é requerido.'}
        }
        if(email == undefined || email == ''){
            return {success: false, message: 'Campo email é requerido.'}
        }
        if(password == undefined || password == ''){
            return {success: false, message: 'Campo password é requerido.'}
        }
        if(confirmpassword == undefined || confirmpassword == ''){
            return {success: false, message: 'Campo confirmPassword é requerido.'}
        }
        if(name.length < 3){
            return {success: false, message: 'Digite um nome verdadeiro.'}
        }
        if(email.length < 5){
            return {success: false, message: 'Digite um email verdadeiro.'}
        }
        if(password.length < 8){
            return {success: false, message: 'Digite uma senha de no mínimo 8 caracteres.'}
        }
        if(password != confirmpassword){
            return {success: false, message: 'A senha precisa ser igual a confirmação de senha.'}
        }
        return { success: true};
    }
}

export default new CreateUser;