import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.listen(3000, () => {
    console.log("Nuestro Backend está funcionando en el puerto 3000.");
});
