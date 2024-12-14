let addbtn = document.querySelector('.add-btn');
let removebtn = document.querySelector('.remove-btn');
let modalCont = document.querySelector('.modal-cont');
let textarea = document.querySelector('.textarea-cont');
let mainCont = document.querySelector('.main-cont');
let prioritySelectedColor = 'red';
let priorityContainer = [...document.querySelectorAll('.priority-color')];
let ticketArr = [];
let isModalHidden = true
let storedTicketArr = localStorage.getItem('tickets');

if (storedTicketArr) {
    ticketArr = JSON.parse(storedTicketArr);
    ticketArr.map((item) => {
        createTickect(item.task, item.color, item.id);
    })
}


priorityContainer.map((element) => {
    element.addEventListener('click', function () {
        priorityContainer.map((temp) => {
            temp.classList.remove('active')
        })
        prioritySelectedColor = element.classList[1];
        element.classList.add('active')
    })
})
var uid = new ShortUniqueId();
let isDeletButtonClicked = false;
addbtn.addEventListener('click', function () {
    if (isModalHidden) {
        modalCont.style.display = 'flex'
        isModalHidden = false
    } else {
        modalCont.style.display = 'none'
        isModalHidden = true
    }
})
removebtn.addEventListener('click', function () {
    if (isDeletButtonClicked) {
        removebtn.style.color = 'black'
        isDeletButtonClicked = false;
    } else {
        removebtn.style.color = 'red'
        isDeletButtonClicked = true
    }
})

textarea.addEventListener('keydown', function (e) {
    let key = e.key;
    if (key == "Enter") {
        createTickect(textarea.value, prioritySelectedColor);
    }
})

function createTickect(task, color, ticketId) {
    let id;
    if (ticketId) {
        id = ticketId
    } else {
        id = uid.rnd();
    }
    let ticketCont = document.createElement('div');
    let colors = ['red', 'blue', 'green', 'pink'];
    ticketCont.className = 'ticket-cont';
    ticketCont.innerHTML = `<div class="ticket-color ${color}"></div>
                            <div class="ticket-id">#${id}</div>
                            <div class="ticket-area">${task}</div>
                            <div class="lock-unlock-btn">
                                <i class="fa-solid fa-lock"></i>
                            </div>`;
    ticketArr.push({ id: id, task: task, color: color })
    if (!ticketId) {
        let stringTicketArr = JSON.stringify(ticketArr);
        localStorage.setItem("tickets", stringTicketArr);
    }
    mainCont.appendChild(ticketCont);
    modalCont.style.display = 'none'
    isModalHidden = true
    textarea.value = ""
    ticketCont.addEventListener('click', function () {
        if (isDeletButtonClicked) {
            ticketCont.remove();
            let ticketIndex = ticketArr.findIndex((obj) => {
                return obj.id == id;
            });
            ticketArr.splice(ticketIndex, 1);
            updateLocalStorage();
        }
    })
    let lockUnlockBtn = ticketCont.querySelector(".lock-unlock-btn i");
    let ticketArea = ticketCont.querySelector(".ticket-area");
    lockUnlockBtn.addEventListener('click', function () {
        if (lockUnlockBtn.classList.contains('fa-lock')) {
            lockUnlockBtn.classList.remove('fa-lock');
            lockUnlockBtn.classList.add('fa-lock-open');
            ticketCont.setAttribute('contenteditable', 'true')
        } else {
            lockUnlockBtn.classList.remove('fa-lock-open');
            lockUnlockBtn.classList.add('fa-lock');
            ticketCont.removeAttribute('contenteditable')
        }
        let ticketIndex = ticketArr.findIndex((obj) => {
            return obj.id == id;
        });
        ticketArr[ticketIndex].task = ticketArea.innerText;
        let stringTicketArr = JSON.stringify(ticketArr);
        localStorage.setItem("tickets", stringTicketArr);
    })
    let ticketColor = ticketCont.querySelector('.ticket-color');
    ticketColor.addEventListener('click', function () {
        let currentColor = ticketColor.classList[1];
        let currentIndex = colors.indexOf(currentColor);
        let nextColorIndex = (currentIndex + 1) % colors.length;
        let nextColor = colors[nextColorIndex];
        ticketColor.classList.remove(currentColor);
        ticketColor.classList.add(nextColor);
        let ticketIndex = ticketArr.findIndex((obj) => {
            return obj.id == id;
        });
        ticketArr[ticketIndex].color = nextColor;
        updateLocalStorage();
    })
}

let filterColor = [...document.querySelectorAll('.color')];
filterColor.map(element => {
    element.addEventListener('click', function () {
        let currentFilteredColor = element.classList[1];
        let allTicketsColor = [...document.querySelectorAll('.ticket-color')];
        allTicketsColor.map((item) => {
            let currentColor = item.classList[1];
            if (currentColor == currentFilteredColor) {
                item.parentElement.style.display = 'block'
            } else {
                item.parentElement.style.display = 'none'
            }
        })
    })
    element.addEventListener('dblclick', function () {
        let allTicketsColor = [...document.querySelectorAll('.ticket-color')];
        allTicketsColor.map((item) => {
            item.parentElement.style.display = 'block'

        })
    })
})


function updateLocalStorage() {
    let stringTicketArr = JSON.stringify(ticketArr);
    localStorage.setItem("tickets", stringTicketArr);
}