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

    // load cols

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


}

let createBtn = document.createElement("button")
createBtn.className = "newCol"
createBtn.innerText = "Create Column"


colList.appendChild(createBtn)

createBtn.addEventListener("click", () => {
createColModal()

})

// load cards

for (let card = 0; card<data.cards.length; card++){


let cardDiv = document.createElement("div")
cardDiv.className = "card"
let title = document.createElement("h3")
title.textContent = data.cards[card].title
cardDiv.appendChild(title)
let column = document.getElementById(data.cards[card].column)
column.appendChild(cardDiv)

}


let allCols = document.querySelectorAll(".col")
allCols.forEach(col =>{
    let cardBtn = document.createElement("button")
    cardBtn.className = "newCard"
    cardBtn.innerText = "Create Card"
    
    
    col.appendChild(cardBtn)
    
    cardBtn.addEventListener("click", () => {
    createCardModal()
    
    })
    
    
})


}

function createColModal(){
    document.getElementById("modalOverlay").style.display = "flex"
    document.getElementById("createModalCol").style.display = "block"
    modalCloseAuto()
 }



function createCardModal(){
    document.getElementById("modalOverlayCard").style.display = "flex"
    document.getElementById("createModalCard").style.display = "block"

    modalCloseAutoCardCreate()
 }

 function closeModalCardCreate(){
    document.getElementById("modalOverlayCard").style.display = "none"
    document.getElementById("createModalCard").style.display = "none"
 }

 function modalCloseAutoCardCreate(){
    const overlay = document.getElementById("modalOverlayCard")
    overlay.addEventListener("click", (clickEvent) => {
       if (clickEvent.target === overlay){
        closeModalCardCreate()

       }
    })
 }


 function closeModalCol(){
    document.getElementById("modalOverlay").style.display = "none"
    document.getElementById("createModalCol").style.display = "none"
 }
 

 function modalCloseAuto(){
    const overlay = document.getElementById("modalOverlay")
    overlay.addEventListener("click", (clickEvent) => {
       if (clickEvent.target === overlay){
        closeModalCol()

       }
    })
 }

 
window.onload = loadPage()