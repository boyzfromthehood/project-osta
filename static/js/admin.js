let tickets;
let ostas;
let ships;

(async () => {
    // set min and max date
    // const dateFields = document
    //     .querySelectorAll("input[type=datetime-local]")
    //     .forEach((input) => {
    //         var d = new Date();

    //         var datestring =
    //             d.getFullYear() +
    //             "-" +
    //             (d.getMonth() + 1) +
    //             "-" +
    //             d.getDate() +
    //             "T" +
    //             d.getHours() +
    //             ":" +
    //             d.getMinutes();
    //         input.min = datestring;
    //     });

    await load_ostas();
    await load_ships();
    await load_tickets();

    //add-data-form
    document.querySelectorAll("form[data-form-add]").forEach((form) => {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            await handle_form_submit(e);
        });
    });
})();

function construct_osta(source) {
    const htmlOsta = document.createElement("div");
    htmlOsta.innerHTML = ` <div class="subblock"> <div class="info-block"> <div class="info"> <p>Name</p> <p data-ostas-name>NAME</p> </div> <div class="info"> <p>Adress</p> <p data-ostas-address> Eksporta iela 1 </p> </div> </div> <div class="buttons"> <button data-ostas-_id class="btn-reset button" onclick="edit_osta(event)" > Edit </button> <button data-ostas-_id class="btn-reset button" onclick="del_osta(event)" > Remove </button> </div> </div> `;
    //data-ostas-*

    Object.keys(source).forEach((key) => {
        htmlOsta.querySelectorAll(`[data-ostas-${key}]`).forEach((s) => {
            if (!s) return;

            if (key == "_id") return (s.dataset.ostas_id = source[key]);

            s.textContent = source[key];
        });
    });

    return htmlOsta;
}
function construct_ship(source) {
    const htmlShip = document.createElement("div");
    htmlShip.innerHTML = ` <div class="subblock"> <div class="info-block"> <div class="info"> <p>Mode</p> <p data-ships-model>Tallink</p> </div> <div class="info"> <p>Release</p> <p data-ships-release>2017</p> </div> <div class="info"> <p>Number of places</p> <p data-ships-numberOfPlaces>1200</p> </div> </div> <div class="buttons"> <button data-ships-_id class="btn-reset button" onclick="edit_ship(event)" > Edit </button> <button data-ships-_id class="btn-reset button" onclick="del_ship(event)"> Remove </button> </div> </div> `;
    //data-ships-*

    Object.keys(source).forEach((key) => {
        htmlShip.querySelectorAll(`[data-ships-${key}]`).forEach((s) => {
            if (!s) return;

            if (key == "_id") return (s.dataset.ships_id = source[key]);

            s.textContent = source[key];
        });
    });

    return htmlShip;
}
function construct_tiket(source) {
    const htmlTicket = document.createElement("div");
    htmlTicket.innerHTML = ` <div class="subblock"> <div class="info-block"> <div class="info"> <p>Date</p> <p> <span data-ticket-leave>23.02</span> - <span data-ticket-arrival >24.02</span > </p> </div> <div class="info"> <p>From</p> <p data-ticket-from>Riga</p> </div> <div class="info"> <p>To</p> <p data-ticket-to>Stokholm</p> </div> <div class="info"> <p>Ship</p> <p data-ticket-ship>Tallink</p> </div> </div> <div class="buttons"> <button data-ticket-_id class="btn-reset button" onclick="edit_ticket(event)" > Edit </button> <button data-ticket-_id class="btn-reset button" onclick="del_ticket(event)" > Remove </button> </div> </div> `;

    //data-ticket-*
    Object.keys(source).forEach((key) => {
        htmlTicket.querySelectorAll(`[data-ticket-${key}]`).forEach((s) => {
            if (!s) return;

            if (key == "_id") return (s.dataset.ticket_id = source[key]);

            s.textContent = source[key];
        });
    });

    return htmlTicket;
}

function edit_ticket({ target }) {
    console.log("edit ticket with id " + target.dataset.ticket_id);
    popWindowEdit(
        target.dataset.ticket_id,
        target.parentElement.parentElement.parentElement.parentElement.querySelector(
            ".popWindow"
        ),
        tickets,
        "/tickets"
    );
}
async function del_ticket({ target }) {
    console.log("delete ticket with id " + target.dataset.ticket_id);
    await load_tickets(await del_url("/tickets", target.dataset.ticket_id));
}

function edit_osta({ target }) {
    console.log("edit osta with id " + target.dataset.ostas_id);

    popWindowEdit(
        target.dataset.ostas_id,
        target.parentElement.parentElement.parentElement.parentElement.querySelector(
            ".popWindow"
        ),
        ostas,
        "/ostas"
    );
}
async function del_osta({ target }) {
    console.log("delete osta with id " + target.dataset.ostas_id);
    await load_ostas(await del_url("/ostas", target.dataset.ostas_id));
}

function edit_ship({ target }) {
    console.log("edit ship with id " + target.dataset.ships_id);
    popWindowEdit(
        target.dataset.ships_id,
        target.parentElement.parentElement.parentElement.parentElement.querySelector(
            ".popWindow"
        ),
        ships,
        "/ships"
    );
}
async function del_ship({ target }) {
    console.log("delete ship with id " + target.dataset.ships_id);
    await load_ships(await del_url("/ships", target.dataset.ships_id));
}

// ----
async function popWindowEdit(id, popWindowElement, datasource, url) {
    const item = datasource.data.filter((item) => item._id == id)[0];
    const form = popWindowElement.querySelector("form");
    const submit_button = form.querySelector("button[type=submit]");
    submit_button.setAttribute("edit-button", id);
    popWindowElement.classList.toggle("hidden");

    // const values = [
    //     ...popWindowElement
    //         .querySelector("form")
    //         .querySelectorAll("input[type=text], input[type=datetime-local]"),
    // ].reduce((a, v) => ({ ...a, [v.name]: v }), {}); // select data and send it to server
    Object.keys(item).forEach((key) => {
        const field = form.querySelector(`input[name=${key}]`);
        if (!field) return;
        field.value = item[key];
    });

    // console.log(values);
}

function popWindow(e) {
    if (!e) {
        return document
            .querySelectorAll(".popWindow:not(.hidden)")
            .forEach((wi) => {
                wi.classList.toggle("hidden");
            });
        // future -> can clear field if we want to
        // really stupid solution
    }

    const popW = e.target.nextElementSibling; // next element should be popWindow

    const form = popW.querySelector("form");
    const submit_button = form.querySelector("button[type=submit]");
    submit_button.removeAttribute("edit-button");

    popW.classList.toggle("hidden");
}

async function put_url(url, values) {
    const d = await (
        await fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(values),
        })
    ).json();

    return { data: d.data, errors: d.errors };
}

async function del_url(url, id) {
    const d = await (
        await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id,
            }),
        })
    ).json();

    return d;
}

async function load_tickets(source = null) {
    const ticketParent = document.querySelector("[data-ticket-parent]");
    if (!source) {
        console.log("get tickets");
        tickets = await Promise.resolve(
            await (
                await fetch("/tickets", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                })
            ).json()
        );
    } else {
        tickets = source;
    }

    if (!tickets.data || tickets.errors) return console.log(tickets.errors);

    fill_parent(ticketParent, tickets, construct_tiket);
}

async function load_ships(source = null) {
    const shipsParent = document.querySelector("[data-ships-parent]");
    if (!source) {
        console.log("get ships");
        ships = await Promise.resolve(
            await (
                await fetch("/ships", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                })
            ).json()
        );
    } else {
        ships = source;
    }

    if (!ships.data || ships.errors) return console.log(ships.errors);

    fill_parent(shipsParent, ships, construct_ship);
}

async function load_ostas(source = null) {
    const ostaParent = document.querySelector("[data-ostas-parent]");
    if (!source) {
        console.log("get ostas");
        ostas = await Promise.resolve(
            await (
                await fetch("/ostas", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                    },
                })
            ).json()
        );
    } else {
        ostas = source;
    }
    if (!ostas.data || ostas.errors) return console.log(ostas.errors);

    fill_parent(ostaParent, ostas, construct_osta);
}

function fill_parent(parent, source, construct) {
    parent.innerHTML = "";
    source.data.forEach((item) => {
        parent.innerHTML += construct(item).innerHTML;
    });
}

function format_date(date) {
    const d = new Date(date);

    let [full_date, time] = d.toISOString().split("T");
    let [year, month, day] = full_date.split("-");
    let [hours, minutes] = time.split(".")[0].split(":");
    const fld = [day, month, year].join(".") + " " + [hours, minutes].join(":");

    return fld;
    // return `${d.getDay()}.${d.getMonth()}.${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
}

async function handle_form_submit(e) {
    const fadd = e.target;
    const values = [
        ...fadd.querySelectorAll(
            "input[type=text], input[type=datetime-local]"
        ),
    ].reduce((a, v) => ({ ...a, [v.name]: v.value }), {}); // select data and send it to server

    const submit_button = fadd.querySelector("button[type=submit]");
    submit_button.setAttribute("disabled", "");
    let res;
    switch (fadd.dataset.formAdd) {
        case "osta":
            res = await put_url("/ostas", values);

            if (res.errors) {
                console.log(res.errors);
                alert("something went wrong");

                submit_button.removeAttribute("disabled");
                return;
            }

            console.log("successfully added");

            if (submit_button.getAttribute("edit-button")) {
                await load_ostas(
                    await del_url(
                        "/ostas",
                        submit_button.getAttribute("edit-button")
                    )
                );
            } else {
                await load_ostas(res);
            }

            break;

        case "ship":
            console.log(values);
            res = await put_url("/ships", values);

            if (res.errors) {
                console.log(res.errors);
                alert("something went wrong");

                submit_button.removeAttribute("disabled");
                return;
            }

            console.log("successfully added");

            if (submit_button.getAttribute("edit-button")) {
                await load_ships(
                    await del_url(
                        "/ships",
                        submit_button.getAttribute("edit-button")
                    )
                );
            } else {
                await load_ships(res);
            }

            break;

        case "ticket":
            const ship = ships.data.filter(
                (ship) => ship.model == values.ship
            )[0];
            if (!ship) {
                alert("cannot find this ship");
                submit_button.removeAttribute("disabled");
                return;
            }

            const osta_from = ostas.data.filter(
                (osta) => osta.name == values.from
            )[0];

            if (!osta_from) {
                alert("cannot find this osta [from]");
                submit_button.removeAttribute("disabled");
                return;
            }

            const osta_to = ostas.data.filter(
                (osta) => osta.name == values.to
            )[0];

            if (!osta_to) {
                alert("cannot find this osta [to]");
                submit_button.removeAttribute("disabled");
                return;
            }

            console.log(values);
            // change dates to needable format
            // console.log(format_date(values.leave));
            // console.log(format_date(values.arrival));

            values.leave = format_date(values.leave);
            values.arrival = format_date(values.arrival);

            res = await put_url("/tickets", values); //

            if (res.errors) {
                console.log(res.errors);
                alert("something went wrong");

                submit_button.removeAttribute("disabled");
                return;
            }

            if (submit_button.getAttribute("edit-button")) {
                await load_tickets(
                    await del_url(
                        "/tickets",
                        submit_button.getAttribute("edit-button")
                    )
                );
            } else {
                await load_tickets(res);
            }

            console.log("successfully added");

            break;
        default:
            return;
    }
    fadd.parentElement.parentElement.parentElement.classList.toggle("hidden"); // popWindow element :3
    submit_button.removeAttribute("disabled");
    // console.log(form.dataset);
}
