async function loadPage(){

    let config = await fetch("../config/config.json")
    config = await config.json()
    const apiLink = config.apiLink
    const token = localStorage.getItem("frames_token")
const params = new URLSearchParams(window.location.search)
const boardID = params.get("board_id")

    const response = await fetch(`${apiLink}/interface/loadpage?boardID=${boardID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,

        },

    })

    const data = await response.json()
    console.log(data)
}

function createColModal(){
    document.getElementById("modalOverlay").style.display = "flex"
    document.getElementById("createModalCol").style.display = "block"
    modalCloseAuto()
 }

 function closeModal(){
    document.getElementById("modalOverlay").style.display = "none"
    document.getElementById("createModalCol").style.display = "none"
 }
 
 function modalCloseAuto(){
    const overlay = document.getElementById("modalOverlay")
    overlay.addEventListener("click", (clickEvent) => {
       if (clickEvent.target === overlay){
        closeModal()

       }
    })
 }
window.onload = loadPage()