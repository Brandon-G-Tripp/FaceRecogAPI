const express = require('express');
const app = express();
// const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');


const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : '',
        password : '',
        database : 'smart-brain'
    }
})



app.use(express.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
            {
            id: '987',
            has: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
    res.json('signin');
})

app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .then(user => {
            res.json(user[0]);
        })
        .catch(err => res.status(400).json('Unable to log in'));
});

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
        .then(user => {
            if (user.length){
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json('Not found'))
    // if (!found) {
    //     res.status(400).json('not found');
    // }
})

app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('not found');
    }
})


// bcrypt.hash("bacon", null, null, function(err, hash) {
//     // Store hash in your password DB.
// });

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });




app.listen(3000, () => {
    console.log('hello');
})


