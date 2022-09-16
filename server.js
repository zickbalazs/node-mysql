const express = require('express'), path = require('path'), app = express(), mysql = require('mysql');
let connection = mysql.createPool({
    user:'root',
    database:'2123szft_elso',
    host:'localhost',
    connectionLimit: 10
})
app.listen(3000, console.log('listen on http://localhost:3000'));
app.use(express.urlencoded({extended:true}))

app.get('/api/users', (req,res)=>{
    connection.query('Select * from users', (err, data, fields)=>{
        if (err) res.status(500).send(err)
        res.status(200).send(data);
    });
})
app.get('/register', (req,res)=>{
    res.status(200).sendFile(path.join(__dirname, './web/index.html'))
});
app.post('/register', (req,res)=>{
    console.log(req.body)
    if (req.body.password != req.body.password2){
        res.status(200).send('A jelszavak nem jók')
    }
    else{
        connection.query(`insert into users values (null, '${req.body.name}', '${req.body.email}', SHA1('${req.body.password}'))`, (err, ress)=>{
            if (err) res.status(500).send(err.sqlMessage);
            else res.status(200).send(ress)
        })
    }
});
app.get('/delete/:id', (req,res)=>{
    let d = req.params.id;
    connection.query(`DELETE FROM users WHERE (id=${req.params.id})`, (err, result)=>{
        if (err) res.status(500).send(err.sqlMessage);
        else res.status(200).send(result);
    })
})
app.get('/update', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './web/update.html'));
})
app.post('/update', (req,res)=>{
    connection.query(`update users set name='${req.body.name}', passwd=SHA1('${req.body.password}'), email='${req.body.email}' where id=${req.body.id}`, (err, result)=>{
        if (err) res.status(500).send(err.sqlMessage);
        else res.status(200).send(result);
    });
})