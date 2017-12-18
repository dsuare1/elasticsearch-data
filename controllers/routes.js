const elasticsearch = require('elasticsearch');
const express = require('express');
const request = require('request-promise');

const Promise = require('bluebird');

const { coroutine } = Promise;

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
  return coroutine(function* gen() {
    const results = yield client.search({
      index: 'black_mirror',
      body: {
        query: {
          match_all: {}
        }
      }
    }).catch((err) => {
      if (err.message === 'No Living connections') {
        return res.status(500).render('healthcheck', {
          healthcheckStatusError: 'Error - elasticsearch client not responding; all is not well :(',
        });
      }

      console.error(err);
      return res.status(500).render('healthcheck', {
        healthcheckStatusError: 'Unhandled Error - something has gone terribly wrong...',
      });
    });

    const records = results.hits.hits;

    res.render('json', {
      json: JSON.stringify(records, null, 2),
    });
  })();
});

// /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-
// search functionality
// /-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-
router.get('/explore', (req, res) => {
  res.status(200).render('explore');
});

router.post('/search/season', (req, res) => {
  return coroutine(function* gen() {
    const seasonNum = req.body['season-number'];

    const results = yield client.search({
      index: 'black_mirror',
      body: {
        sort: {
          number: 'asc',
        },
        query: {
          match: {
            season: seasonNum,
          },
        },
      },
    }).catch((err) => {
      console.error(err);
      return res.status(500).send('Error');
    });

    res.status(200).render('explore', {
      hits: results.hits.hits,
    });
  })();
});

router.post('/search/keyword', (req, res) => {
  return coroutine(function* gen() {
    const keyword = req.body.keyword;

    const results = yield client.search({
      index: 'black_mirror',
      body: {
        sort: {
          number: 'asc',
        },
        query: {
          match: {
            summary: keyword,
          },
        },
      },
    }).catch((err) => {
      console.error(err);
      return res.status(500).send('Error');
    });

    if (!results.hits.hits.length) {
      return res.status(200).render('explore', {
        noResults: 'No results found; try another query.',
      });
    }

    res.status(200).render('explore', {
      hits: results.hits.hits,
    });
  })();
});
