#!/bin/bash

#######################################################
#                                                     #
#       Copyright 2015 The Ruixue Software            #
#                                                     #
#                 Author:Jacky                        #
#                                                     #
# Utility shell for Linux process monitor and restart #
#        Utility function of health check             #
#                                                     #
#######################################################


function write_info() {
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S:%N"`
LOG=$1
LINE="$TIMESTAMP INFO  $LOG"
#if test ! -e $LOG_FILE
#then
echo $LINE >> $LOG_FILE
#else
#sed -i "1i\\$LINE" $LOG_FILE
#fi
}

function write_error() {
TIMESTAMP=`date "+%Y-%m-%d %H:%M:%S:%N"`
LOG=$1
LINE="$TIMESTAMP ERROR $LOG"
#if test ! -e $LOG_FILE
#then
echo $LINE >> $LOG_FILE
#else
#sed -i "1i\\$LINE" $LOG_FILE
#fi
}

function isNum() {
echo $1|[ -n "`sed -n '/^[0-9][0-9]*$/p'`" ]
}
