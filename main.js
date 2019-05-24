// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.
//////////////////// html Elements ////////////////
dataForItems = []

const calInput = document.getElementById('cal-input')
const notesInput = document.getElementById('notes-input')
const submitButton = document.getElementById('submit-cal')
const calList = document.getElementById('calories-list')

const editCal = document.getElementById('editCalInput')
const editNote = document.getElementById('editCalNotes')
const editBtn = document.getElementById('edit-submit')
//////////////////// html Elements End ////////////////

//////////////////// Event Listeners ////////////////
submitButton.addEventListener('click', event => {
  event.preventDefault()
  submitCalLog()
})

calList.addEventListener('click', event => {
  if (event.target.getAttribute("data-svg") === "trash") {
    console.log("clicked trash!@!")
    let itemId = event.target.parentElement.parentElement.parentElement.dataset.item
    // method to delete calorie item here!!!
    deleteListItem(itemId)
  } else if (event.target.getAttribute("data-svg") === "pencil") {
    let itemId = parseInt(event.target.parentElement.parentElement.parentElement.dataset.item)

    let indexInData = dataForItems.findIndex(function(obj) {
      return obj.id === itemId;
    })


    let itemData = dataForItems[indexInData]
    editCal.value = itemData.calorie
    editNote.value = itemData.note
    editBtn.dataset.editID = itemId
  }
})

editBtn.addEventListener('click', event => {
  event.preventDefault()
  
  let itemID = parseInt(event.target.dataset.editID)

  let calPatchObj = {
    api_v1_calorie_entry: {
      calorie: editCal.value,
      note: editNote.value
    }
  }

  fetch("http://localhost:3000/api/v1/calorie_entries", {
    method: "PATCH",
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({calPatchObj})
  })
  .then(resp => resp.json())
  .then(data => {
    console.log(data)
    renderEdit(data)
  })
  .catch(error => console.log(error, "couldn't edit sad "))


})

//////////////////// Event Listeners End ////////////////

//////////////////// Event Methods ////////////////
let submitCalLog = () => {

  let calPostObj = {
    api_v1_calorie_entry: {
      calorie: calInput.value,
      note: notesInput.value
    }
  }

  postCalorie(calPostObj)
}

let deleteListItem = itemId => {
  fetchDelete(itemId)
}

//////////////////// Event Methods End ////////////////

//////////////////// Fetch Methods ////////////////
let getCalItems = () => {
  fetch("http://localhost:3000/api/v1/calorie_entries")
  .then(resp => resp.json())
  .then(data => {
    console.log(data)
    renderAllItems(data)
  })
}

let postCalorie = calData => {
  fetch("http://localhost:3000/api/v1/calorie_entries", {
    method: "POST",
    headers:{
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(calData)
  })
  .then(resp => resp.json())
  .then(respData => {
     console.log("This is the resp", respData)
     renderCalItem(respData)
  })
}

let fetchDelete = id => {
  let itemID = parseInt(id)
  fetch(`http://localhost:3000/api/v1/calorie_entries/${itemID}`, {method: "DELETE"})
  .then(resp => rendDeleteItem(itemID))
  .catch(error => console.log(error, "couldn't delete item"))
}
//////////////////// Fetch Methods End ////////////////

//////////////////// Render Methods ////////////////
let renderCalItem = calData => {
  calList.innerHTML += nightmareLi(calData)
  dataForItems.push(calData)
}

let renderAllItems = respData => {
  for (let i = 0; i < respData.length; i++) {
    renderCalItem(respData[i])
    dataForItems.push(respData[i])
  }
}

let rendDeleteItem = id => {
  let listItem = document.getElementById(`cal-item-${id}`)
  listItem.parentElement.removeChild(listItem)
}

let renderEdit = (respData) => {
  let edItem = document.getElementById(`cal-item-${respData.id}`)
  let newItem = nightmareLi(respData)

  document.replaceChild(edItem, newItem)
  // item.replaceChild(textnode, item.childNodes[0]);
}
//////////////////// Render Methods End ////////////////

//////////////////// Helper Methods ////////////////
let nightmareLi = calResp => {
  return (`
  <li id="cal-item-${calResp.id}" data-item="${calResp.id}" class="calories-list-item">
    <div class="uk-grid">
      <div class="uk-width-1-6">
        <strong>${calResp.calorie}</strong>
        <span>kcal</span>
      </div>
      <div class="uk-width-4-5">
        <em class="uk-text-meta">${calResp.note}</em>
      </div>
    </div>
    <div class="list-item-menu">
      <a class="edit-button uk-icon" uk-icon="icon: pencil" uk-toggle="target: #edit-form-container"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="pencil"><path fill="none" stroke="#000" d="M17.25,6.01 L7.12,16.1 L3.82,17.2 L5.02,13.9 L15.12,3.88 C15.71,3.29 16.66,3.29 17.25,3.88 C17.83,4.47 17.83,5.42 17.25,6.01 L17.25,6.01 Z"></path><path fill="none" stroke="#000" d="M15.98,7.268 L13.851,5.148"></path></svg></a>
      <a class="delete-button uk-icon" uk-icon="icon: trash"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" data-svg="trash"><polyline fill="none" stroke="#000" points="6.5 3 6.5 1.5 13.5 1.5 13.5 3"></polyline><polyline fill="none" stroke="#000" points="4.5 4 4.5 18.5 15.5 18.5 15.5 4"></polyline><rect x="8" y="7" width="1" height="9"></rect><rect x="11" y="7" width="1" height="9"></rect><rect x="2" y="3" width="16" height="1"></rect></svg></a>
    </div>
  </li>
  `)
}

//////////////////// Helper Methods End ////////////////

//////////////////// App Runner Methods ////////////////
getCalItems()
