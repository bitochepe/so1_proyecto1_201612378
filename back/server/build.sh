export PATH=$PATH:/usr/local/go/bin
go get -u github.com/gorilla/mux
go build server.go
./server