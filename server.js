const elasticsearch = require('elasticsearch');
const express = require('express');
const expshbs = require('express-handlebars');
const routes = require('./controller/routes');

const app = express();

app.engine('handlebars', expshbs({
  defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

app.use('/', routes);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
