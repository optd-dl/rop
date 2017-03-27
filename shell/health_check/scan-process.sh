#!/bin/bash

#######################################################
#                                                     #
#       Copyright 2015 The Ruixue Software            #
#                                                     #
#                 Author:Jacky                        #
#                                                     #
# Utility shell for Linux process monitor and restart #
#   Check whether if the process of Pid is running    #
#                                                     #
#######################################################

. $HEALTH_CHECK_DIR/common.sh
#LOG_FILE=/data/health_check/logs/health-check.log
function print_usage() {
echo "Usage:scan-process.sh [-flag] [command]"
echo "flag is one of :"
echo "  -pid pid"
echo "  --processId pid"
}

function scan_process() {
PID=$1
PROCESS_IS_RUNNING=1
PIDS=`ps -ef | awk '{print $2}' | grep $PID`
for processId in $PIDS ; do
	if test $processId -eq $PID
	then
		PROCESS_IS_RUNNING=0
		break
	fi
done

if test $PROCESS_IS_RUNNING -eq 0
then
	write_info "process [$PID] is running!!!!"
	return 0
else
	write_info "process [$PID] is shutdown!!!"
	return 251
fi
}

if [ $# = 0 ]; then
  print_usage
  exit 253
fi

FLAG=$1
shift

case $FLAG in
  # usage flags
  --help|-help|-h)
    print_usage
    exit 254
    ;;

  --processId|-pid)
    if [ $# != 1 ]; then
      print_usage
      exit 252
    else
      scan_process $1
      exit $?
    fi
    ;;

  *)
    print_usage
    exit 255
    ;;

esac
