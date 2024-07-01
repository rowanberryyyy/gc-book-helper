// ==UserScript==
// @name         Grundo's Cafe Book Helper
// @namespace    github.com/windupbird144/
// @version      0.4
// @description  Show unread books on your pet's book page
// @author       You
// @match        https://www.grundos.cafe/books_read/?pet_name=*
// @match        https://grundos.cafe/books_read/?pet_name=*
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// ==/UserScript==

const booksUrl = `https://raw.githubusercontent.com/rowanberryyyy/gc-book-helper/main/books.json`

/**
 * Analyse the document to find out which books your pet has read
 * 
 * @returns string[] title of book your pets has read
 */
const getReadBooks = () => 
    Array.from(document.querySelectorAll(".center > table > tbody > tr:nth-of-type(n+2)")).map(e => e.childNodes[3].childNodes[0].textContent.trim().replace(" (","").toUpperCase())

/**
 * Return a list of books your pet has not read
 * TODO: Use a more efficient algorithm
 * 
 * @param {[string, number][]} listOfBooks 
 * @param {string[]} booksRead
 * 
 * @returns {[string, number][]} the books your pet has not read 
 */
const filterReadBooks = (listOfBooks, booksRead) => {
    return listOfBooks.filter(([name,_]) => !booksRead.includes(name.toUpperCase()))
}


// callback to sort books by rarity by rarity
const byRarity = ([_,rarity1],[__,rarity2]) => rarity1 - rarity2

// One liner function:
const addCSS = css => document.head.appendChild(document.createElement("style")).innerHTML=css;

// Usage:
addCSS(".booklist { height: 80px; overflow: auto;} .booklist:hover { height: 500px; overflow: none;")

const html = (books) => `<div class="books-to-read" style="line-height: 20px; padding-left: 2em;">
<h3 style="text-align: center">Your pet has ${books.length} books left to read!</h3>
<h4 style="text-align: center">(hover to expand)</h3>
<div class="booklist"><ul style="columns: 2">
${
    books.sort(byRarity).map(([name, rarity]) => `<li><span style="user-select:all">${name}</span> (<b>r${rarity})</b>
    <a href="/market/wizard/?query=${name}" target="_bookSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/wiz.png"></a>
    <a href="/island/tradingpost/browse/?query=${name}" target="_bookSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/tp.png"></a>
    <a href="/safetydeposit/?page=1&category=&type=&query=${name}" target="_bookSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/sdb.gif"></a>
    </li>`).join("")
}
</ul></div>
</div>`;

//Ty Riz for the SW/TP add-on!

async function main() {
    const listOfBooks = await fetch(booksUrl).then(res => res.json())
    const toRead = filterReadBooks(listOfBooks, getReadBooks())
    document.querySelector(".content").insertAdjacentHTML("beforebegin", html(toRead))
}

main().then()
