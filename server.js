//Utilisation du mode strict
"use strict";

//Chargement des modules nécessaires
const http = require("http");
const express = require('express');
const request = require('request');
const hostname = '127.0.0.1';
const port = 3001;

//Création du serveur HTTP
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

//Écoute des requêtes
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});