const UserModel = require("../models/User");
const TokenModel = require('../models/Token');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserController {
    static response(res, code, message, data = null) {
        return res.status(code).json({ message, ...(data && { data }) });
    }

    async create(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!email || !password || !name) return UserController.response(res, 400, "Campos inválidos");

            const usedEmail = await UserModel.find(["id"], { email });
            if (usedEmail.length > 0) return UserController.response(res, 404, "Email já está em uso");

            const hash = await bcrypt.hash(password, 10);
            await UserModel.create({ name, email, password: hash, role: 0 });

            return UserController.response(res, 201, "Usuário criado com sucesso");
        } catch (error) {
            return UserController.response(res, 500, "Erro interno do servidor", { error: error.message });
        }
    }

    async getUsers(req, res) {
        try {
            const users = await UserModel.findAll(["id", "name", "email", "role"]);
            if (users.code) return UserController.response(res, users.code, users.err);

            return UserController.response(res, 200, "Lista de usuários", users);
        } catch (error) {
            return UserController.response(res, 500, "Erro interno do servidor", { error: error.message });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.params;
            if (!id) return UserController.response(res, 400, "ID inválido");

            const user = await UserModel.find(["id", "name", "email", "role"], { id });
            if (user.code) return UserController.response(res, user.code, user.err);
            if (user.length === 0) return UserController.response(res, 404, "Usuário não encontrado");

            return UserController.response(res, 200, "Usuário encontrado", user[0]);
        } catch (error) {
            return UserController.response(res, 500, "Erro interno do servidor", { error: error.message });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.body;
            if (!id) return UserController.response(res, 400, "ID inválido");

            const user = await UserModel.find(["id"], { id });
            if (user.length === 0) return UserController.response(res, 404, "Usuário não encontrado");

            const updatedUser = await UserModel.update(req.body);
            if (updatedUser.code !== 200) return UserController.response(res, updatedUser.code, updatedUser.err);

            return UserController.response(res, 200, "Usuário atualizado com sucesso");
        } catch (error) {
            return UserController.response(res, 500, "Erro interno do servidor", { error: error.message });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            if (!id) return UserController.response(res, 400, "ID inválido");

            const user = await UserModel.delete(id);
            if (user.code !== 200) return UserController.response(res, user.code, user.err);

            return UserController.response(res, 200, "Usuário deletado com sucesso");
        } catch (error) {
            return UserController.response(res, 500, "Erro interno do servidor", { error: error.message });
        }
    }

    async passwordRecover(req, res) {
        try {
            const { email } = req.body;
            if (!email) return UserController.response(res, 400, "E-mail inválido");

            const resultToken = await UserModel.createToken(email);
            if (resultToken.code !== 200) return UserController.response(res, resultToken.code, resultToken.err);

            return UserController.response(res, 200, "Token gerado com sucesso", { token: resultToken.token });
        } catch (error) {
            return UserController.response(res, 500, "Erro interno do servidor", { error: error.message });
        }
    }

    async changePassword(req, res) {
        try {
            const { newPassword, token, user_id } = req.body;
            if (!user_id || !newPassword || !token) return UserController.response(res, 400, "Parâmetros inválidos");

            const tokenResult = await TokenModel.validate(token, user_id);
            if (tokenResult.code !== 200) return UserController.response(res, tokenResult.code, tokenResult.err);

            const hash = await bcrypt.hash(newPassword, 10);
            await UserModel.updatePassword(hash, user_id, tokenResult.checkedToken[0].token);

            return UserController.response(res, 200, "Senha alterada com sucesso");
        } catch (error) {
            return UserController.response(res, 500, "Erro interno do servidor", { error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) return UserController.response(res, 400, "Campos inválidos");

            const user = await UserModel.find(["name", "email", "password", "role"], { email });
            if (user.length === 0) return UserController.response(res, 404, "Usuário não encontrado");

            const passwordCompare = await bcrypt.compare(password, user[0].password);
            if (!passwordCompare) return UserController.response(res, 401, "Senha incorreta");
            const token = jwt.sign(
                { email: user[0].email, role: user[0].role },
                process.env.JWT_SECRET || "senha_padrao",
                { expiresIn: "1h" }
            );
            
            return UserController.response(res, 200, "Login realizado com sucesso", { token });
        } catch (error) {
            return UserController.response(res, 500, "Erro interno do servidor", { error: error.message });
        }
    }

    async validateAdmin(req, res){
        return UserController.response(res, 200, "Admin autorizado");
    }
}

module.exports = new UserController();
