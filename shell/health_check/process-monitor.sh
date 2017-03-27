#!/bin/bash

#######################################################
#                                                     #
#       Copyright 2011 The Ruixue Software            #
#                                                     #
#                 Author Jacky                        #
#                                                     #
# Utility shell for Linux process monitor and restart #
#	       service monitor                        #
#                                                     #
#######################################################
export HEALTH_CHECK_DIR=/data/health_check
. $HEALTH_CHECK_DIR/common.sh

function monitor() {
PID_FILE=$1
STARTUP_COMMAND=$2

write_info ":::::::::::::::::::::::::check service[$STARTUP_COMMAND]:::>pid[$PID_FILE]:::::::::::::::>"
PID=`$HEALTH_CHECK_DIR/scan-pid.sh -f $PID_FILE`
RES=$?
if test $RES -ne 0
then
write_error "get pid from file [$PID_FILE] error"
return 251
fi

PROCESS_IS_RUNNING=`$HEALTH_CHECK_DIR/scan-process.sh --processId $PID`
RES=$?
if test $RES -ne 0
then
$HEALTH_CHECK_DIR/restart-server.sh -s $STARTUP_COMMAND
fi
}

function print_usage() {
echo "Usage:process-monitor.sh [--pid-file] [file] [--startup-command] [command]"
}

if [ $# = 0 ]; then
  print_usage
  exit 253
fi

STARTUP_COMMAND=
PID_FILE=

for i in $@ ; do
	FLAG=$i
	shift
	case $FLAG in
	  # usage flags
	  --help|-help|-h)
	    print_usage
	    exit 254
	    ;;

	  --pid-file)
	    if test $# -lt 1 ; then
	      print_usage
	      exit 241
	    fi
	    if test $(($#%2)) -ne 1 ; then
	      print_usage
	      exit 242
	    fi
	    PID_FILE=$1
	    ;;
	  --startup-command)
	    if test $# -lt 1 ; then
	      print_usage
	      exit 243
	    fi
	    if test $(($#%2)) -ne 1 ; then
	      print_usage
	      exit 244
	    fi
	    STARTUP_COMMAND=$1
	    ;;

	esac
done
if (test -z $PID_FILE) ; then
print_usage
exit 252
fi
if (test -z $STARTUP_COMMAND) ; then
print_usage
exit 252
fi
monitor $PID_FILE $STARTUP_COMMAND 
