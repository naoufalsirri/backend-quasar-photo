const express = require('express');
var admin = require('firebase-admin');

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();

app.get('/posts', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  let posts = [];
  db.collection('posts')
    .orderBy('date', 'desc')
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        posts.push(doc.data());
      });
      res.send(posts);
    })
    .catch((error) => {
      console.log('Error getting documents: ', error);
    });
});

app.listen(process.env.PORT || 3000);
