async function load(){

    let config = await fetch("../config/config.json")
    config = await config.json()
    const apiLink = config.apiLink

    const response = await fetch(`${apiLink}/auth/validate`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${sessionStorage.getItem("frames_token")}`,
            "Content-Type": "application/json",
        },



    })

    const data = await response.json()
    console.log(data)



    if (data.ok == true){
        console.log("User validated")
        return true;
    } else {
        console.log("User login failed")
        window.location = "../index.html"
        return false;
    }
}

window.onload = load;