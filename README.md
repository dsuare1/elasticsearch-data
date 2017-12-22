<a id="top"></a>
# Derrick Suarez - elasticsearch-data

* [About](#about)
* [Installation](#installation)
* [Instructions](#instructions)
* [Technologies Used](#technologies-used)

# <a id="about"></a>About
Author: Derrick Suarez 

Web app built using [npm module elasticsearch](https://www.npmjs.com/package/elasticsearch)

* [elasticsearch](https://www.elastic.co/) makes up one piece of the ELK stack; it offers a robust search query interface, exposed through both the Search query URI and Search query body (with the latter being much more expressive)
* the other two parts of the ELK stack are:
    * [logstash](https://www.elastic.co/products/logstash) - tool designed for managing and processing logs and events
    * [kibana](https://www.elastic.co/products/kibana) - visualization platform that brings together the functionality of elasticsearch and logstash into an analytics view, offering a robust dashboard

[Back to top](#top)

# <a id="installation"></a>Installation
With the repo cloned to your local environment, run the following command in the terminal prompt:
```bash
$ npm i
```
(*shorthand for* `npm install` )

This will install all the dependencies listed in the project's `package.json` file.

*Alternatively, if you're using* `yarn` *instead of npm, you can run:* 
```bash
$ yarn install
```

[Back to top](#top)

# <a id="instructions"></a>Instructions
With the dependencies installed via `npm` or `yarn`, you can fire up the development environment by running the following command in your terminal prompt:
```bash
$ npm run start
```
*With yarn*:
```bash
$ yarn run start
```

Once the server is started up, you should see the following message in your console:
```bash
> node server.js

Elasticsearch INFO: 2017-12-20T15:58:20Z
  Adding connection to http://localhost:9200/
  

Server listening on port: 8080
```

Navigate your favorite browser to [localhost:8080](http://localhost:8080 "http://localhost:8080") and you should see the following landing page:

![elasticsearch-data landing page](https://github.com/dsuare1/elasticsearch-data/blob/master/public/images/elasticsearch-data-landing-page.png?raw=true)

If you click on the "Healthcheck elasticsearch client" button, you should see the following error page:

![elasticsearch-data landing page](https://github.com/dsuare1/elasticsearch-data/blob/master/public/images/elasticsearch-data-error-page.png?raw=true)

This is expected behavior because at this point, we do not yet have an `elasticsearch` instance up and running.

### Installing elasticsearch

There are various ways which you can install elasticsearch; I recommend using [brew](https://brew.sh/); once you have `brew` installed, you can run the following command in your terminal:
```bash
$ brew install elasticsearch
```

This will install the binaries for `elasticsearch` to the following directory:

`/usr/local/bin/elasticsearch`

To fire up a new `elasticsearch` instance, copy and paste that into your terminal and press enter

_Alternatively, you can add an `alias` to your shell terminal; I use `zsh` terminal and I have the following `alias` defined in my `~/.zshrc` config file:_
```bash
alias elasticsearch="/usr/local/bin/elasticsearch"
```
With this `alias` defined, you can now simply run the command:
```bash
$ elasticsearch
```
and it will point to the complete binary path for `elasticsearch`

Now that we have our `elasticsearch` instance up and running, leave the navigate back to [localhost:8080](http://localhost:8080 "http://localhost:8080"), click the "Home" button, and then click "Healthcheck elasticsearch client" button again.

We should now see the following success page:

![elasticsearch-data landing page](https://github.com/dsuare1/elasticsearch-data/blob/master/public/images/elasticsearch-data-success-page.png?raw=true)

We can click the "Seed Data" button to get some data bout the &copy; Netflix original series Black Mirror (one of my favorite shows) loaded into our `elasticsearch` client.

If everything went well, you should see the following success page:

![elasticsearch-data landing page](https://github.com/dsuare1/elasticsearch-data/blob/master/public/images/elasticsearch-data-data-seeded-success.png?raw=true)

We can now click on "Start Exploring the Data" to leverage the search functionality of `elasticsearch` or "View raw JSON data" to see the JSON-formatted data that was loaded into the client.

[Back to top](#top)

# <a id="technologies-used"></a>Technologies used:
1. [Node](https://nodejs.org/en/docs/)
2. [Express](http://expressjs.com/)
3. [elasticsearch](https://www.elastic.co/)
4. [handlebars](http://handlebarsjs.com/)

[Back to top](#top)
