const express = require("express");
const app = express();
const mysql = require("mysql2");
const jwt = require("jsonwebtoken");
const auth = require("./authorization");
const conx = require("./connexionDB");

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
//Se connecter
app.get("/login", function (req, res, next) {
  const user = req.query.user;
  const password = req.query.password;
  conx.execute(
    "select id, nom, role, password from users where nom = ?",
    [user],
    function (err, data) {
      if (err) {
        res.status(500).send({ error: err });
      } else if (data.length < 1) {
        res.status(401).send({ msg: "Utilisateur inconnu" });
      } else {
        if (password === data[0].password) {
          const token = jwt.sign(
            { id: data[0].id, role: data[0].role },
            "ige42",
            { expiresIn: "24h" }
          );
          res.status(200).send({
            jwt: token,
            userName: data[0].nom,
            userId: data[0].id,
            role: data[0].role,
          });
        } else {
          res.status(401).send({ msg: "Mot de passe incorrect" });
        }
      }
    }
  );
});

//Liste avec tous nos clubs
app.get("/api/listClubs", (req, res, next) => {
  conx.query(
    "select c.id, c.nom, c.logo, p.nom as 'pays' from clubs AS c JOIN pays AS p ON(c.id_pays = p.id)",
    function (err, data, fields) {
      if (err) {
        res.status(501).send("Erreur de base de données " + err);
      } else {
        res.status(200).send({ clubs: data });
      }
    }
  );
});
//Liste avec tous nos matches
app.get("/api/listMatches", auth, function (req, res, next) {
  conx.query(
    `
        SELECT m.id, m.id_guest, m.id_visitor, 
        (select nom from clubs where clubs.id = m.id_guest) as 'name_guest',
        (select logo from clubs where clubs.id = m.id_guest) as 'logo_guest',
        (SELECT ville from clubs where clubs.id = m.id_guest) as 'city', 
        (select nom from clubs where clubs.id = m.id_visitor) as 'name_visitor',
        (select logo from clubs where clubs.id = m.id_visitor) as 'logo_visitor',
        m.score_guest, m.score_visitor, m.date 
        from matches AS m
    `,
    function (err, data, fields) {
      if (err) {
        console.log("error = ", err);
        res.status(500).send({ error: "Erreur mysql " + err });
      } else {
        res.status(200).send({ matches: data });
      }
    }
  );
});
//Récupérer les informations d'un matche
app.get("/api/Matche/:id", auth, function (req, res) {
  const id = req.params.id;
  conx.query(
    `
        SELECT m.id, m.id_guest, m.id_visitor, 
        (select nom from clubs where clubs.id = m.id_guest) as 'name_guest',
        (select logo from clubs where clubs.id = m.id_guest) as 'logo_guest',
        (SELECT ville from clubs where clubs.id = m.id_guest) as 'city', 
        (select nom from clubs where clubs.id = m.id_visitor) as 'name_visitor',
        (select logo from clubs where clubs.id = m.id_visitor) as 'logo_visitor',
        m.score_guest, m.score_visitor, m.date 
        from matches AS m where m.id = ${id}
    `,
    function (err, data) {
      if (err) {
        res.status(500).send({ error: err });
      }
      res.status(200).send({ matche: data[0] });
    }
  );
});
//Expliquer à express que les body sont en json
app.use(express.json());

app.post("/api/createClub", function (req, res) {
  let data = req.body;
  let { id_pays, nom, ville, logo } = data;
  conx.execute(
    "insert into clubs (id_pays, nom, ville, logo) values (?,?,?,?)",
    [id_pays, nom, ville, logo],
    function (err, result) {
      if (err) {
        res.status(501).send(`Erreur SQL ${err}`);
      }
      res.status(201).send("Club bien ajouté !");
    }
  );
});

//Création d'un nouveau matche
app.post("/api/createMatche", auth, function (req, res) {
  const data = req.body;
  console.log(
    "insert into matches (id_guest,id_visitor,date) values('" +
      Object.values(data).join("','") +
      "')"
  );
  conx.execute(
    "insert into matches (id_guest,id_visitor,date) values('" +
      Object.values(data).join("','") +
      "')",
    function (err, r) {
      if (err) {
        res.status(501).send({ error: err });
      } else {
        res.status(201).send("Insertion bien effectuée !");
      }
    }
  );
});
//Suppression d'un matche
app.delete("/api/deleteMatche/:id", auth, function (req, res) {
  const id = req.params.id;
  const role = req.payload.role;
  if (role === "admin") {
    conx.execute("delete from matches where id = " + id, function (err, r) {
      if (err) {
        res.status(500).send({ error: err });
      }
      res.status(200).send({ message: "Suppression bien effectuée !" });
    });
  } else {
    res
      .status(401)
      .send({ msg: "Vous n'êtes pas autorisé à supprimer des matches" });
  }
});
//Modifier du score d'un matche
app.put("/api/updateScore/:id", auth, function (req, res) {
  const id = req.params.id;
  const score = req.body;
  conx.execute(
    "update matches set score_guest = " +
      score.guest +
      ", score_visitor = " +
      score.visitor +
      " where id = " +
      id,
    function (err, r) {
      if (err) {
        res.status(500).send({ error: err });
      }
      res.status(200).send({ message: "Mise à jour bien effectuée !" });
    }
  );
});

app.listen(3002, function (r) {
  console.log("Serveur connecté sur le port 3002");
});
