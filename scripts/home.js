function createBoard(boardTitle,perm,id){
    const boardDiv = document.createElement("div")
    boardDiv.className = "board"

    const title = document.createElement("h3")
    title.textContent = boardTitle
    boardDiv.appendChild(title)


    const permsDiv = document.createElement("div")
    permsDiv.className = "perms"

    const permText = document.createElement("h5")
    permText.textContent = perm
    permsDiv.appendChild(permText)

    boardDiv.appendChild(permsDiv)

    const boardsList = document.getElementById("boards")

    boardsList.appendChild(boardDiv)

    boardDiv.addEventListener("click", () => {
        window.location.href = `boardView.html?id=${id}`
    })
}

function createBoardModal(){
   document.getElementById("modalOverlay").style.display = "flex"
   document.getElementById("createModal").style.display = "block"
}

function closeModal(){
   document.getElementById("modalOverlay").style.display = "none"
   document.getElementById("createModal").style.display = "none"
}

function modalCloseAuto(){
   const overlay = document.getElementById("modalOverlay")
   overlay.addEventListener("click", (clickEvent) => {
      if (clickEvent.target === overlay) closeModal()
   })
}

function addCreate(){
    let createBtn = document.createElement("button")
    createBtn.className = "createBoard"
    createBtn.innerText = "Create Board"


    const boardsList = document.getElementById("boards")

    boardsList.appendChild(createBtn)

    createBtn.addEventListener("click", () => {

createBoardModal()
    })
}


async function getBoards() {
    let config = await fetch("../config/config.json")
    config = await config.json()
    const apiLink = config.apiLink

    const token = localStorage.getItem("frames_token")

    if (!token) {
        window.location = "../index.html"
        throw new Error("No auth token found")
    }

    const response = await fetch(`${apiLink}/interface/loadHome`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })

    const data = await response.json()
    console.log(data)

    if (data.ok == true){
        console.log("User validated")
        const boardsList = document.getElementById("boards")

        boardsList.innerHTML = ""
        data.write.forEach(board => {
            createBoard(board.name, "Editor", board._id)
        });
    
        data.read.forEach(board => {
            createBoard(board.name, "Viewer", board._board_id)
        });
        data.owner.forEach(board => {
            createBoard(board.name, "Owner", board._id)
        });

        addCreate()

        return true;
    } else {
        console.log("User login failed")
        window.location = "../index.html"
        return false;
    }

}

async function load(){

    let config = await fetch("../config/config.json")
    config = await config.json()
    const apiLink = config.apiLink
    const token = localStorage.getItem("frames_token")

    const response = await fetch(`${apiLink}/auth/validate`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })

    const data = await response.json()
    console.log(data)



    if (data.ok == true){
        console.log("User validated")
        getBoards()

        return true;
    } else {
        console.log("User login failed")
        window.location = "../index.html"
        return false;
    }
}


async function createBoardFmodal() {
// Create board from Modal
    let config = await fetch("../config/config.json")
    config = await config.json()
    const apiLink = config.apiLink

    let boardEdit = []
    let boardView = []

    let boardEditUS = document.getElementById("BRDCedit").value // Board edit un-split
    let boardViewUS = document.getElementById("BRDCview").value // Board view un-split

   boardEdit = boardEditUS.split(",")
   boardView = boardViewUS.split(",")


    const response = await fetch(`${apiLink}/boards/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            name: document.getElementById("BRDCname").value,
            owner_id: localStorage.getItem("frames_token"),
            permsWrite: boardEdit,
            permsRead: boardView 


        })

    })

    const data = await response.json()
    console.log(data)



    if (data.ok == true){
        console.log("Create board success.")

        load()
        return true;
    } else {
        console.log("Create board failed.")
        return false;
    }



}

window.onload = () => {
   load()
   modalCloseAuto()
}