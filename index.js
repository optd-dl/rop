'use strict';

var _app = require('./bin/app');

var _constant = require('./bin/constant');

var _constant2 = _interopRequireDefault(_constant);

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var agent = require('./bin/agent'); /**
                                     * Created by robin on 7/1/16.
                                     */


if (_constant2.default.useCluster) {
    (function () {
        var ClusterServer = {
            name: 'ClusterServer',
            cpus: _os2.default.cpus().length,
            autoRestart: true, // Restart threads on death?
            start: function start(server, port) {
                var me = ClusterServer;
                var i = void 0;
                if (_cluster2.default.isMaster) {
                    for (i = 0; i < me.cpus; i += 1) {
                        agent.logger.info(me.name + ': starting worker thread #' + i);
                        var worker = _cluster2.default.fork();
                        me.forker(worker);
                    }
                    _cluster2.default.on('exit', function (worker, code, signal) {
                        // Log deaths!
                        agent.logger.info(me.name + ': worker ' + worker.process.pid + ' died.');
                        // If autoRestart is true, spin up another to replace it
                        if (signal) {
                            agent.logger.log('worker was killed by signal: ' + signal);
                        } else if (code !== 0) {
                            agent.logger.log('worker exited with error code: ' + code);
                        }
                        if (me.autoRestart) {
                            agent.logger.info(me.name + ': Restarting worker thread...');
                            me.forker(_cluster2.default.fork());
                        }
                    });
                } else {
                    // Worker threads run the server
                    server.listen(port, function () {
                        agent.logger.info('Node started, listening to port ', port);
                    });
                }
            },
            forker: function forker(worker) {
                worker.on('exit', function (code, signal) {
                    if (signal) {
                        agent.logger.log('worker was killed by signal: ' + signal);
                    } else if (code !== 0) {
                        agent.logger.log('worker exited with error code: ' + code);
                    } else {
                        agent.logger.log('worker success!');
                    }
                });
            }
        };

        ClusterServer.name = 'RopServer'; // rename ClusterServer instance
        ClusterServer.autoRestart = true;
        ClusterServer.start(_app.app, _app.app.get('port'));
    })();
} else {
    _app.app.listen(_app.app.get('port'), function () {
        agent.logger.info('Node 已启动，并开始监听端口', _app.app.get('port'));
    });
    _app.app.listen(_constant2.default.optionPort, function () {
        agent.logger.info('Node 已启动，并开始监听端口', _constant2.default.optionPort);
    });
}