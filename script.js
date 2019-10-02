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

var d = new Date();
var date = ("0" + d.getDate()).slice(-2);
var month = d.getMonth();
var year = d.getFullYear();
if(month < 10){
    month = '0' + month;
}
var TODAY = year + '-' + month + '-' + date;

var todosItems = [];
var newtodoItems = [];
function getTodos(){
    var str = localStorage.getItem('todo');
    todosItems = JSON.parse(str);
    if(!todosItems){
        todosItems = [];
    }else{
        initList(todosItems);
    }
}
getTodos();
function saveTodos(obj){
    var str = JSON.stringify(todosItems);
    localStorage.setItem('todo', str);
}


function initList(arr){
    if(arr){
        arr.forEach(elem=>{
            addItem(elem)
        })
    }
}
function createItem(title){
    if(title){
        var id = todosItems.length;
        var Item = {
            id: id,
            title: title,
            date: TODAY,
            day: d.getDay(),
            complete: false
        };
        todosItems[id] = Item;
        saveTodos(Item);
        addItem(Item);
        errorParagraph.style.display = 'none';
    }else{
        errorParagraph.innerHTML = 'Поле не должно быть пустым!';
        errorParagraph.style.display = 'block';
    }
}
function itemComplete (item){
    item.parentElement.classList.toggle('checked');
}
function removeTodo(index, item){
    item.parentElement.remove();
    todosItems.splice(index, 1);
    clearList();
    initList(todosItems);
    console.log(todosItems);
}
function clearList(){
    todoList[0].innerHTML = '';
}
function addItem(obj){
    if(obj.title) {

        let li = document.createElement('li');
        let checkbox = document.createElement('input');
        let textItem = obj.title;
        let deleteButton = document.createElement('button');
        let span = document.createElement('span');
        deleteButton.classList.add('deleteItem');
        deleteButton.setAttribute('id', obj.id);
        checkbox.classList.add('checkboxItem');
        checkbox.setAttribute('type', 'checkbox');
        deleteButton.append('x');
        span.append(checkDay(d.getDay()));
        todoList[0].append(ListAppendItem(li, checkbox, textItem, span, deleteButton));
        todoInput.value = '';
    }
    todoList[0].onclick = function (event) {
        if (event.target.className === 'deleteItem') {
            var id = event.target.getAttribute('id');
            id = +id;
            removeTodo(id, event.target);
        }
        if (event.target.className === 'checkboxItem') {
            itemComplete(event.target);
        }
    };
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
    var weekday = new Array(7);
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
    if(value.length){
        var lastSymbol= value.slice(-1);
        clearList();
        arr.forEach(function(elem){
            for(var i = value.length-1; i < value.length; ++i){
                if(elem.title.charAt(i) === lastSymbol){
                    result.push(elem);
                }
            }
        });
        if(!result.length){
            errorParagraph.innerHTML = 'Совпадения не найдены!';
            errorParagraph.style.display = 'block';
        }else{
            errorParagraph.style.display = 'none';
            newtodoItems = result;
            return initList(result);
        }
    }else{
        errorParagraph.innerHTML = 'Список пуст, нечего фильтровать!';
        errorParagraph.style.display = 'block';
        clearList();
        return initList(arr);
    }
}



