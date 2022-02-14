let tickets;
//self executed function
(async () => {
    const response = await fetchData("/tickets");
    if (response.errors)
        return console.log(
            "something went wrong with reading data from server"
        );

    load_tickets(response.data);
    tickets = await Promise.resolve(response.data);

    //filter
    document.querySelectorAll("input[data-search-field]").forEach((input) => {
        input.addEventListener("input", () => {
            search(get_options("input[data-search-field]"));
        });

        search();
    });
})();

async function togglePop(id = null) {
    const popWin = document.getElementById("popWin");
    if (!id) return popWin.classList.toggle("hidden");

    const ticket = tickets.filter((t) => t._id == id)[0];
    Object.keys(ticket).forEach((key) => {
        const s = popWin.querySelector(`[data-change-${key}]`);
        if (!s) return;

        if (key == "_id") return (s.dataset.change_id = ticket[key]);

        s.textContent = ticket[key];
    });

    popWin.classList.toggle("hidden");
}

async function transaction({ target }) {
    const itemId = target.dataset.change_id;
    console.log("user bought ", itemId);
    // alert(itemId);
    //only logined user can buy something

    // post {i want to buy ${}} -> server {yo you are not loggined} -redirect to login screen (redirect to login screen from popWin if not loggined) | server {yo sure, you tiket now in your shopping list}

    target.setAttribute("disabled", "");

    const d = await (
        await fetch("/cart", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id: itemId,
            }),
        })
    ).json();

    if (d.errors) {
        target.removeAttribute("disabled");
        return alert("something went wrong");
    }

    // transaction realization
    window.location = "/cart";
}

async function fetchData(url) {
    const request = await fetch(url, {
        method: "POST",
        headers: {
            "Content-type": "application/json",
        },
    });

    const data = await request.json();

    return data;
}

function fill_ticket(source) {
    const htmlTickets = document.createElement("div");
    htmlTickets.innerHTML = `<div class="subblock"> <div class="info-block"> <div class="from"> <p>Living from</p> <p data-ticket-from>FROM</p> </div> <div class="icon"> <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M8.54903 6.3683C9.52694 6.3683 10.5035 6.60493 11.3731 7.05264L12.8678 7.82228L12.0738 3.23157C12.0313 2.98616 11.8181 2.80679 11.569 2.80679H9.94847V2.0372H10.7408C11.1407 2.0372 11.4651 1.71283 11.4651 1.3129C11.4651 0.912917 11.1407 0.588602 10.7408 0.588602H9.94847V0.512076C9.94847 0.229195 9.71927 0 9.43639 0H7.56335C7.28033 0 7.05118 0.229195 7.05118 0.512076V0.588554H6.25899C5.85896 0.588554 5.53464 0.912917 5.53464 1.31285C5.53464 1.71283 5.85896 2.03715 6.25899 2.03715H7.05118V2.80674H5.43066C5.18172 2.80674 4.96845 2.98611 4.92602 3.23152L4.12491 7.86357L5.75893 7.03528C6.61906 6.59892 7.58386 6.3683 8.54903 6.3683Z" fill="#999999" /> <path d="M16.7221 11.3339L10.7517 8.25974C10.2512 8.00232 9.71684 7.84102 9.17325 7.76993L8.69722 16.2521C8.69011 16.377 8.58336 16.4728 8.45811 16.4657C8.34177 16.4593 8.25084 16.3659 8.2445 16.2521L7.76981 7.79744C7.28991 7.87635 6.81774 8.02063 6.3728 8.24634L0.280805 11.3353C0.0442202 11.4552 -0.0619142 11.736 0.0367822 11.9822L3.73799 21.235C3.85719 21.5339 4.14689 21.7298 4.46868 21.7298H12.5304C12.8522 21.7298 13.1418 21.5339 13.261 21.235L16.9633 11.9793C17.0613 11.7342 16.957 11.4549 16.7221 11.3339Z" fill="#999999" /> </svg> </div> <div class="to"> <p>Going to</p> <p data-ticket-to>TO</p> </div> </div> <div class="info-block"> <div class="from"> <p>Leave</p> <p data-ticket-leave>LEAVE</p> </div> <div class="icon"> <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M8.54903 6.3683C9.52694 6.3683 10.5035 6.60493 11.3731 7.05264L12.8678 7.82228L12.0738 3.23157C12.0313 2.98616 11.8181 2.80679 11.569 2.80679H9.94847V2.0372H10.7408C11.1407 2.0372 11.4651 1.71283 11.4651 1.3129C11.4651 0.912917 11.1407 0.588602 10.7408 0.588602H9.94847V0.512076C9.94847 0.229195 9.71927 0 9.43639 0H7.56335C7.28033 0 7.05118 0.229195 7.05118 0.512076V0.588554H6.25899C5.85896 0.588554 5.53464 0.912917 5.53464 1.31285C5.53464 1.71283 5.85896 2.03715 6.25899 2.03715H7.05118V2.80674H5.43066C5.18172 2.80674 4.96845 2.98611 4.92602 3.23152L4.12491 7.86357L5.75893 7.03528C6.61906 6.59892 7.58386 6.3683 8.54903 6.3683Z" fill="#999999" /> <path d="M16.7221 11.3339L10.7517 8.25974C10.2512 8.00232 9.71684 7.84102 9.17325 7.76993L8.69722 16.2521C8.69011 16.377 8.58336 16.4728 8.45811 16.4657C8.34177 16.4593 8.25084 16.3659 8.2445 16.2521L7.76981 7.79744C7.28991 7.87635 6.81774 8.02063 6.3728 8.24634L0.280805 11.3353C0.0442202 11.4552 -0.0619142 11.736 0.0367822 11.9822L3.73799 21.235C3.85719 21.5339 4.14689 21.7298 4.46868 21.7298H12.5304C12.8522 21.7298 13.1418 21.5339 13.261 21.235L16.9633 11.9793C17.0613 11.7342 16.957 11.4549 16.7221 11.3339Z" fill="#999999" /> </svg> </div> <div class="to"> <p>Arrival</p> <p data-ticket-arrival>ARRIVAL</p> </div> </div> <button class="btn-reset button" data-ticket-_id="UNIQUE_TICKET_ID" data-ticket-buy > Buy </button> </div>`;

    Object.keys(source).forEach((key) => {
        const s = htmlTickets.querySelector(`[data-ticket-${key}]`);
        if (!s) return;

        if (key == "_id") return (s.dataset.ticket_id = source[key]);

        s.textContent = source[key];
    });

    return htmlTickets;
}

function load_tickets(data) {
    let ticketParent = document.querySelector("[data-ticket-parent]");

    if (!data[0]) {
        console.log("empty");
        return (ticketParent.innerHTML = "empty...");
    }

    ticketParent.innerHTML = "";
    data.forEach((item) => {
        ticketParent.innerHTML += fill_ticket(item).innerHTML;
    });

    //button listener
    document.querySelectorAll("button[data-ticket-buy]").forEach((b) => {
        b.addEventListener("click", async ({ target }) => {
            // console.log(target.dataset.ticketId);
            const user = await fetchData("/me");

            if (!user || user.errors) return (window.location = "/login");

            togglePop(target.dataset.ticket_id);
        });
    });
}

function search(options = get_options("input[data-search-field]")) {
    const opts = Object.keys(options);
    if (opts.length == 0) return load_tickets(tickets);

    // search logic
    const filtered = tickets.filter((item) => {
        for (const opt of opts) {
            if (!item[opt].toLowerCase().includes(options[opt].toLowerCase()))
                return false;
        }
        return true;
    });

    if (filtered.length == 0) return load_tickets([]);
    load_tickets(filtered);
}

function get_options(selector) {
    //super fancy options creation
    const options = [...document.querySelectorAll(selector)].filter(
        (v) => v.value != ""
    );

    return options.reduce(
        (a, v) => ({ ...a, [v.dataset.searchField]: v.value }),
        {}
    );
}
