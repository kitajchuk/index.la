theindex.la
===========

> A curation of photographers and filmmakers.



## Quickstart
This section will get the project running with all of its setup and dependencies.

### Clone
Clone this repository, `git clone git@github.com:kitajchuk/theindex.la.git && cd theindex.la`

### Install
Once you have the repository cloned locally, you can run `./bin/install` to bootstrap the project.

### Dev Server
Once the bootstrap installation is done, `./bin/start` will start the dev server.



## AWS
This app is using AWS. The following bin scripts are for connecting and deploying to EC2 instances. There are 3 tagged instances.

### Production
* `./bin/connect-production` - Connect to production

### Staging
* `./bin/connect-staging` - Connect to staging

### Node
* `./bin/connect-node` - Connect to node

### Deployment
We use [Circle CI](https://circleci.com/gh/theindex-la/theindex.la-www) to deploy to these 3 instances.



## Extras
There are a handful of npm scripts as well.

* `npm run lint` - Manually lint source/js
* `npm run jsdoc` - Generate jsdocs
* `npm run sync` - Sync local data from prismic.io
* `npm run build` - Generate static build of the site
* `npm run node` - Run the node app server locally



## Prismic.io
This project is using [prismic.io](https://prismic.io) for managing content data. The dev server is running [prismic-express](https://github.com/kitajchuk/prismic-express).
