# Rong Capital Open Platform

[![GitHub version](https://badge.fury.io/gh/optd-dl%2Frop.svg)](https://badge.fury.io/gh/optd-dl%2Frop)

R.O.P is a platform open to connect API provider(SSV) and developers(ISV), together with full-scale assisting service. We dedicate to push customization, innovation, evolution that lead to new commercial ecosystem in the Web age.


#### Quick links
[R.O.P](http://open.rongcapital.cn/), 
[Angular](https://angularjs.org/),
[Angular Material](https://material.angularjs.org),
[RequireJs](http://requirejs.org/),
[Node](https://nodejs.org/en/),

### Basis

We build our project on the basis of MVC, which means, Node the backend part plays the role of controller, instructing everything running on the front end. Anuglar as the comphrehensive view layer and API as the Model, with the mode of Front/Back end separation. 

### Installation

The latest release of R.O.P can be installed from git clone

`git clone git@github.com:optd-dl/rop.git`


### Project status
R.O.P is a big project but lack of developers, it is still under development


### The goal of R.O.P
R.O.P is a standard MEAN(Mongo, Express, Angular, Node) project, but we use API and token way instead of the Mongo part. The code for ROP API service, however, is not provided in this project. We would like to share this project just as an example of enterprise web applications.

#### R.O.P structure

**files**
```
root
│   README.md
│   index.js    
│	key.json
│	bower.json
│	gulpfile.js
│	package.json
│	.bowerrc
│	.gitignore
└───src
│   └───client
│       └───angular
│       	└───applications
│       │   │	directives.es6
│       │   │	filters.es6
│       │   │	services.es6
│       │   │	...
│       └───css
│       └───plugin
│       │   ...
|	└───server
│       └───bin
│       │   │	constant.es6
│       │   │	router.es6
│       │   │	...
│       │   index.es6
│       │   ...
│   
└───public
└───views
└───locales
│   │   zh-cn.txt
│   │   zh-en.txt
```
In the root folder, index.js is the gateway for everything, key.json defines which environment you will need to deploy. To separate front end/back end, both bower and npm are used in this project, bower to serve the client side while npm to serve the server side. 

We use gulp to build, archieve and move the source files. <br />

Now look into the src folder.

On the server side, constant defines all the configurations -- even for requirejs, router to define all the APIs and the delivering method.<br />

On the client side, we have angular, css and third party plugins. Anuglar is strictly formatted as the module + directives + filter + services way, both module or nested module alike. In the css folder, we have less files, in which uses "controller key" to simulate Shadow Dom styles.

Public contains all the static files, images etc.

### Browser Compatibility
We supports the most recent two versions of all major browsers:
Chrome (including Android), Firefox, Safari (including iOS), and Edge

### Contact us:

* [shiqifeng@rongcapital.cn](mailto:shiqifeng@rongcapital.cn)
* [zhangjunjie@rongcapital.cn](mailto:zhangjunjie@rongcapital.cn)
* [linan@rongcapital.cn](mailto:linan@rongcapital.cn)
* [liuwei@rongcapital.cn](mailto:liuwei@rongcapital.cn)
 
