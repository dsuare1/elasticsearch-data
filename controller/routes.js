const elasticsearch = require('elasticsearch');
const express = require('express');
const request = require('request-promise');

const blackMirrorJson = require('../black_mirror.json');

const router = express.Router();

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
});

function handleError(err, res) {
  console.error('*FAILURE* - Elasticsearch data not seeded; more info:');
  console.error(err);
  res.status(500).render('index', { 'msg': '*FAILURE* - Elasticsearch data not seeded :('});
}

router.get('/', (req, res) => {
  res.status(200).render('index', { 'msg': 'Welcome to Elasticsearch' });
});

router.get('/healthcheck', (req, res) => {
  client.ping({
    requestTimeout: 10000,
  }, (err) => {
    if (err) { handleError(err, res); }
    console.log('*SUCCESS* - Elasticsearch up and running; all is well.');
    res.status(200).render('index', { 'msg': '*SUCCESS* - Elasticsearch up and running; all is well.' });
  });
});

router.get('/seed', (req, res) => {
  res.status(200).render('seed');
});

router.post('/seed', (req, res) => {
  client.bulk(blackMirrorJson, (err, res) => {
    if (err) { handleError(err, res); }
    console.log(JSON.stringify(res, null, 2));
  });
  res.status(201).render('index', { 'msg': '*SUCCESS* - Elasticsearch data seeded successfully!'});
});

async function search() {
  const records = await client.search({
    index: 'black_mirror',
    body: {
      query: {
        match_all: {}
      }
    }
  });

  return records;
}

router.get('/index', (req, res) => {
  let records;
  search().then((results) => {
    records = results.hits.hits;
  }).then(() => {
    res.json(records);
  });
});

module.exports = router;
