theindex.la
===========

> A curation of photographers and filmmakers.



## Quickstart
This section will get the project running with all of its setup and dependencies.

### Clone
Clone this repository, `git clone git@github.com:theindex-la/theindex.la-www.git && cd theindex.la-www`

### Install
Once you have the repository cloned locally, you can run `./bin/install` to bootstrap the project.

### Dev Server
Once the bootstrap installation is done, `./bin/start` will start the dev server and `npm run node` will start the node app server.



## AWS
This app is using AWS. The following bin scripts are for connecting and deploying to EC2 instances. There are 3 tagged instances.

### Production
* `./bin/connect-production` - Connect to production site

### Staging
* `./bin/connect-staging` - Connect to staging site

### Node
* `./bin/connect-node` - Connect to node app

### Deployment
We use [Circle CI](https://circleci.com/gh/theindex-la/theindex.la-www) to deploy to these 3 instances. All pushes to the `master` branch will trigger a build and deploy with Circle CI.

#### Manual Deployment
Manual deployment should be considered with caution, but these bin scripts are available to do so.

* `./bin/deploy-node` - Deploy to node app
* `./bin/deploy-staging` - Deploy to staging site
* `./bin/deploy-production` - Deploy to production site



## Extras
There are a handful of npm scripts as well.

* `npm run lint` - Manually lint source/js
* `npm run jsdoc` - Generate jsdocs
* `npm run sync` - Sync local data from prismic.io
* `npm run build` - Generate static build of the site
* `npm run node-fish` - Run the node app server locally for fish shell
* `npm run node-bash` - Run the node app server locally for bash shell



## Prismic.io
This project is using [prismic.io](https://prismic.io) for managing content data. The dev server is running [prismic-express](https://github.com/kitajchuk/prismic-express).
