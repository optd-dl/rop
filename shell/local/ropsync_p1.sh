DirToBackup=/Users/robin/workspace/rop/node
DirToSync=root@115.29.160.155:/data
DirTemp=~/backup
timestamp=$(date "+%Y%m%d%H%M%S")
DirTimstamp=$DirTemp/$timestamp
DirLog=$DirTemp/$timestamp/logs
mkdir -p $DirLog

rsync --dry-run --itemize-changes --out-format="%i|%n|" --recursive --update --delete --perms --owner --group --times --links --safe-links --super --one-file-system --devices --exclude "node_modules" --exclude ".svn" --exclude ".git" --exclude "public/vendor" --exclude "public/mock" $DirToBackup root@115.29.160.155:/data > $DirLog/dryrun

grep "^.f" $DirLog/dryrun | awk -F '|' '{print $2 }' | xargs tar -C /Users/robin/workspace/rop -Pczf $DirTimstamp/$timestamp.tar
tar -zcvf $DirTemp/$timestamp/node.tar --exclude=node/node_modules --exclude=node/public/vendor/ --exclude node/.svn --exclude node/.git $DirToBackup

rsync -r $DirTemp root@115.29.160.155:/data && rm -fr $DirTemp >> ~/ropsync.log 2>&1 &