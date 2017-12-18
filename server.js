const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const express = require('express');
const expressValidator = require('express-validator');
const expshbs = require('express-handlebars');
const path = require('path');
const routes = require('./controllers/routes');

const app = express();

app.engine('handlebars', expshbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/search', express.static(path.join(__dirname, 'public')));
app.use('/', routes);
// app.use('/search', routes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
