const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

let posts = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { posts });
});

app.get('/create', (req, res) => {
    res.render('create', { error: null });
});

app.post('/create', (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.render('create', { error: 'Title and content cannot be empty' });
    }

    const newPost = {
        id: posts.length + 1,
        title,
        content
    };

    posts.push(newPost);
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (post) {
        res.render('edit', { post });
    } else {
        res.redirect('/');
    }
});

app.post('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const { title, content } = req.body;

    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
        posts[postIndex].title = title;
        posts[postIndex].content = content;
    }

    res.redirect('/');
});

app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    posts = posts.filter(p => p.id !== postId);
    res.redirect('/');
});

app.use((req, res) => {
    res.status(404).render('404');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
