// ==UserScript==
// @name         Grundo's Cafe Book Helper
// @namespace    github.com/windupbird144/
// @version      0.2
// @description  Show unread books on your pet's book page
// @author       You
// @match        https://www.grundos.cafe/books_read/?pet_name=*
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// ==/UserScript==

const booksUrl = `https://gist.githubusercontent.com/windupbird144/7eb8f24ae3c64feb095edf8935305458/raw/books.json`

/**
 * Analyse the document to find out which books your pet has read
 * 
 * @returns string[] title of book your pets has read
 */
const getReadBooks = () => 
    Array.from(document.querySelectorAll("#center > table > tbody > tr:nth-of-type(n+2)")).map(e => e.childNodes[3].childNodes[0].textContent.trim().replace(" (",""))

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
    return listOfBooks.filter(([name,_]) => !booksRead.includes(name))
}


// callback to sort books by rarity by rarity
const byRarity = ([_,rarity1],[__,rarity2]) => rarity1 - rarity2

const html = (books) => `<div class="books-to-read" style="padding-left: 2em;">
<h3 style="text-align: center">Your pet has ${books.length} books left read!</h3>
<ul style="columns: 2">
${
    books.sort(byRarity).map(([name, rarity]) => `<li><span style="user-select:all">${name}</span> (<b>r${rarity})</b></li>`).join("")
}
</ul>
</div>`;

async function main() {
    const listOfBooks = await fetch(booksUrl).then(res => res.json())
    const toRead = filterReadBooks(listOfBooks, getReadBooks())
    document.querySelector(".content").insertAdjacentHTML("afterend", html(toRead))
}

main().then()