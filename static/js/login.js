// window.addEventListener("DOMContentLoaded", (event) => {
// });
document
    .querySelector("form[data-form]")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!e.target.checkValidity()) return e.target.reportValidity();

        const username = document.querySelector("input[data-username]");
        const password = document.querySelector("input[data-password]");

        //validation
        const e_fields = {
            f_username: username.nextElementSibling,
            f_password: password.nextElementSibling,
        };

        let errors = [];

        if (username.value.length <= 3) {
            errors.push({
                field: "username",
                message: "incorrect username",
            });
            // e_fields.f_username.textContent = "incorrect username";
            // e_fields.f_username.classList.remove("hidden");
        }
        if (password.value.length <= 3) {
            errors.push({
                field: "password",
                message: "incorrect password",
            });
            // e_fields.f_password.textContent = "incorrect password";
            // e_fields.f_password.classList.remove("hidden");
        }

        if (errors.length > 0)
            return errors.forEach(({ field, message }) => {
                e_fields["f_" + field].textContent = message;
                e_fields["f_" + field].classList.remove("hidden");
            });

        const submit_button = document.querySelector(
            "button[data-submit-button]"
        );

        submit_button.setAttribute("disabled", "");
        const d = await (
            await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
            })
        ).json();
        // data {
        //     username:string
        //     privledge:string
        // },
        // error {
        //     field: ""
        //     message: ""
        // }

        console.log(d);

        if (d.error) {
            d.error.forEach(({ field, message }) => {
                e_fields["f_" + field].textContent = message;
                e_fields["f_" + field].classList.remove("hidden");
            });
            password.value = "";

            submit_button.removeAttribute("disabled");
            return;
        }

        e_fields["f_username"].classList.add("hidden");
        e_fields["f_password"].classList.add("hidden");

        //successful login
        window.location.reload();
    });

document.querySelectorAll("input").forEach((i) => {
    i.addEventListener("change", ({ target }) => {
        target.nextElementSibling.classList.add("hidden");
    });
});

// (() => {
//     // const username = document.querySelector("input[data-username]");
//     // const password = document.querySelector("input[data-password]");
// })();
