package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os/exec"
	"strconv"

	"github.com/gorilla/mux"
)

type response struct {
	Data   string `json:"Data"`
	Status bool   `json:"Status"`
}

func homeRute(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Content-Type", "application/json")

	var response response
	response.Status = true

	cmd := "cat /proc/cpu_201612378"
	out, err := exec.Command("bash", "-c", cmd).Output()
	if err != nil {
		fmt.Print("Failed to execute command: ", cmd)
		response.Status = false
		json.NewEncoder(w).Encode(response)
		return
	}
	response.Data = string(out)
	json.NewEncoder(w).Encode(response)
}
func getCpu(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Content-Type", "application/json")
	var response response
	response.Status = true
	cmd := "ps -eo pcpu | sort -k 1 -r | head -50"
	out, err := exec.Command("bash", "-c", cmd).Output()
	if err != nil {
		fmt.Print("Failed to execute command: ", cmd)
		response.Status = false
		json.NewEncoder(w).Encode(response)
		return
	}
	response.Data = string(out)
	response.Data = strconv.Itoa(rand.Intn(100))
	json.NewEncoder(w).Encode(response)
}
func getMemo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Content-Type", "application/json")
	var response response
	response.Status = true
	cmd := "cat /proc/memo_201612378"
	out, err := exec.Command("bash", "-c", cmd).Output()
	if err != nil {
		fmt.Print("Failed to execute command: ", cmd)
		response.Status = false
		json.NewEncoder(w).Encode(response)
		return
	}
	datosmem := string(out)
	cmd = "free -m | head -n 2 | tail -n 1| awk '{print $6}'"
	out, err = exec.Command("bash", "-c", cmd).Output()
	if err != nil {
		fmt.Print("Failed to execute command: ", cmd)
		response.Status = false
		json.NewEncoder(w).Encode(response)
		return
	}
	response.Data = datosmem + ";" + string(out)
	json.NewEncoder(w).Encode(response)
}
func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/home", homeRute).Methods("GET")
	router.HandleFunc("/cpu", getCpu).Methods("GET")
	router.HandleFunc("/memo", getMemo).Methods("GET")
	log.Fatal(http.ListenAndServe(":3000", router))
	fmt.Println("Server running on port 3000")
}
