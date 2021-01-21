var search = '';
var filterBy = 'name';
var buttons = [];
var isTyping = false;
var timeout, letter;
var contacts = [];
var nameCheck = null;

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

    if (filterBy === "number"){
        if (className === 'customCol'){
            val = e.target.children[0].children[0].innerText 
        } else if (tagName === 'DIV'){
            val = e.target.children[0].innerText
        } else if (tagName === 'H3') {
            val = e.target.innerText
        } else if (tagName === 'P'){
            val = e.target.previousElementSibling.innerText
        } 
    } else {
        if (className === 'customCol'){
            val = e.target.children[0].children[1].innerText 
        } else if (tagName === 'DIV'){
            val = e.target.children[1].innerText
        } else if (tagName === 'H3') {
            val = e.target.nextElementSibling.innerText
        } else if (tagName === 'P'){
            val = e.target.innerText
        }
    }
    return val
}

const onChange = (e) => {
    if (e.target.tagName !== 'IMG' || e.target.children[0].tagName !== 'IMG'){
        var val = checkWhichEl(e)
        search += val
        $('.number')[0].children[0].innerHTML = search
        renderContacts()
    }
}

const renderContacts = () => {
    $('#delete')[0].style.visibility = search.length > 0 ? 'visible' : 'hidden'
    $('.contacts')[0].innerHTML = ''

    var list;

    if (filterBy === 'number'){
        list = contacts.sort((a, b)=>{
            return a.name < b.name ? -1 : 1
        }).filter(x=>{
            var newNum = x.number.replace(/-/g, '') 
            if (filterBy === 'number'){
                return newNum.indexOf(search) > -1 
            }
        })
    } else {
        list = contacts
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