(async () => {
    let statsParent = document.querySelector("[data-stats-parent]");
    const t = `<div class="subblock stats-true stats-subblock"> <p data-stats-description>Ticket purchased from Riga to Stokholm</p> </div>`;
    const f = `<div class="subblock stats-false stats-subblock"><p data-stats-description>Refund ticket from Riga to Stokholm</p> </div>`;

    const d = await (
        await fetch("/stats", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
        })
    ).json();

    if (d.errors) return console.log("something went wrong", d.errors);

    statsParent.innerHTML = "";
    d.data.reverse().forEach((item) => {
        statsParent.innerHTML += construct_stat(
            item,
            item.type == "purchase" ? t : f
        ).innerHTML;
    });
})();

function construct_stat(source, block) {
    console.log(block);
    const htmlTickets = document.createElement("div");
    htmlTickets.innerHTML = block;

    Object.keys(source).forEach((key) => {
        const s = htmlTickets.querySelector(`[data-stats-${key}]`);
        if (!s) return;

        if (key == "_id") return (s.dataset.ticket_id = source[key]);

        s.textContent = source[key];
    });

    console.log(source);
    return htmlTickets;
}
