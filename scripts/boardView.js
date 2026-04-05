// var:

let colIDBtn = "nil"
let activeCardID = "nil"
let draggedCard = null
let orCol = "nil"
let cardDID = "nil"

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
data.columns.sort((a,b) => a.position - b.position)

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

data.cards.sort((a,b) => a.position - b.position)
for (let card = 0; card<data.cards.length; card++){


let cardDiv = document.createElement("div")
cardDiv.className = "card"
let title = document.createElement("h3")
title.textContent = data.cards[card].title
cardDiv.appendChild(title)
let column = document.getElementById(data.cards[card].column)
column.appendChild(cardDiv)
cardDiv.draggable = "true"
cardDiv.id = data.cards[card].card_id

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

document.querySelectorAll(".col").forEach(col => {
   col.addEventListener("dragover", e => {
      e.preventDefault();

      if(!draggedCard) return;

      const afCrd = anyDrag(col, e.clientY)

      if(afCrd == null) {
         const createBtn = col.querySelector(".newCard")
         col.insertBefore(draggedCard,createBtn);
      } else {
         col.insertBefore(draggedCard, afCrd)
      }
   })

col.addEventListener("drop", async e => {
if(draggedCard) {
   // col.appendChild(draggedCard)
   await updateColPos(col)
   draggedCard = null
}
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

      activeCardID = cardID
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



      if(data?.cardDoc?.due_date){
         let dateObj = new Date(date)
         dueDate = `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`
         document.getElementById("dueDateOption").placeholder = dueDate
         console.log("Due Date Check Passed")

      } else{
         document.getElementById("dueDateOption").innerHTML = "Due Date"
         console.log("Due Date Check Failed")

      }


      document.getElementById("cardTitleModal").innerHTML = cardTitle_d
      document.getElementById("cardDiscModal").value = cardDesc

       let Ll =  document.getElementById("labelsList")
       Ll.innerHTML = ""

       if(cardLabels.length !== 0){
       for (let label = 0; label < cardLabels.length ; label++){
         let newLabel = document.createElement("div")
         newLabel.className = "cardLabels"
         newLabel.textContent = cardLabels[label]
         Ll.appendChild(newLabel)

         newLabel.addEventListener('click', e => {
            removeLabel(cardLabels[label])
         })

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

      async function editDate(date){
         let config = await fetch("../config/config.json")
         config = await config.json()
         const apiLink = config.apiLink
         const token = localStorage.getItem("frames_token")
  
     console.log(`Token: ${token}`)
     
         const response = await fetch(`${apiLink}/card/edit/${activeCardID}`, {
             method: "PATCH",
             headers: {
                 "Content-Type": "application/json",
                 "Authorization": `Bearer ${token}`,
     
             },

             body: JSON.stringify({
               value: "due_date",
               content: date,
            
   
           })
     
         })
     
         const data = await response.json()
         console.log(data)

         if(data.ok){
            console.log("Updated the due date")
            loadCard(activeCardID)
         } else {
            console.warn("Due Date update Failed.")
         }
      }


      function setUpDateBox(){
let dateBox = document.getElementById("dueDateOption")

      dateBox.addEventListener('keydown', e => {
         if (dateBox === document.activeElement) {
           if (e.key === 'Enter') {
            let [d,m,y] = dateBox.value.split("/").map(Number) // Set date format
            let fYear = y + 2000

            let date = new Date(fYear, m-1, d)
            let days = dateBox.value.split("/").length
            if (days == 1){
               date = "clear"
            }


            editDate(date)
            
         }
         }
       });
      }

  
                     
                  
      

         async function addLabel(labelName){
            let config = await fetch("../config/config.json")
            config = await config.json()
            const apiLink = config.apiLink
            const token = localStorage.getItem("frames_token")
     
        console.log(`Token: ${token}`)
        
            const response = await fetch(`${apiLink}/card/label/${activeCardID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
        
                },
   
                body: JSON.stringify({
                  type: "add",
                  name: labelName,
               
      
              })
        
            })
        
            const data = await response.json()
            console.log(data)
   
            if(data.ok){
               console.log("Added Label")
               loadCard(activeCardID)
            } else {
               console.warn("Label Adding Failed.")
            }
         }
     

         async function removeLabel(labelName){
            let config = await fetch("../config/config.json")
            config = await config.json()
            const apiLink = config.apiLink
            const token = localStorage.getItem("frames_token")
     
        console.log(`Token: ${token}`)
        
            const response = await fetch(`${apiLink}/card/label/${activeCardID}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
        
                },
   
                body: JSON.stringify({
                  type: "remove",
                  name: labelName,
               
      
              })
        
            })
        
            const data = await response.json()
            console.log(data)
   
            if(data.ok){
               console.log("Removed Label")
               loadCard(activeCardID)
            } else {
               console.warn("Label Removal Failed.")
            }
         }
     

         function setUpLabels(){
            let labelBox = document.getElementById("labelsOption")
                          
            labelBox.addEventListener('keydown', e => {
            if (labelBox === document.activeElement) {
            if (e.key === 'Enter') {
            addLabel(labelBox.value)
            labelBox.value = ""
            }
            }
           });
            }


            document.addEventListener("dragstart", e => {
               if (e.target.classList.contains("card")) {
                  draggedCard = e.target
                  orCol = e.target.parentElement
                     e.target.classList.add("drag")
               }
            })

            document.addEventListener("dragend", async e => {
               if (draggedCard){
                  let newCol = draggedCard.parentElement
                  e.target.classList.remove("drag")

                 await updateColPos(newCol)
                 

                  orCol = null
                  newCol = null
                  draggedCard = null
               }
            })
      
 async function updateColPos(col) {
   let cards = [...col.querySelectorAll(".card")]
   let params = new URLSearchParams(window.location.search)
   let boardID = params.get("id")

   const updates = cards.map((c,i) => ({
      cardID: c.id,
      position: i,
      columnID: col.id
   }))

   if (updates.length === 0) return;

   let config = await fetch("../config/config.json")
   config = await config.json()
   const apiLink = config.apiLink
   const token = localStorage.getItem("frames_token")
  
try{
      

      const response = await fetch(`${apiLink}/card/posEdit`, {
         method: "PATCH",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`,
  
         },
  
         body: JSON.stringify({
            boardID,
            updates
         })
  
       })
   
const data = await response.json()
console.log("Update perms res:", data)
      } catch(e) {
         console.log("Update perms failed:", e)
      }
      
  
  

      }




 


 function anyDrag (col, y){
   const cards = [...col.querySelectorAll(".card:not(.drag)")]
let cloxOS = Number.NEGATIVE_INFINITY
let clox = null

for (let c of cards) {
   const bx = c.getBoundingClientRect()
   const OS = y - (bx.top + bx.height / 2)
   if (OS < 0 && OS > cloxOS){
      cloxOS = OS
      clox = c

   }
}
   return clox
}
 
document.getElementById("deleteCard").addEventListener("click", async () => {
   let config = await fetch("../config/config.json")
   config = await config.json()
   const apiLink = config.apiLink
   const token = localStorage.getItem("frames_token")
   const params = new URLSearchParams(window.location.search)
   const boardID = params.get("id")
      

      const response = await fetch(`${apiLink}/card/delete/${boardID}/${activeCardID}`, {
         method: "DELETE",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`,
  
         },
  
  
  
       })
   
const data = await response.json()

if (data.ok){
   loadPage()
       document.getElementById("modalOverlayCardView").style.display = "none"
       document.getElementById("createModalCardView").style.display = "none"
} else {
   console.log("Error deleting card.")
}
})

function boardInfoAutoClose(){
   const overlay = document.getElementById("modalOverlayBoardInfo")
   overlay.addEventListener("click", (clickEvent) => {
      if (clickEvent.target === overlay){
            document.getElementById("modalOverlayBoardInfo").style.display = "none"
            document.getElementById("createModalBoardInfo").style.display = "none"
         
      }
   })
}

async function boardInfoOpen(){
   let config = await fetch("../config/config.json")
   config = await config.json()
   const apiLink = config.apiLink
   const token = localStorage.getItem("frames_token")
   const params = new URLSearchParams(window.location.search)
   const boardID = params.get("id")
   const response = await fetch(`${apiLink}/boards/getPerms?boardID=${boardID}`, {
      method: "GET",
      headers: {
          "Content-Type": "application/json",

      },

  })
  document.getElementById("ePLIST").innerHTML = ""
  document.getElementById("vPLIST").innerHTML = ""


  const data = await response.json()
  console.log(data)

  if (data.ok){

let titleV = document.createElement("h2")
titleV.innerHTML = "Viewers"
document.getElementById("vPLIST").appendChild(titleV)

let titleE = document.createElement("h2")
titleE.innerHTML = "Editors"
document.getElementById("ePLIST").appendChild(titleE)

for (let v = 0; v<data.read.length; v++){
  // <h4 class="permsOption">username</h4>

   let lbl = document.createElement("h4")
   lbl.className = "permsOption"
   lbl.innerHTML = data.read[v]


   let config = await fetch("../config/config.json")
   config = await config.json()
   const apiLink = config.apiLink
   const token = localStorage.getItem("frames_token")
   const params = new URLSearchParams(window.location.search)
const boardID = params.get("id")
   lbl.addEventListener("click", async () => {
      const response = await fetch(`${apiLink}/boards/deletePerms/${boardID}`, {
         method: "PATCH",
         headers: {
             "Content-Type": "application/json",
             "Authorization": `Bearer ${token}`,
 
         },

         body: JSON.stringify({
           username: data.read[v]
        

       })
 
     })
 
     const data = await response.json()
     console.log(data)
     if(data.ok){
      this.remove
   }


   })

   let vPl = document.getElementById("vPLIST")
   vPl.appendChild(lbl)
}


for (let v = 0; v<data.write.length; v++){
   // <h4 class="permsOption">username</h4>
 
    let lbl = document.createElement("h4")
    lbl.className = "permsOption"
    lbl.innerHTML = data.write[v]
 
 
 
    const params = new URLSearchParams(window.location.search)
 const boardID = params.get("id")
    lbl.addEventListener("click", async () => {
       const response = await fetch(`${apiLink}/boards/deletePerms/${boardID}`, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
  
          },
 
          body: JSON.stringify({
            username: data.write[v]
         
 
        })
  
      })
  
      const data = await response.json()
      console.log(data)

      if(data.ok){
         this.remove
      }
 
    })
 
    let vPl = document.getElementById("ePLIST")
    vPl.appendChild(lbl)
 }



   document.getElementById("modalOverlayBoardInfo").style.display = "flex"
   document.getElementById("createModalBoardInfo").style.display = "block"
  }


}

document.getElementById("boardName").addEventListener("click", () => {
boardInfoOpen()
})

function setName() {
   const params = new URLSearchParams(window.location.search)
const name = params.get("n")
document.getElementById("boardName").innerHTML = name

}
 
window.onload = () => {
   loadPage()
   setUpDateBox()
   setUpLabels()
   setName()
   

}



