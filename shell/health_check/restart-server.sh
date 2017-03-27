#!/bin/bash

#######################################################
#                                                     #
#       Copyright 2015 The Ruixue Software            #
#                                                     #
#                 Author:Jacky                        #
#                                                     #
# Utility shell for Linux process monitor and restart #
#              Restart the server                     #
#                                                     #
#######################################################

. $HEALTH_CHECK_DIR/common.sh
#LOG_FILE=/data/health_check/logs/health-check.log
function print_usage() {
echo "Usage:restart-server.sh [-flag] [command]"
echo "flag is one of :"
echo "  -s command"
echo "  --server command"
}

function scan_process() {
COMMAND=$1
write_info "start server [$COMMAND]========>"
su - root -c $COMMAND
#IFS=$'\n\n' 
#for line in `$COMMAND 2>&1 `;do
#write_info $line
#done
write_info "start server completed========>"
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

  --server|-s)
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
