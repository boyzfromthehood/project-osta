# PUT
from __main__ import (
    app,
    request,
    session,
    TICKETS,
    USERS,
    LOGS,
    SHIPS,
    OSTAS,
    uuid4,
    datetime,
)
from cProfile import (
    label,
)  # https://stackoverflow.com/questions/11994325/how-to-divide-flask-app-into-multiple-py-files


@app.route("/tickets", methods=["PUT"])
def put_tickets():

    if "user" in session and session["user"]["privledge"] == "ADMIN":
        new_tickets = request.json
        new_tickets["_id"] = "tk_" + str(uuid4())
        TICKETS.insert_one(new_tickets)
        return {"data": [*TICKETS.find({})], "errors": None}
    return {"data": None, "errors": "not logined"}


@app.route("/ostas", methods=["PUT"])
def put_ostas():

    if "user" in session and session["user"]["privledge"] == "ADMIN":
        new_osta = request.json
        new_osta["_id"] = "ost_" + str(uuid4())
        OSTAS.insert_one(new_osta)
        return {"data": [*OSTAS.find({})], "errors": None}
    return {"data": None, "errors": "not logined"}


@app.route("/ships", methods=["PUT"])
def put_ships():

    if "user" in session and session["user"]["privledge"] == "ADMIN":
        new_ship = request.json
        new_ship["_id"] = "sh_" + str(uuid4())
        SHIPS.insert_one(new_ship)
        return {"data": [*SHIPS.find({})], "errors": None}

    return {"data": None, "errors": "not logined"}


@app.route("/cart", methods=["PUT"])
def put_cart():

    if "user" in session and session["user"]["privledge"] == "CLIENT":
        # ticket = list(filter(lambda t: t["id"] == request.json["id"], TICKETS))[0]
        ticket = TICKETS.find_one({"_id": request.json["id"]})
        cart = {"_id": "transaction_" + str(uuid4()), "ticket": ticket}
        # for i in range(len(USERS)):
        #     if USERS[i]["id"] == session["user"]["id"]:

        log = {
            "_id": "bil_" + str(uuid4()),
            "logsTime": datetime.now(),
            "description": f"Ticket purchased from [{cart['ticket']['from']}] to [{cart['ticket']['to']}]",
            # "desciption": "Refund ticket from [Riga] to [Stokholm]",
            "type": "purchase",  # can be purchase | refund
        }

        LOGS.insert_one(log)

        USERS.update_one({"_id": session["user"]["_id"]}, {"$push": {"cart": cart}})
        # USERS[i]["cart"].append(cart)
        return {"data": cart, "errors": None}

    return {"data": None, "errors": "not logined"}
