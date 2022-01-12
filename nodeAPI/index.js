const express = require('express');
const app = express();
const mysql = require('mysql2');

const conx = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'ige42'
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get("/api/listClubs",(req,res,next)=>{
    let where = "";
    if(req.params.ids){
        where = " where id in ("+req.params.ids+")";
    }
    conx.query("select id, nom, logo from clubs"+where, function(err,data,fields){
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send({clubs: data});
        }
    })
})

app.get("/api/Matche/:id",function(req,res){
    let id = req.params.id
    try{
        conx.query(
            `SELECT m.id, m.id_guest, m.id_visitor, 
            (select nom from clubs where clubs.id = m.id_guest) as 'name_guest',
            (select logo from clubs where clubs.id = m.id_guest) as 'logo_guest',
            (SELECT ville from clubs where clubs.id = m.id_guest) as 'city', 
            (select nom from clubs where clubs.id = m.id_visitor) as 'name_visitor',
            (select logo from clubs where clubs.id = m.id_visitor) as 'logo_visitor',
            m.score_guest, m.score_visitor, m.date 
            from matches AS m where m.id = ${id}`, function(err,data,fields){
            if(err){
                res.status(500).send({msg:"Une erreur s'est produite"+err})
            }
            else{
                res.status(200).send({matche: data[0]});
            }
        })
    }
    catch(error){
        res.send({msg:"error",error})
    }
})

app.get("/api/listMatches",(req,res,next)=>{
    try{
        conx.query(
            `SELECT m.id, m.id_guest, m.id_visitor, 
            (select nom from clubs where clubs.id = m.id_guest) as 'name_guest',
            (select logo from clubs where clubs.id = m.id_guest) as 'logo_guest',
            (SELECT ville from clubs where clubs.id = m.id_guest) as 'city', 
            (select nom from clubs where clubs.id = m.id_visitor) as 'name_visitor',
            (select logo from clubs where clubs.id = m.id_visitor) as 'logo_visitor',
            m.score_guest, m.score_visitor, m.date 
            from matches AS m`, function(err,data,fields){
            if(err){
                res.status(500).send({msg:"Une erreur s'est produite"+err})
            }
            else{
                res.status(200).send({matches: data});
            }
        })
    }
    catch(error){
        res.send({msg:"error",error})
    }
})
//app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.post("/api/createMatche",function(req,res,next){
    let matche = req.body;
    conx.execute("insert into matches (id_guest, id_visitor, date) values('"+Object.values(matche).join("','")+"')", function(err,result,fiels){
        if(err){
            res.status(501).send({error:err})
        }
        res.status(201).send({message:'Ok'})
    })
})

app.put("/api/updateScore/:id",function(req,res){
    let scores = req.body;
    conx.execute("update matches set score_guest = "+scores.guest+", score_visitor = "+scores.visitor+" where id = "+req.params.id, function(err,result,fiels){
        if(err){
            res.status(500).send({error:err})
        }
        res.status(200).send({message:'Score bien mis à jour'})
    })
})

app.delete("/api/deleteMatche/:id",function(req,res){
    let id = req.params.id;
    console.log("id = ","delete from matches where id = "+id)
    conx.execute("delete from matches where id = "+id, function(err,rslt,fields){
        console.log("err = ",err," rslt = ",rslt," fileds = ",fields)
        if(err){
            console.log(err)
            res.status(500).send({error:err})
        }
        res.status(200).send({message:'Suppression du matche '+id+' bien effectuée'})
    })
})

app.listen(3002,() => {
    console.log("L'application est disponible sur http://localhost:3002...")
})