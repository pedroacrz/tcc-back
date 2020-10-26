import db from '../database/db';
import LoginValidator from '../common/validators/login';
import CreateUserValidator from '../common/validators/createUser';

var md5 = require('md5');

class SessionController {

    async search(req,res){
        const { texto} = req.body;

        db.query(`select * from User where name like '%${texto}%' or Email like '%${texto}%';`, (error, results) =>{
            return res.send(results);
        });
    }

    async index(req,res){
        
        db.query('select * from User', (error,results, fields)=>{
            console.log('entrei');
            return res.send(results);
        })
    }

    async login(req, res) {
        // VARIÁVEIS QUE RECEBE OS DADOS DA REQUISIÇÃO
        const { email, password } = req.body;
        // VALIDA OS CAMPOS RECEBIDOS DA REQUISIÇÃO
        const isValid = await LoginValidator.validate(email, password);
        if (!isValid) {
            res.status(406);
            return res.json({ message: isValid.message });
        }
        // FAZ A CONSULTA NO BANCO
        db.query(`select id,name,email,active,banned,token from User where Email = '${email}' and Password = '${md5(password)}' `, (error, results) => {
            // VERIFICA SE TEM ERRO
            if (error) {
                console.log('Aconteceu um erro na requisição:', req.originalUrl, ' descrição do erro: ->', error.sqlMessage);
                res.status(500);
                return res.json({ message: 'Ocorreu um erro em nossos servidores.' });
            }
            // CASO O RESULTADO DA CONSULTA FOR MAIOR QUE 0 -> EXISTE RESULTADO.
            if (results.length > 0) {
                // CASO O USUÁRIO ESTEJA ATIVO
                if (results[0]['active'] == 1) {
                    // CASO O USUÁRIO NÃO ESTEJA BANIDO
                    if (results[0]['banned'] == 0) {
                        let token = Date.now();
                        let tokenCrypt = md5(token)

                        db.query(`update User set Token = '${tokenCrypt}' where id = ${results[0]['id']}`);
                        db.query(`select p.name,p.id from user_permission up inner join Permission p on up.permission_id = p.id where up.user_id = '${results[0]['id']}'`, (error, results) => {

                        });

                        res.status(200);
                        return res.json({ result: results, token: tokenCrypt, permissions: results });


                        // CASO O USUÁRIO ESTEJA BANIDO
                    } else {
                        res.status(423);
                        return res.send({ message: 'Usuário está banido.' });
                    }
                }
                // CASO O USUÁRIO ESTEJA DESATIVADO  
                else {
                    res.status(423);
                    return res.send({ message: 'Usuário está desativado.' });
                }
                // CASO O EMAIL E SENHA ESTEJAM ERRADAS
            } else {
                res.status(406);
                return res.send({ message: 'Credenciais inválidas.' });
            }
        });
    }

    async createUser(req, res) {
        const { name, email, password, confirmPassword } = req.body;
        const isValid = CreateUserValidator.validate(name, email, password, confirmPassword)
        if (!isValid.success) {
            res.status(406)
            return res.json({ message: isValid.message })
        } else {
            db.query(`select email from User where email = '${email}'`, (error, results) => {
                if (error) {
                    console.log('Aconteceu um erro na requisição:', req.originalUrl, ' descrição do erro: ->', error.sqlMessage);
                    res.status(500);
                    return res.json({ message: 'Ocorreu um erro em nossos servidores.' });
                }
                if (results.length > 0) {
                    res.status(406);
                    return res.json({ message: 'Já existe um usuário com esse email.' })
                } else {
                    let data = new Date();
                    var dateNow = data.toJSON().slice(0, 10);
                    let data2 = new Date(data.valueOf() - data.getTimezoneOffset() * 60000);
                    var hourNow = data2.toISOString().replace(/\.\d{3}Z$/, '').slice(11, 19);
                    let passwordCrypt = md5(password)
                    db.query(`insert into User (Name, Email, Password,CreatedAt, HourCreated) values ('${name}','${email}','${passwordCrypt}','${dateNow}','${hourNow}');`, (error, results, fields) => {
                        if (error) {
                            if (error) {
                                console.log('Aconteceu um erro na requisição:', req.originalUrl, ' descrição do erro: ->', error.sqlMessage);
                                res.status(500);
                                return res.json({ message: 'Ocorreu um erro em nossos servidores.' });
                            }
                        }
                        res.status(201);
                        return res.json({ message: 'Usuário criado com sucesso!' });
                    })
                }
            })
        }
    }
}

export default new SessionController();