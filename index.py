# GET

from collections import UserString
from dotenv import dotenv_values, load_dotenv

load_dotenv()  # take environment variables from .env.
ENV = dotenv_values()

#
# MONGO STUFF
from pymongo import MongoClient

# from pymongo import MongoClient
# from bson.json_util import dumps
# from bson.objectid import ObjectId


client = MongoClient(
    f"mongodb+srv://{ENV.get('db_login')}:{ENV.get('db_password')}@database.x3rhu.mongodb.net/database?retryWrites=true&w=majority"
)

db = client.test_database

OSTAS = db.OSTAS
USERS = db.USERS
SHIPS = db.SHIPS
TICKETS = db.TICKETS
LOGS = db.LOGS


# print(*db.USERS.find({}))


#
#

from uuid import uuid4  # generate unique id
from datetime import date, datetime, timedelta
from flask import Flask, jsonify, redirect, render_template, request, session

app = Flask(__name__, static_url_path="/")
app.secret_key = str(uuid4())


@app.route("/")
def index():
    if "user" in session and session["user"]["privledge"] == "ADMIN":
        return render_template("admin.html")

    return render_template("index.html", logined="user" in session)


@app.route("/stats/")
def stats():
    if "user" in session and session["user"]["privledge"] == "ADMIN":
        return render_template("stats.html")
    return redirect("/login")


@app.route("/stats/csv/")
def csv_stats():
    if "user" in session and session["user"]["privledge"] == "ADMIN":
        return render_template("/components/html_to_csv.html")
    return redirect("/login")


@app.route("/stats/json/")
def json_stats():
    if "user" in session and session["user"]["privledge"] == "ADMIN":
        return render_template("/components/html_to_json.html")
    return redirect("/login")


@app.route("/cart/")
@app.route("/cart/<string:id>")
def cart(id=None):

    if "user" in session and session["user"]["privledge"] != "ADMIN":

        if not id:
            return render_template("bag.html")

        user = USERS.find_one({"_id": session["user"]["_id"]})
        cart_item = list(filter(lambda c: c["_id"] == id, user["cart"]))

        if len(cart_item) == 0:
            return redirect("/cart/")

        return render_template(
            "components/html_ticket.html", cart=cart_item[0], user=user
        )

    return redirect("/login")


import auth, get_data, add_data, delete_data


if __name__ == "__main__":
    app.run(debug=True)
