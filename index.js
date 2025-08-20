const express = require('express')
const app = express()
const cors = require('cors')
const short=require('shortid');
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users=[];
const logs=[];

app.post('/api/users',function(req,res){
    let id=short.generate();
    users.push({username:req.body.username,_id:id});
    res.json({username:req.body.username,_id:id});
})
app.get('/api/users',function(req,res){
    res.json(users)
});
app.post('/api/users/:id/exercises',function(req,res){
    let id=req.params.id;
    let desc=req.body.description;
    let dur=Number(req.body.duration);
    let date;
    if(req.body.date){
      date=new Date(req.body.date).toDateString();
    }else{
      date=new Date().toDateString();
    }

    let user=users.find(x=>x._id==id);
    logs.push({username:user.username,_id:id,description:desc,duration:dur,date:date})
    res.json({username:user.username,_id:id,description:desc,duration:dur,date:date});
})
app.get('/api/users/:id/logs',function(req,res){
  let id=req.params.id;
  let user=users.find(x=>x._id==id)
  let result=logs.filter(x=>x._id==id);
  const { from, to, limit } = req.query;
  if(from){
    result=result.filter(l => new Date(l.date) >= new Date(from));
  }
  if(to){
    result=result.filter(l => new Date(l.date) <= new Date(to))
  }
  if(limit){
    result=result.slice(0,Number(limit));
  }
  res.json({
    username:user.username,_id:id,count:result.length,log:result
  });
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
