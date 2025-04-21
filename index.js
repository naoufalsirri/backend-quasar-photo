const express = require('express');
const app = express();

app.get('/', (req, res) => {
  let posts = [
    {
      caption: 'Post 1',
      location: 'This is the content of post 1',
    },
    {
      caption: 'Post 2',
      location: 'This is the content of post 2',
    },
    {
      caption: 'Post 3',
      location: 'This is the content of post 3',
    },
  ];
  res.json(posts);
});

app.listen(process.env.PORT || 3000);
