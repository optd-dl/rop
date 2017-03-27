#rsync -r ~/workspace/rop/node --exclude "shell" --exclude "node_modules" --exclude ".svn" --exclude ".git" --exclude "public/vendor" --exclude "public/mock" shiqifeng@10.200.48.134:/data/rop && ssh shiqifeng@10.200.48.134 "sudo pkill node" > ~/ropsync.log 2>&1 &

ssh-add ~/.ssh/id_rsa && ssh -t -p 1024 shiqifeng@121.52.221.199 -A 'ssh shiqifeng@10.200.48.134 -A "cd /data/rop/node && git pull"'
