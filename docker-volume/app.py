
import os

data_dir = "/app/data"
file_path = os.path.join(data_dir, "message.txt")

os.makedirs(data_dir, exist_ok=True)

if os.path.exists(file_path):
    with open(file_path, "r") as file:
        message = file.read()
    print("Existing data:", message)
else:
    with open(file_path, "w") as file:
        file.write("Hello from Docker Volume!")
    print("New data created!")

