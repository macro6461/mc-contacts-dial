var search = '';
var filterBy = 'name';
var buttons = [];
var isTyping = false;
var timeout, letter;
var contacts = [];
var nameCheck = null;

var numNameMap = {
    2: 'abc',
    3: 'def',
    4: 'ghi',
    5: 'jkl',
    6: 'mno',
    7: 'pqrs',
    8: 'tuv',
    9: 'wxyz'
}

$( document ).ready(function() {
    $('#toggle').change(toggleChange)
    $('.customCol').click(onChange)
    $('#delete').click(onDelete)
    fetchContacts()
});

const fetchContacts = () => {
    fetch('http://localhost:3000/contacts')
    .then(res=>res.json())
    .then((data)=>{
        contacts = data.contacts
        renderContacts()
    })
}

const toggleChange = (e) => {
    filterBy = e.target.checked ? 'number' : 'name' 
    isTyping = false
    $('.number')[0].children[0].innerHTML = ''
    search = ''
    renderContacts()
}

const checkWhichEl = (e)=>{
    var val;
    var className = e.target.className
    var tagName = e.target.tagName

        if (className === 'customCol'){
            val = e.target.children[0].children[0].innerText 
        } else if (tagName === 'DIV'){
            val = e.target.children[0].innerText
        } else if (tagName === 'H3') {
            val = e.target.innerText
        } else if (tagName === 'P'){
            val = e.target.previousElementSibling.innerText
        } 
   
    return val
}

const onChange = (e) => {
    if (e.target.tagName !== 'IMG' || e.target.children[0].tagName !== 'IMG'){
        var val = checkWhichEl(e)
        if (filterBy === 'name'){

        } else {

        }
        search += val
        $('.number')[0].children[0].innerHTML = search
        renderContacts()
    }
}

const handleElse = (newArr, names, x) =>{
    if (names.indexOf(x.name) > -1) {
        newArr.splice(newArr.indexOf(x), 1);
        newArr.splice(names.indexOf(x.name))
    }
    return newArr
}

const filterByName = (list) => {
    var mappedItems = []
    var newArr = []
    var names = []

    for (var i = 0; i < search.length; ++i){
        if (numNameMap[search[i]]){
            mappedItems.push(numNameMap[search[i]])
        }
    }

    list.forEach(x=>{
        var prev;
        mappedItems.forEach((y,i)=>{
            var index = i - 1
            if (prev && index >=0){
                if (prev.indexOf(x.name.toLowerCase()[index]) > -1 && y.indexOf(x.name.toLowerCase()[i]) > -1){
                    names.indexOf(x.name) === -1 ? newArr.push(x) : null
                    names.push(x.name)
                } else {
                    newArr = handleElse(newArr, names, x)
                }
            } else {
                if (y.indexOf(x.name.toLowerCase()[i]) > -1){
                    names.indexOf(x.name) === -1 ? newArr.push(x) : null
                    names.push(x.name)
                } else {
                    newArr = handleElse(newArr, names, x)
                }
            }
            prev = y
        })
    })

    return newArr
}

const renderContacts = () => {
    $('#delete')[0].style.visibility = search.length > 0 ? 'visible' : 'hidden'
    $('.contacts')[0].innerHTML = ''

    var list = contacts.sort((a, b)=>{
        return a.name < b.name ? -1 : 1
    });

    if (filterBy === 'number'){
        list = list.filter(x=>{
            var newNum = x.number.replace(/-/g, '') 
            if (filterBy === 'number'){
                return newNum.indexOf(search) > -1 
            }
        })
    } else {
        list = search.length > 0 ? filterByName(list) : list
    }

    list.forEach(x=>{
        src = './assets/profile/' + x.img
        $('.contacts')[0].innerHTML += `
            <div class="card">
                <div class="card-body">
                    <div>
                        <img src=${src} class="prof"/> <p>${x.name}</p>
                    </div>
                    <span>${x.number}</span>
                </div>
            </div>
            `
    })

    if (!list.length){
        $('.contacts')[0].innerHTML += `
            <div class="card">
                <div class="card-body" style="justify-content: center;">
                    No Results
                </div>
            </div>
            `
    }
}

const onDelete = () =>{
    search = search.slice(0, -1)
    $('.number')[0].children[0].innerHTML = search
    renderContacts()
}