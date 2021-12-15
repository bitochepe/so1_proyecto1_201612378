import time

from locust import HttpUser, task

class QuickstartUser(HttpUser):
    @task
    def access_model(self):
        self.client.get("/memo")

    def on_start(self):
        self.client.get("/memo")