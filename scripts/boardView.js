// var:

let colIDBtn = "nil"

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

cardDiv.addEventListener("click", () => {
   loadCard(data.cards[card].card_id)
} )

}


let allCols = document.querySelectorAll(".col")
allCols.forEach(col =>{
    let cardBtn = document.createElement("button")
    cardBtn.className = "newCard"
    cardBtn.innerText = "Create Card"
    
    
    col.appendChild(cardBtn)
    
    cardBtn.addEventListener("click", () => {
    createCardModal(col.id)
    
    })
    
    
})


}

function createColModal(){
    document.getElementById("modalOverlay").style.display = "flex"
    document.getElementById("createModalCol").style.display = "block"
    modalCloseAuto()


 }



function createCardModal(colID){
   colIDBtn = colID

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

 async function createCard() {
   // Create card from Modal
       let config = await fetch("../config/config.json")
       config = await config.json()
       const apiLink = config.apiLink
       const params = new URLSearchParams(window.location.search)

let cardTitle = document.getElementById("CRDname").value
let cardDesc = document.getElementById("CRDdisc").value

// debugging
console.log(colIDBtn)
console.log(cardTitle)
   
       const response = await fetch(`${apiLink}/card/create`, {
           method: "POST",
           headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${localStorage.getItem("frames_token")}`,
   
           },

           body: JSON.stringify({
               title: cardTitle,
               boardID: params.get("id"),
               position: 1,
               columnID: colIDBtn,
               description: cardDesc

  
   
   
           })
   
       })
   
       const data = await response.json()
       console.log(data)
   
   
   
       if (data.ok == true){
           console.log("Create card success.")
   
           loadPage()
           closeModalCardCreate()
           return true;
       } else {
           console.log("Create card failed.")
           return false;
       }
   
   
   
   }

   async function createColumn() {
      // Create card from Modal
          let config = await fetch("../config/config.json")
          config = await config.json()
          const apiLink = config.apiLink
          const params = new URLSearchParams(window.location.search)
   
   let colTitle = document.getElementById("COLname").value
   
   // debugging

      
          const response = await fetch(`${apiLink}/column/create`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${localStorage.getItem("frames_token")}`,
      
              },
   
              body: JSON.stringify({
                  title: colTitle,
                  boardID: params.get("id"),
                  position: 1,
   
     
      
      
              })
      
          })
      
          const data = await response.json()
          console.log(data)
      
      
      
          if (data.ok == true){
              console.log("Create column success.")
      
              loadPage()
              closeModalCol()
              return true;
          } else {
              console.log("Create column failed.")
              return false;
          }
      
      
      
      }

      // Load Card

      async function loadCard(cardID) {
         const params = new URLSearchParams(window.location.search)

         const boardID = params.get("id")

         let config = await fetch("../config/config.json")
         config = await config.json()
         const apiLink = config.apiLink
         const token = localStorage.getItem("frames_token")
  
     console.log(`Token: ${token}`)
     
         const response = await fetch(`${apiLink}/card/get?boardID=${boardID}&cardID=${cardID}`, {
             method: "GET",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": `Bearer ${token}`,
     
             },
     
         })
     
         const data = await response.json()
         console.log(data)

      //   <h3 id="cardTitleModal">Card Title</h3>
        // <div class="labelsList" id="labelsList">
         //<div class="cardLabels">Label 1</div>
         //<div class="cardLabels">Label 1</div>
         //</div>

    //   <p id="cardDiscModal">description</p>

     //  <div class="options">
      //   <button class="cardOptions">Labels</button>
      //   <button class="cardOptions">Move</button>
       //  <button class="cardOptions" id="dueDateOption">Due Date</button>
       //  <button class="cardOptions">Manage Card</button>


 //      </div>
 
      //   </div>
      let cardTitle_d

      if (data.cardDoc.title){
         cardTitle_d = data.cardDoc.title
      } else cardTitle_d = ""

      let cardDesc

      if (data.cardDoc.description){
         cardDesc = data.cardDoc.description
      } else cardDesc = ""
      
     
      let cardLabels = data.cardDoc.labels
      let date = data.cardDoc.due_date
      let dueDate

      if (!data.cardDoc.due_date){
         document.getElementById("dueDateOption").innerHTML = "Due Date"

      }

      if(data.cardDoc.due_date){
         let dateObj = new Date(date)
         dueDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`
         document.getElementById("dueDateOption").innerHTML = dueDate

      } else{
         document.getElementById("dueDateOption").innerHTML = "Due Date"

      }


      document.getElementById("cardTitleModal").innerHTML = cardTitle_d
      document.getElementById("cardDiscModal").innerHTML = cardDesc

       let Ll =  document.getElementById("labelsList")
       Ll.innerHTML = ""

       if(cardLabels.length !== 0){
       for (let label = 0; label < cardLabels.length ; label++){
         let newLabel = document.createElement("div")
         newLabel.className = "cardLabels"
         newLabel.textContent = cardLabels[label]
         Ll.appendChild(newLabel)
       }
      }

       
     
         document.getElementById("modalOverlayCardView").style.display = "flex"
         document.getElementById("createModalCardView").style.display = "block"
         cardViewCloseAuto()
     
     
      
         
      }

      function cardViewCloseAuto(){
         const overlay = document.getElementById("modalOverlayCardView")
         overlay.addEventListener("click", (clickEvent) => {
            if (clickEvent.target === overlay){
                  document.getElementById("modalOverlayCardView").style.display = "none"
                  document.getElementById("createModalCardView").style.display = "none"
               
            }
         })
      }
     
 
window.onload = () => {
   loadPage()

}

