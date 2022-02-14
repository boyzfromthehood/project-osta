// window.addEventListener("DOMContentLoaded", (event) => {
// });

document
    .querySelector("form[data-form]")
    .addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!e.target.checkValidity()) return e.target.reportValidity();

        const username = document.querySelector("[data-username]");
        const [password1, password2] =
            document.querySelectorAll("[data-password]");

        //validation
        const e_fields = {
            f_username: username.nextElementSibling,
            f_password1: password1.nextElementSibling,
            f_password2: password2.nextElementSibling,
        };

        let errors = [];

        if (username.value.length <= 3) {
            errors.push({
                field: "username",
                message: "username should be greater than 3",
            });
        }

        if (username.value.length >= 15) {
            errors.push({
                field: "username",
                message: "username cannot be greater than 15",
            });
        }

        if (password1.value.length <= 3) {
            errors.push({
                field: "password1",
                message: "password should be greater than 3",
            });
        }

        if (password1.value.length >= 50) {
            errors.push({
                field: "password1",
                message: "password cannot be greater than 50",
            });
        }

        if (password1.value !== password2.value) {
            errors.push({
                field: "password2",
                message: "passwords not the same",
            });
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
            await fetch("/register", {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify({
                    username: username.value,
                    password1: password1.value,
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
            password1.value = "";
            password2.value = "";

            submit_button.removeAttribute("disabled");
            return;
        }

        e_fields["f_username"].classList.add("hidden");
        e_fields["f_password1"].classList.add("hidden");
        e_fields["f_password2"].classList.add("hidden");

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
