let session = require('express-session'),
    constant = require('./constant'),
    CouchbaseStore = require('connect-couchbase')(session),
    couchbaseStore = new CouchbaseStore({
        bucket: constant.couchbaseBucket,
        host: constant.couchbaseHost,
        password: constant.couchbasePassword
        /* connectionTimeout: 2000,
         operationTimeout: 2000,
         cachefile: '',
         ttl: 86400,
         prefix: 'sess'                  */
    });

couchbaseStore.on('connect', function () {
    console.log("Couchbase Session store is ready for use");
    console.log(arguments);
});


couchbaseStore.on('disconnect', function () {
    console.log("An error occurred connecting to Couchbase Session Storage");
    console.log(arguments);
    sessionOption.store = undefined;
});

let sessionOption = {
    secret: constant.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: constant.sessionMaxAge,
        path: '/',
        domain: (constant.env == "local")?undefined:`.${constant.domain}` /*+ ":" + constant.port*/
    },
    rolling: true
}, sessionNoRollingOption = {
    secret: constant.sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: constant.sessionMaxAge,
        path: '/',
        domain: (constant.env == "local")?undefined:`.${constant.domain}` /*+ ":" + constant.port*/
    }
};

sessionOption.store = (constant.sessionStore == "couchbase")? couchbaseStore:undefined;

module.exports = {session: session(sessionOption),sessionNoRolling: session(sessionNoRollingOption)};