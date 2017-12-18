const elasticsearch = require('elasticsearch');
const express = require('express');
const request = require('request-promise');

const blackMirrorJson = require('../black_mirror.json');

const router = express.Router();

const client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace',
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

module.exports = router;

router.get('/', (req, res) => {
  res.status(200).render('index', {
    healthcheckMsg: 'Let\'s begin by making sure our elasticsearch instance is up and running:',
    healthcheckInstructions: 'Click the button below to send a health-check request to the elasticsearch client:',
  });
});

router.get('/healthcheck', (req, res) => {
  client.ping({
    requestTimeout: 10000,
  }, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).render('healthcheck', {
        healthcheckStatusError: 'Error - elasticsearch client not responding; all is not well :(',
      });
    }
    console.log('*SUCCESS* - Elasticsearch up and running; all is well.');
    res.status(200).render('healthcheck', {
      healthcheckStatusSuccess: 'Success! Elasticsearch up and running; all is well :)',
    });
  });
});

router.post('/seed', (req, res) => {
  client.bulk(blackMirrorJson, (err, res) => {
    if (err) {
      console.error(err);
      return res.status(500).render('seed', {
        seedError: 'Error - elasticsearch was not able to seed your data; please check the format and try again.',
      });
    }
  });
  console.log('*SUCCESS* - Data seeded into elasticsearch client');
  res.status(201).render('seed', {
    seedSuccess: 'Success!',
  });
});

router.get('/json', (req, res) => {
  let records;
  search().then((results) => {
    records = results.hits.hits;
  }).then(() => {
    return res.render('json', {
      json: JSON.stringify(records, null, 2),
    });
  }).catch((err) => {
    if (err.message === 'No Living connections') {
      return res.status(500).render('healthcheck', {
        healthcheckStatusError: 'Error - elasticsearch client not responding; all is not well :(',
      });
    }
    console.error(err);
    res.status(500).render('healthcheck', {
      healthcheckStatusError: 'Unhandled Error - something has gone terribly wrong...',
    });
  });
});

// /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-
// search functionality
// /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-
router.get('/explore', (req, res) => {
  res.status(200).render('explore');
});

router.post('/search/season', (req, res) => {
  console.log(req.body);
});
