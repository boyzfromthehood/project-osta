# POST

from __main__ import (
    app,
    session,
    TICKETS,
    USERS,
    LOGS,
    SHIPS,
    OSTAS,
)

# https://stackoverflow.com/questions/11994325/how-to-divide-flask-app-into-multiple-py-files


@app.route("/tickets", methods=["POST"])
def get_tickets():
    return {"data": [*TICKETS.find({})], "errors": None}


@app.route("/me", methods=["POST"])
def get_me():
    if "user" in session:
        return {
            "data": session["user"],
            "errors": None,
        }  # remove password from this query

    return {"data": None, "errors": "not logined"}


@app.route("/ostas", methods=["POST"])
def get_ostas():
    if "user" in session and session["user"]["privledge"] == "ADMIN":
        return {"data": [*OSTAS.find({})], "errors": None}

    return {"data": None, "errors": "not logined"}


@app.route("/ships", methods=["POST"])
def get_ships():

    if "user" in session and session["user"]["privledge"] == "ADMIN":
        return {"data": [*SHIPS.find({})], "errors": None}

    return {"data": None, "errors": "not logined"}


@app.route("/cart", methods=["POST"])
def get_cart():

    if "user" in session and session["user"]["privledge"] == "CLIENT":
        # user = list(
        #     filter(lambda user: user["id"] == session["user"]["id"], [*USERS.find({})])
        # )[0]
        user = USERS.find_one({"_id": session["user"]["_id"]})
        return {"data": user["cart"], "errors": None}

    return {"data": None, "errors": "not logined"}


@app.route("/stats", methods=["POST"])
def get_stats():

    if "user" in session and session["user"]["privledge"] == "ADMIN":
        return {"data": [*LOGS.find({})], "errors": None}

    return {"data": None, "errors": "not logined"}
