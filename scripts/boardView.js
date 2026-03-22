async function loadPage(){

    let config = await fetch("../config/config.json")
    config = await config.json()
    const apiLink = config.apiLink
    const token = localStorage.getItem("frames_token")
const params = new URLSearchParams(window.location.search)
const boardID = params.get("id")

console.log(`Token: ${token}`)

    const response = await fetch(`${apiLink}/interface/loadpage?boardID=${boardID}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,

        },

    })

    const data = await response.json()
    console.log(data)

let colList = document.getElementById("cols")
colList.innerHTML = ""

for (let col = 0; col<data.columns.length;col++){

let colDiv = document.createElement("div")
colDiv.className = "col"
colDiv.id = data.columns[col].column_id
let colTitle = document.createElement("h2")
colTitle.textContent = data.columns[col].title
colDiv.appendChild(colTitle)

colList.appendChild(colDiv)



    let createBtn = document.createElement("button")
    createBtn.className = "newCol"
    createBtn.innerText = "Create Column"


    colList.appendChild(createBtn)

    createBtn.addEventListener("click", () => {
createColModal()

})


}


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