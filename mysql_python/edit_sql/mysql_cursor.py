import sqlite3
import mysql.connector
from dotenv import load_dotenv
import os
load_dotenv()

# Connect to MySQL server
mydb = mysql.connector.connect(
    host=os.getenv('DB_HOST'),
    user=os.getenv('DB_USER'),
    password=os.getenv('DB_PASSWORD'),
    database=os.getenv('DB_NAME')
)
cursor=mydb.cursor()
if mydb.is_connected():
    print("Connected to MySQL database")
else:print("Not connected")
