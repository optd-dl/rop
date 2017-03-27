#!/bin/bash

#######################################################
#                                                     #
#       Copyright 2015 The Ruixue Software            #
#                                                     #
#                 Author:Jacky                        #
#                                                     #
# Utility shell for Linux process monitor and restart #
#           Get the pid of process                    #
#                                                     #
#######################################################

. $HEALTH_CHECK_DIR/common.sh
#LOG_FILE=/data/health_check/logs/health-check.log
function print_usage() {
echo "Usage:scan-pid.sh [-flag] [command]"
echo "flag is one of :"
echo "	-f pid-file"
echo "	--file pid-file"
}

function read_from_file() {
FILE=$1
if test -r $FILE
then
	PID=`head -n 1 $FILE`
	write_info "read pid [$PID] from [$FILE]"
	if test -z $PID
	then
		write_error "error : empty pid [$PID]"
		return 251
	fi
	isNum $PID
	IsNum=$?
	if test $IsNum -ne 0
	then
		write_error "error : non-numeric pid [$PID]"
		return 251
	fi
	write_info "get current pid [$PID] from [$FILE]"
	echo $PID
else
	write_error "permission denied to read pid file [$FILE]"
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

  --file|-f)
    if [ $# != 1 ]; then
      print_usage
      exit 252
    else
      read_from_file $1
      exit $?
    fi
    ;;

  *)
    print_usage
    exit 255
    ;;

esac
