# DELETE

from __main__ import app, session, TICKETS, USERS, SHIPS, OSTAS, LOGS, uuid4, datetime
from cProfile import label

from flask import (
    request,
)  # https://stackoverflow.com/questions/11994325/how-to-divide-flask-app-into-multiple-py-files


@app.route("/tickets", methods=["DELETE"])
def del_tickets():

    if "user" in session and session["user"]["privledge"] == "ADMIN":
        # TICKETS.remove(
        #     list(filter(lambda x: x["id"] == request.json["id"], [*TICKETS.find({})]))[
        #         0
        #     ]
        # )
        # TICKETS.delete_one(
        #     list(filter(lambda x: x["id"] == request.json["id"], [*TICKETS.find({})]))[
        #         0
        #     ]
        # )

        TICKETS.delete_one({"_id": request.json["id"]})
        print([*TICKETS.find({})])
        return {"data": [*TICKETS.find({})], "errors": None}
    return {"data": None, "errors": "not logined"}


@app.route("/ostas", methods=["DELETE"])
def del_ostas():

    if "user" in session and session["user"]["privledge"] == "ADMIN":
        # OSTAS.delete_one(
        #     list(filter(lambda x: x["id"] == request.json["id"], [*OSTAS.find({})]))[0]
        # )
        OSTAS.delete_one({"_id": request.json["id"]})
        # OSTAS.remove(list(filter(lambda x: x["id"] == request.json["id"], OSTAS))[0])
        return {"data": [*OSTAS.find({})], "errors": None}
    return {"data": None, "errors": "not logined"}


@app.route("/ships", methods=["DELETE"])
def del_ships():

    if "user" in session and session["user"]["privledge"] == "ADMIN":
        # SHIPS.delete_one(
        #     list(filter(lambda x: x["id"] == request.json["id"], [*SHIPS.find({})]))[0]
        # )
        print(request.json["id"])
        SHIPS.delete_one({"_id": request.json["id"]})
        # SHIPS.remove(list(filter(lambda x: x["id"] == request.json["id"], SHIPS))[0])
        return {"data": [*SHIPS.find({})], "errors": None}

    return {"data": None, "errors": "not logined"}


@app.route("/cart", methods=["DELETE"])
def del_cart():

    if "user" in session and session["user"]["privledge"] == "CLIENT":
        # cart_id | id
        # ticket = list(filter(lambda t: t["id"] == request.json["id"], USERS))[0]

        cart = list(
            filter(
                lambda x: x["_id"] == request.json["id"],
                USERS.find_one_and_update(
                    {"_id": session["user"]["_id"]},
                    {"$pull": {"cart": {"_id": request.json["id"]}}},
                )["cart"],
            )
        )[0]

        log = {
            "_id": "bil_" + str(uuid4()),
            "logsTime": datetime.now(),
            # "description": f"Ticket purchased from [{cart['ticket']['from']}] to [{cart['ticket']['to']}]",
            "description": f"Refund ticket from [{cart['ticket']['from']}] to [{cart['ticket']['to']}]",
            "type": "refund",  # can be purchase | refund
        }

        LOGS.insert_one(log)
        return {
            "data": USERS.find_one({"_id": session["user"]["_id"]})["cart"],
            "errors": None,
        }

    return {"data": None, "errors": "not logined"}
