import express from "express";

const app = express();

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Backend funcionando"
    });
});

app.listen(3000, () => {
    console.log("Nuestro Backend está funcionando en el puerto 3000.");
});
