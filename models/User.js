const { v4: uuidv4 } = require("uuid");
const knex = require("../database/connection");
const TokenModel = require('../models/Token');

class UserModel {
    async create(user) {
        try {
            await knex("users").insert(user);
            return { code: 201, message: "User created successfully" };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async findAll(select = "*") {
        try {
            return await knex("users").select(select);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async find(select = "*", where = {}, whereNot = {}) {
        try {
            return await knex("users").select(select).where(where).whereNot(whereNot);
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async update(params) {
        const { id, email, name, role } = params;

        if (!id) throw new Error("ID is required");

        if (email) {
            const emailExists = await this.find(["id"], { email }, { id });
            if (emailExists.length > 0) throw new Error("Email already in use");
        }

        const updateData = {};
        if (email) updateData.email = email;
        if (name) updateData.name = name;
        if (role !== undefined) updateData.role = role;

        try {
            await knex("users").update(updateData).where({ id });
            return { code: 200, message: "User updated successfully" };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async delete(id) {
        if (!id) throw new Error("ID is required");

        const userExists = await this.find(["id"], { id });
        if (userExists.length === 0) throw new Error("Invalid ID");

        try {
            await knex("users").where({ id }).del();
            return { code: 200, message: "User deleted successfully" };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async createToken(email) {
        const user = await this.find(["id"], { email });
        if (user.length === 0) throw new Error("Invalid email");

        return await TokenModel.create(user[0].id);
    }

    async updatePassword(newPassword, userId, token) {
        if (!newPassword || !userId || !token) throw new Error("Missing parameters");

        try {
            const updatedPassword = await knex("users").update({ password: newPassword }).where({ id: userId });

            if (updatedPassword === 0) throw new Error("Invalid user");

            await TokenModel.deactivate(userId, token);

            return { code: 200, message: "Password updated successfully" };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new UserModel();