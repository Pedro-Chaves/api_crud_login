require("dotenv").config();
const express = require("express");
const router = require("./routes/routes");
const cors = require("cors")

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/", router);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});