document.getElementById("trigger").onclick = function() {open()};
const todoButton = document.getElementById('todo-button');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementsByClassName('list-items');
const errorParagraph = document.getElementById('errorMessage');
const todosortDate = document.getElementById('buttonSortDate').addEventListener('click', function(){sortDate(todosItems, newtodoItems);});
const todosortText = document.getElementById('buttonSortText').addEventListener('click', function(){sortText(todosItems, newtodoItems);});
const todoFilterDate = document.getElementById('filterDate').addEventListener('change', function(){filterDatepicker(this.value, todosItems);});
const todoFilterText = document.getElementById('filterText').addEventListener('keyup', function(){filterText(this.value, todosItems);});
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
let todosItems = [];
let newtodoItems = [];
if(localStorage.getItem('todo') !== undefined && localStorage.getItem('todo') !== null){
    todosItems = JSON.parse(localStorage.getItem('todo'));
}
function initList(arr){
    if(arr){
        arr.forEach(elem=>{
            addItem(elem)
        })
    }
}
initList(todosItems);
function addItem(obj){
    if(obj.title) {
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
        span.append(checkDay(d.getDay()));
        todoList[0].append(ListAppendItem(li, checkbox, textItem, span, deleteButton));
        todoInput.value = '';
        todoList[0].onclick = function (event) {
            if (event.target.className === 'deleteItem') {
                let id = event.target.getAttribute('dataId');
                removeTodo(+id)
            }
            if (event.target.className === 'checkboxItem') {
                itemComplete(event.target);
            }
        };
    }
}
function itemComplete (item){
    let id = item.getAttribute('dataId');
    item.parentElement.classList.toggle('checked');
    todosItems.forEach(function(elem){
       if(elem.id + '' === id){
           elem.complete = !elem.complete;
       }
    });
    localStorage.setItem('todo', JSON.stringify(todosItems));
}
function removeTodo(index){
    let result = todosItems.filter(elem=> elem.id !== index);
    localStorage.setItem('todo', JSON.stringify(result));
    clearList();
    initList(result);
    todosItems = result;
}
function counterItemID (){
    let id = 0;
    return function (){
        return id++;
    }
}

function createItem(title){
    if(title){
        let Item = {
            id: itemID(),
            title: title,
            date: TODAY,
            day: d.getDay(),
            complete: false
        };
        todosItems[todosItems.length] = Item;
        localStorage.setItem('todo', JSON.stringify(todosItems));
        addItem(Item);
        errorParagraph.style.display = 'none';
    }else{
        errorParagraph.innerHTML = 'Поле не должно быть пустым!';
        errorParagraph.style.display = 'block';
    }
}

function clearList(){
    todoList[0].innerHTML = '';
}

function ListAppendItem(who, checkbox, title, span, button){
    who.append(checkbox);
    who.append(title);
    who.append(span);
    who.append(button);
    return who;
}
function open() {
    document.getElementById("menu").classList.toggle("show");
}
function checkDay(day){
    let weekday = new Array(7);
    weekday[0] = 'Sun';
    weekday[1] = 'Mon';
    weekday[2] = 'Tue';
    weekday[3] = 'Wed';
    weekday[4] = 'Thu';
    weekday[5] = 'Fri';
    weekday[6] = 'Sat';
    return weekday[day]
}
function sortDate(arr, arr2) {
    if (!arr2.length) {
        clearList();
        arr.sort(function (a, b) {
            if (a.day > b.day) {
                return 1
            }
            if (a.day < b.day) {
                return -1
            }
            return 0
        });
        errorParagraph.style.display = 'none';
        return initList(arr);

    }else if(arr2.length) {
        sortDate(arr2, []);
    }else{
        errorParagraph.innerHTML = 'Список пуст, нечего сортировать!';
        errorParagraph.style.display = 'block';
    }

}
function sortText(arr, arr2) {
    if(!arr2.length){
        clearList();
        arr.sort(function(a, b){
            if(a.title > b.title) { return 1}
            if(a.title < b.title) { return -1}
            return 0
        });
        errorParagraph.style.display = 'none';
        return initList(arr);
    }else if(arr2.length){
        sortText(arr2, []);
    } else{
        errorParagraph.innerHTML = 'Список пуст, нечего сортировать!';
        errorParagraph.style.display = 'block';
    }
}
function filterDatepicker(date, arr){
    if(arr.length){
        clearList();
        newtodoItems = arr.filter(elem => elem.date === date);
        console.log(todosItems);
        if(!newtodoItems.length){
            errorParagraph.innerHTML = 'По этой дате, ничего нет!';
            errorParagraph.style.display = 'block';
        }else{
            errorParagraph.style.display = 'none';
            return initList(newtodoItems);
        }
    }else{
        errorParagraph.innerHTML = 'Список пуст, нечего фильтровать!';
        errorParagraph.style.display = 'block';
    }
}
function filterText(value, arr){
    var result = [];
    if(arr.length){
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
            initList(result);
        }
    }else{
        errorParagraph.innerHTML = 'Список пуст, нечего фильтровать!';
        errorParagraph.style.display = 'block';
    }
}