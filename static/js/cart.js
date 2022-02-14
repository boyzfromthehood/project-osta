(async () => {
    await load_cart();
})();

async function refund({ target }) {
    const id = target.dataset.cart_id;

    const d = await (
        await fetch("/cart", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                id,
            }),
        })
    ).json();

    if (d.errors) return alert("something went wrong");

    await load_cart(d);

    return d;
}

function construct_cart(source) {
    const htmlcart = document.createElement("div");
    htmlcart.innerHTML = ` <div class="subblock"> <div class="info-block"> <div class="info"> <p>Date</p> <p> <span data-cart-leave>LEAVE</span> - <span data-cart-arrival >ARRIVAL</span > </p> </div> <div class="info"> <p>From</p> <p data-cart-from>FROM</p> </div> <div class="info"> <p>To</p> <p data-cart-to>TO</p> </div> <div class="info"> <p>Ship</p> <p data-cart-ship>SHIP</p> </div> </div> <div class="buttons"> <button data-cart-_id class="btn-reset button" onclick="open_html(event)" > html </button> <button data-cart-_id onclick="refund(event)" class="btn-reset button" > Refund </button> </div> </div>`;
    Object.keys(source.ticket).forEach((key) => {
        htmlcart.querySelectorAll(`[data-cart-${key}]`).forEach((field) => {
            if (!field) return;

            if (key == "_id") {
                field.dataset.cart_id = source[key];
                return;
            }

            field.textContent = source.ticket[key];
        });
    });

    return htmlcart;
}

async function load_cart(source = null) {
    let d;
    if (!source) {
        d = await (
            await fetch("/cart", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
            })
        ).json();
    } else {
        d = source;
    }

    if (!d || d.errors) return console.log("something went wrong: " + d.error);

    const cart = d["data"];

    // card items injection

    const cartParent = document.querySelector("[data-cart-parent]");
    cartParent.innerHTML = "";

    if (!cart[0]) return (cartParent.innerHTML = "empty..");

    cart.forEach((source) => {
        cartParent.innerHTML += construct_cart(source).innerHTML;
    });
}

function open_html({ target }) {
    window.location = "./" + target.dataset.cart_id;
}
