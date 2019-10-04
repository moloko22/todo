document.getElementById("trigger").onclick = function() {open()};
document.getElementById('buttonSortDate').addEventListener('click', function(){sortDate(todosItems, newtodoItems);});
document.getElementById('buttonSortText').addEventListener('click', function(){sortText(todosItems, newtodoItems);});
document.getElementById('filterDate').addEventListener('change', function(){filterDatepicker(this.value, todosItems);});
document.getElementById('filterText').addEventListener('keyup', function(){filterText(this.value, todosItems);});
const todoButton = document.getElementById('todo-button');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementsByClassName('list-items');
const errorParagraph = document.getElementById('errorMessage');
todoButton.addEventListener('click', function(){createItem(todoInput.value);});
let d = new Date();
let date = ("0" + d.getDate()).slice(-2);
let month = d.getMonth();
let newMonth = month + 1;
let year = d.getFullYear();
let itemID = counterItemID();
if(month < 10){
    month = '0' + month;
}
let TODAY = year + '-' + newMonth + '-' + date;
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
let todosItems = [
    {
        id: 0,
        title: 'moloko3',
        date: '2019-10-01',
        day: 2,
        complete: false
    },
    {
        id: 1,
        title: 'moloko4',
        date: '2019-10-02',
        day: 1,
        complete: false
    },
    {
        id: 2,
        title: 'moloko1',
        date: '2019-09-30',
        day: 2,
        complete: true
    },
    {
        id: 3,
        title: 'moloko1',
        date: '2019-09-30',
        day: 5,
        complete: true
    }
];
generateList(todosItems);
let newtodoItems = [];
if(localStorage.getItem('todo') !== undefined && localStorage.getItem('todo') !== null && !localStorage.getItem('todo').toString().length){
    todosItems = JSON.parse(localStorage.getItem('todo'));
}
function generateList(arr){
    if(arr){
        arr.forEach(elem=>{
            addItem(elem)
        })
    }
}

function addItem(obj){
    if(!obj.title) return;
    let li = document.createElement('li');
    let checkbox = document.createElement('input');
    let textItem = obj.title;
    let deleteButton = document.createElement('button');
    let span = document.createElement('span');
    if(obj.complete){
        li.classList.toggle('checked');
        checkbox.checked = obj.complete;
    }
    deleteButton.classList.add('deleteItem');
    deleteButton.setAttribute('dataId', obj.id);
    checkbox.setAttribute('dataId', obj.id);
    checkbox.classList.add('checkboxItem');
    checkbox.setAttribute('type', 'checkbox');
    deleteButton.append('x');
    span.append(weekDays[obj.day -1]);
    todoList[0].append(listAppendItem(li, checkbox, textItem, span, deleteButton));
    todoInput.value = '';
    todoList[0].onclick = function (event) {
        if (event.target.className === 'deleteItem') {
            const id = event.target.getAttribute('dataId');
            removeTodo(+id)
        }
        if (event.target.className === 'checkboxItem') {
            itemComplete(event.target);
        }
    };
}
function itemComplete (item){
    const id = item.getAttribute('dataId');
    item.parentElement.classList.toggle('checked');
    todosItems.forEach(function(elem){
       if(elem.id + '' === id){
           elem.complete = !elem.complete;
       }
    });
    localStorage.setItem('todo', JSON.stringify(todosItems));
}
function removeTodo(index){
    const result = todosItems.filter(elem=> elem.id !== index);
    localStorage.setItem('todo', JSON.stringify(result));
    clearList();
    generateList(result);
    todosItems = result;
}
function counterItemID (){
    let id = 0;
    return function (){
        return id++;
    }
}

function createItem(title){
    if(!title){
        errorParagraph.innerHTML = 'Поле не должно быть пустым!';
        errorParagraph.style.display = 'block';
        return
    }
    let item = {
        id: itemID(),
        title: title,
        date: TODAY,
        day: d.getDay(),
        complete: false
    };
    todosItems[todosItems.length] = item;
    localStorage.setItem('todo', JSON.stringify(todosItems));
    addItem(item);
    errorParagraph.style.display = 'none';
}
function clearList(){
    todoList[0].innerHTML = '';
}

function listAppendItem(who, checkbox, title, span, button){
    who.append(checkbox);
    who.append(title);
    who.append(span);
    who.append(button);
    return who;
}
function open() {
    document.getElementById("menu").classList.toggle("show");
}
function sortDate(arr, arr2) {
    if(!arr.length) {
        errorParagraph.innerHTML = 'Список пуст, нечего сортировать!';
        errorParagraph.style.display = 'block';
        return
    }
    if(arr2.length){
        sortDate(arr2, []);
    }
    clearList();
    arr.sort(function (a, b) {
        return new Date(a.date).getTime() > new Date(b.date).getTime() ? 1 : -1
    });
    errorParagraph.style.display = 'none';
    return generateList(arr);
}
function sortText(arr, arr2) {
    if(!arr.length){
        errorParagraph.innerHTML = 'Список пуст, нечего сортировать!';
        errorParagraph.style.display = 'block';
        return
    }
    if(arr2.length){
        sortText(arr2, []);
    }
    clearList();
    arr.sort(function(a, b){
        if(a.title > b.title) { return 1}
        if(a.title < b.title) { return -1}
        return 0
    });
    errorParagraph.style.display = 'none';
    return generateList(arr);
}
function filterDatepicker(date, arr){
    if(!arr.length) {
        errorParagraph.innerHTML = 'Список пуст, нечего фильтровать!';
        errorParagraph.style.display = 'block';
        return
    }
    clearList();
    newtodoItems = arr.filter(elem => elem.date === date);
    console.log(newtodoItems);
    if(!newtodoItems.length){
        errorParagraph.innerHTML = 'По этой дате, ничего нет!';
        errorParagraph.style.display = 'block';
    }else{
        errorParagraph.style.display = 'none';
        return generateList(newtodoItems);
    }
}
function filterText(value, arr){
    var result = [];
    if(!arr.length) {
        errorParagraph.innerHTML = 'Список пуст, нечего фильтровать!';
        errorParagraph.style.display = 'block';
        return
    }
    clearList();
    arr.forEach(function(elem){
        let ourSTR = elem.title.toLowerCase();
        let searchSTR = value.toLowerCase();
       if(ourSTR.indexOf(searchSTR) !== -1){
           result.push(elem);
       }
    });
    if(!result.length){
        errorParagraph.innerHTML = 'Совпадения не найдены!';
        errorParagraph.style.display = 'block';
    }else{
        errorParagraph.style.display = 'none';
        clearList();
        newtodoItems = result;
        generateList(result);
    }
}