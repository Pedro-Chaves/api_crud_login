const { v4: uuidv4 } = require("uuid");
const knex = require("../database/connection");

class TokenModel {
    async create(userId) {
        if (!userId) throw new Error("User ID is required");

        const token = uuidv4();
        try {
            await knex("tokens").insert({ user_id: userId, token, active: 1 });
            return { code: 200, token };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async validate(token, userId) {
        if (!token) throw new Error("Invalid token");

        try {
            const checkedToken = await knex("tokens")
                .select(["id", "token", "user_id"])
                .where({ token, user_id: userId, active: 1 });

            if (checkedToken.length === 0) throw new Error("Invalid token");

            return { code: 200, checkedToken };
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async deactivate(userId, token) {
        if (!userId || !token) throw new Error("User ID and token are required");

        try {
            await knex("tokens").update({ active: 0 }).where({ user_id: userId, token });
            return { code: 200, message: "Token deactivated successfully" };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}

module.exports = new TokenModel();
