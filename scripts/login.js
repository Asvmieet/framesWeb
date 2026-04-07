async function login() {

    let config = await fetch("./config/config.json")
    config = await config.json()
    const apiLink = config.apiLink

    const response = await fetch(`${apiLink}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: document.getElementById("USR").value,
            password: document.getElementById("PSW").value
        })
    })

    const data = await response.json()
    console.log(data)



    if (data.ok == true){
        console.log("User logged in")
        if (data.token) {
            localStorage.setItem("frames_token", data.token)
        }
        setTimeout(() => {
            window.location.href = "./pages/home.html"

        }, 2000)
        return true;
    } else {
        console.log("User login failed")

        return false;
    }



}