package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os/exec"

	"github.com/gorilla/mux"
)

type response struct {
	Data    string `json:"Data"`
	Status  bool   `json:"Status"`
	MemHome string `json:"MemHome"`
}

func homeRute(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Content-Type", "application/json")
	var response response
	response.Status = true

	//obtengo los proesos
	cmd := "cat /proc/cpu_201612378"
	out, err := exec.Command("bash", "-c", cmd).Output()
	if err != nil {
		fmt.Print("Failed to execute command: ", cmd)
		response.Status = false
		json.NewEncoder(w).Encode(response)
		return
	}
	response.Data = string(out)

	//obtener datos de la memoria
	cmd = "cat /proc/memo_201612378"
	out, err = exec.Command("bash", "-c", cmd).Output()
	if err != nil {
		fmt.Print("Failed to execute command: ", cmd)
		response.Status = false
		json.NewEncoder(w).Encode(response)
		return
	}
	response.MemHome = string(out)
	json.NewEncoder(w).Encode(response)
}

func getCpu(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Content-Type", "application/json")
	var response response
	response.Status = true
	//cmd := "ps -eo pcpu | sort -k 1 -r | head -50"
	cmd := "top -b -n1 | tail -n+7 | head -n50 | awk '{print $9}'"
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
	response.Data = datosmem + "\n\"memCache\": " + string(out) + "}"
	json.NewEncoder(w).Encode(response)
}

func killTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
	w.Header().Set("Content-Type", "application/json")
	var response response
	response.Status = true

	vars := mux.Vars(r)
	taskID := vars["pid"]

	//matar proceso
	out, err := exec.Command("kill", "-9", taskID).Output()
	if err != nil {
		fmt.Print("Failed to execute command: kill ")
		response.Status = false
		json.NewEncoder(w).Encode(response)
		return
	}
	response.Data = string(out)
	json.NewEncoder(w).Encode(response)
}

func main() {
	router := mux.NewRouter().StrictSlash(true)
	router.HandleFunc("/home", homeRute).Methods("GET")
	router.HandleFunc("/cpu", getCpu).Methods("GET")
	router.HandleFunc("/memo", getMemo).Methods("GET")
	router.HandleFunc("/kill/{pid}", killTask).Methods("GET")
	fmt.Println("Server running on port 3000")
	log.Fatal(http.ListenAndServe(":3000", router))
}
