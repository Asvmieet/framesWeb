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
        sessionStorage.setItem("frames_token", data.token)

        return true;
    } else {
        console.log("User login failed")

        return false;
    }



}