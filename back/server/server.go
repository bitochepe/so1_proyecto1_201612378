package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/hello" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method is not supported.", http.StatusNotFound)
		return
	}
	//cmd := "free -m | head -n 2 | tail -n 1| awk '{print $6}'"
	cmd := "cat /proc/cpu_201612378"
	out, err := exec.Command("bash", "-c", cmd).Output()
	if err != nil {
		fmt.Print("Failed to execute command: %s", cmd)
		return
	}
	fmt.Print(string(out))
	// Print the output

}

func main() {
	http.HandleFunc("/hello", helloHandler) // Update this line of code

	fmt.Printf("Starting server at port 8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
