const express = require('express');
const multer = require('multer');
const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
var admin = require('firebase-admin');

//const serviceAccount = require('./serviceAccountKey.json');
const serviceAccount = JSON.parse(process.env.GOOGLE_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // Utiliser le stockage en mémoire

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

app.post('/createPost', upload.single('photo'), async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  try {
    const form = new FormData();
    form.append('image', req.file.buffer, {
      filename: 'image.png',
      contentType: req.file.mimetype,
    });

    //3d884b1e574c0c9df5f3728dc6d52fc5
    //`https://api.imgbb.com/1/upload?key=${process.env.KEY_IMGBB}`
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.KEY_IMGBB}`,
      form,
      { headers: form.getHeaders() },
    );

    const imageUrl = response.data.data.url;

    const post = {
      id: req.body.id,
      caption: req.body.caption,
      location: req.body.location,
      date: Number(req.body.date),
      imageUrl: imageUrl,
    };

    db.collection('posts').doc(post.id).set(post);

    res.status(200).json({ message: 'Post créé avec succès', post });
  } catch (error) {
    console.error('Erreur upload :', error.response?.data || error.message);
    res.status(500).json({ error: "Erreur lors de l'upload", details: error.response?.data });
  }
});

app.listen(process.env.PORT || 3000);
