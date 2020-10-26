class LoginValidators {
    validate(email, password) {
        if (email == undefined || email == '') {
            return { success: false, message: 'Campo Email é requerido.' }
        }
        if (password == undefined || password == '') {
            return { success: false, message: 'Campo Password é requerida.' }
        }
        return { success: true }
    }
}

export default new LoginValidators;