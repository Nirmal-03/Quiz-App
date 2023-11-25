import express from 'express'
import bodyParser from 'body-parser'
import pg from "pg"

const app=express();
const port=3000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set("view engine","ejs");

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"world",
    password:"niranjan",
    port:5432
});
db.connect();

let quiz=[];
let currentQn;
let totalScore=0;

db.query("SELECT * FROM capitals",(err,res)=>{
    if(err){
        console.error("error occur while retriving data",err.stack);
    }
    else{
        quiz=res.rows
    }
    db.end();
});

app.get("/",async (req,res)=>{
    await nextQuestion();
    let wasCorrect=true;
    res.render("page",{
        qn:currentQn.country,
        score:totalScore,
        crt:wasCorrect
    })
});

app.post("/submit",async(req,res)=>{
    const ans=req.body.answer.trim();
    const dbAnswer=currentQn.capital
    let wasCorrect=false
    if(dbAnswer.toLowerCase()===ans.toLowerCase()){
        totalScore++
        wasCorrect=true
    }
    await nextQuestion();
    res.render("page",{
        qn:currentQn.country,
        score:totalScore,
        crt:wasCorrect
    })
})

async function nextQuestion(){
    const randomQn=quiz[Math.floor(Math.random()*quiz.length)]
    currentQn=randomQn;
}

app.listen(port,()=>{
    console.log(`The Server is Running on ${port}.`);
})