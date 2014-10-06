/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require("express");
var app = express();
var catalogo = require("./catalogo.js");

app.use(express.static("../"));
app.use(express.bodyParser());

//inserisci auto
app.post("/inserisci", catalogo.addAuto);

//trova tutte le auto
app.get("/", catalogo.findAll);

//trova auto per testo
app.get("/ricerca", catalogo.findByText);

//trova auto per id
app.get("/ricerca/:id", catalogo.findById);

//aggiorna auto per id
app.post("/update/:id", catalogo.update);

//cancella auto per id
app.get("/delete/:id", catalogo.update);

app.listen(3113);