const storedArr = localStorage.getItem("tasks");
let arr = storedArr ? JSON.parse(storedArr) : [];

tableBody = document.getElementById("dynamic-table-body");

function renderTable(newarr) {
  tableBody.innerHTML = "";

  if (Array.isArray(newarr)) {
    if (newarr.length >0) {
        newarr.forEach((item, index) => {
            const newRow = document.createElement("tr");
      
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                const newTd = document.createElement("td");
                if (key === "done") {
                  newTd.innerHTML = item[key] ? "yes" : "no";
                } else {
                  newTd.innerHTML = item[key];
                }
                newRow.appendChild(newTd);
              }
            }
      
            const actionTd = document.createElement("td");
            actionTd.innerHTML = `
                        <i class="fa fa-info-circle infoIcon" data-id="${item.id}" style="cursor:pointer;"></i>
                        <span class="action-icons">
                            <i class="fa fa-trash deleteIcon arc-icons" data-id="${item.id}" style="cursor:pointer;"></i>
                            <i class="fa fa-pen editIcon arc-icons" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal"style="cursor:pointer;"></i>
                            <i class="fa fa-check doneIcon arc-icons" data-id="${item.id}" style="cursor:pointer;"></i>
                            <i class="fa fa-close cancelIcon arc-icons" data-id="${item.id}" style="cursor:pointer;"></i>
                        </span>
                    `;
            actionTd.style.position = "relative";
            newRow.appendChild(actionTd);
            newRow.classList.add("fade-down", "border-bottom");
      
            tableBody.appendChild(newRow);
          });
    }
    else{
        

    }
   
  }

  attachInfoIconClickListeners();
}

renderTable(arr);


const noteit =  document.getElementById("noteitdown");
const saveButton = document.getElementById("saveChange");
const EditButton = document.getElementById('Editit')

noteit.addEventListener("click", function () {
    const numberInput = document.getElementById("floatingInputNumber");
    numberInput.value  = arr.length ? (arr.length +1) : 1
    const modalLabel = document.getElementById('exampleModalLabel')
    modalLabel.innerHTML = "Add New Task"
    EditButton.style.display= "none"
    saveButton.style.display = "block"

    
})
const switchInput = document.getElementById('flexSwitchCheckDefault');

switchInput.addEventListener('change', function() {
    const isChecked = switchInput.checked; 
    const switchlabel = document.getElementById('flexSwitchCheckDefaultLabel');

    switchlabel.innerHTML = isChecked ? "Done : )" : "UnDone : (" 
});



saveButton.addEventListener("click", function () {
  const taskInput = document.getElementById("floatingInputTask");
  const topicInput = document.getElementById("floatingInputTopic");

  const taskValue = taskInput.value;
  const topicValue = topicInput.value;

  taskInput.value = "";
  topicInput.value = "";
  let len = arr.length + 1;


  const newelm = {
    id: len,
    task: taskValue,
    topic: topicValue,
    done: switchInput.checked,
  };

  arr.push(newelm);
  localStorage.setItem("tasks", JSON.stringify(arr));

  renderTable(arr);
});




function attachInfoIconClickListeners() {
  const icons = document.getElementsByClassName("infoIcon");
  Array.from(icons).forEach(function (icon) {
    icon.removeEventListener("click", toggleActionIcons);
    icon.addEventListener("click", toggleActionIcons);
  });
}

function toggleActionIcons(event) {
  const allActionIcons = document.querySelectorAll(".action-icons");
  allActionIcons.forEach(function(actionIcons) {
    actionIcons.style.display = "none"; 
  });

  const id = event.target.dataset.id;

  const actionIcons = event.target.nextElementSibling;
  const isVisible = actionIcons.style.display === "inline";

  actionIcons.style.display = isVisible ? "none" : "inline";

  const deleteIcon = actionIcons.querySelector(".deleteIcon");
  const editIcon = actionIcons.querySelector(".editIcon");
  const doneIcon = actionIcons.querySelector(".doneIcon");
  const cancelIcon = actionIcons.querySelector(".cancelIcon");

  deleteIcon.removeEventListener("click", handleDelete);
  deleteIcon.addEventListener("click", handleDelete);

  editIcon.removeEventListener("click", handleEdit);
  editIcon.addEventListener("click", handleEdit);

  doneIcon.removeEventListener("click", handleDone);
  doneIcon.addEventListener("click", handleDone);

  cancelIcon.removeEventListener("click", handleCancel);
  cancelIcon.addEventListener("click", handleCancel);
}

function handleDelete(event) {
  const id = event.target.dataset.id;
  arr = arr.filter((x) => x.id !== +id);
  localStorage.setItem("tasks", JSON.stringify(arr));
  renderTable(arr);
}
var lasst ;

function handleEdit(event) {
  const id = event.target.dataset.id;
  const item = arr.filter(x=> x.id === +id)[0]

  saveButton.style.display = "none"
  EditButton.style.display = "block"

    
  const Number = document.getElementById('floatingInputNumber')
  const Task = document.getElementById('floatingInputTask')
  const Topic = document.getElementById('floatingInputTopic')
  const Done = document.getElementById('flexSwitchCheckDefault')
 
  
  const modalLabel = document.getElementById('exampleModalLabel')
  modalLabel.innerHTML = "Edit Task"

  Number.value = item.id; 
  Task.value = item.task; 
  Topic.value = item.topic;
  Done.checked = item.done;
  lasst=Number.value
}
EditButton.addEventListener("click", function () {
        
    const Number = document.getElementById('floatingInputNumber')
    const Task = document.getElementById('floatingInputTask')
    const Topic = document.getElementById('floatingInputTopic')  
    
    arr.forEach(x=>{

        if (x.id === +(lasst)) {
            x.id = parseInt(Number.value)
            x.task = Task.value
            x.topic  = Topic.value
            x.done = switchInput.checked
        }
    })

    localStorage.setItem("tasks", JSON.stringify(arr));
  
    renderTable(arr);
    Number.value =""
    Task.value =""
    Topic.value =""
    switchInput.checked =false
  });

function handleDone(event) {
  const id = event.target.dataset.id;
  arr.forEach((x) => {
    if (x.id === +id) {
      x.done = !x.done;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(arr));
  renderTable(arr);
}

function handleCancel(event) {
  const actionIcons = event.target.parentElement;
  actionIcons.style.display = "none";
}

attachInfoIconClickListeners();

const searchInput = document.getElementById("SearchInput");
const SearchBy = document.getElementById("SearchBy");

searchInput.addEventListener("input", function () {
  const searchTerm = searchInput.value;
  const searchby = SearchBy.value;
  Search(searchTerm, searchby);
});

function Search(query, by) {
    
  if (by === "id") {
    query = +query;
  } else {
    query = query.toLowerCase();
  }
  console.log(query);

  if (query === "" || query ===0) {
    renderTable(arr);
  } else {
    let newarr = [];
    newarr = arr.filter((elm) => {
      if (by === "id") {
        return elm[by] === query;
      }
      else if(by === "done"){
        x = query === "yes"? true:false
        return elm[by] === x;
      } 
      else {
        return elm[by].toLowerCase() === query;
      }
    });
    renderTable(newarr);
  }
}







