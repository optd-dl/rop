/**
 * Created by robin on 7/1/16.
 */
import {app} from './bin/app';
let agent = require('./bin/agent');
import constant from './bin/constant';
import cluster from 'cluster';
import os from 'os';

if (constant.useCluster) {
    const ClusterServer = {
        name: 'ClusterServer',
        cpus: os.cpus().length,
        autoRestart: true, // Restart threads on death?
        start: function start(server, port) {
            const me = ClusterServer;
            let i;
            if (cluster.isMaster) {
                for (i = 0; i < me.cpus; i += 1) {
                    agent.logger.info(`${me.name}: starting worker thread #${i}`);
                    const worker = cluster.fork();
                    me.forker(worker);
                }
                cluster.on('exit', (worker, code, signal) => {
                    // Log deaths!
                    agent.logger.info(`${me.name}: worker ${worker.process.pid} died.`);
                    // If autoRestart is true, spin up another to replace it
                    if (signal) {
                        agent.logger.log(`worker was killed by signal: ${signal}`);
                    } else if (code !== 0) {
                        agent.logger.log(`worker exited with error code: ${code}`);
                    }
                    if (me.autoRestart) {
                        agent.logger.info(`${me.name}: Restarting worker thread...`);
                        me.forker(cluster.fork());
                    }
                });
            } else {
                // Worker threads run the server
                server.listen(port, () => {
                    agent.logger.info('Node started, listening to port ', port);
                });
            }
        },
        forker: function forker(worker) {
            worker.on('exit', (code, signal) => {
                if (signal) {
                    agent.logger.log(`worker was killed by signal: ${signal}`);
                } else if (code !== 0) {
                    agent.logger.log(`worker exited with error code: ${code}`);
                } else {
                    agent.logger.log('worker success!');
                }
            });
        }
    };

    ClusterServer.name = 'RopServer'; // rename ClusterServer instance
    ClusterServer.autoRestart = true;
    ClusterServer.start(app, app.get('port'));
} else {
    app.listen(app.get('port'), () => {
        agent.logger.info('Node 已启动，并开始监听端口', app.get('port'));
    });
    app.listen(constant.optionPort, () => {
        agent.logger.info('Node 已启动，并开始监听端口', constant.optionPort);
    });
}
