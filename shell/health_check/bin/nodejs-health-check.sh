export HEALTH_CHECK_DIR=/data/health_check
. $HEALTH_CHECK_DIR/common.sh
export LOG_FILE=$HEALTH_CHECK_DIR/logs/health-check-SemulatorServer.log
$HEALTH_CHECK_DIR/process-monitor.sh --pid-file /data/health_check/script/nodejs.pid --startup-command /data/health_check/script/start-nodejs



