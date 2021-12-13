export PATH=$PATH:/usr/local/go/bin
go get -u github.com/gorilla/websocket
go build server.go
./server