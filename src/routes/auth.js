const express = require("express");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const {mysqlConfig, jwtSecret} = require("../config");

router.get("/status", async (req, res) => {
    let userId = false;
    let username = false;
    const token = typeof req.headers.authorization != 'undefined' ? req.headers.authorization.split(" ")[1] : 'undefined';
    //const token = req.headers.authorization?.split(" ")[1];
    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        req.userData = decodedToken;
        userId = req.userData.id;
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM authors WHERE id = ${mysql.escape(userId)} LIMIT 1`);
        con.end();

        if (data.length !== 1) {
            return res.status(400).send({username: "", id: "", isEditor: "n"});
        }
        else {
            return res.send({username: data[0].username, id: data[0].id, isEditor: data[0].editor});
        }
    }
    catch(e) {
        console.log(e);
        return res.send({username: "", id: "", isEditor: "n"});
    }
});

router.post("/register", async (req, res) => {
    if (!req.body.username || !req.body.email || !req.body.password) {
        return res.status(400).send({error: "Insufficient data provided"});
    }

    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`INSERT INTO authors (username, email, password) VALUES (${mysql.escape(req.body.username)}, ${mysql.escape(req.body.email)}, '${hashedPassword}')`);
        con.end();

        if (data.affectedRows !== 1) {
            return res.status(500).send({error: "Error in DB"});
        }

        return res.send({msg: "Successfully registered an account"});
    }
    catch(e) {
        console.log(e);
        res.status(500).send({ error: "DB error"});
    }
});

router.post("/login", async(req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({error: "Insufficient data provided"});
    }

    try {
        const con = await mysql.createConnection(mysqlConfig);
        const [data] = await con.execute(`SELECT * FROM authors WHERE email = ${mysql.escape(req.body.email)} LIMIT 1`);
        con.end();
        

        if (data.length !== 1) {
            return res.status(400).send({error: "Email or password is incorrect"});
        }
        

        const passwordValidity = bcrypt.compareSync(req.body.password, data[0].password);

        if (!passwordValidity) {
            return res.status(400).send({error: "Email or password is incorrect"});
        }

        const token = jwt.sign(
            {
                id: data[0].id,
                email: data[0].email
            },
            jwtSecret,
            {
                expiresIn: 24 * 3600 * 365
            }
        );

        return res.send({msg: "Successfully logged in", token});
    }
    catch(e) {
        console.log(e);
        res.status(500).send({ error: "DB error"});
    }
});






module.exports = router;