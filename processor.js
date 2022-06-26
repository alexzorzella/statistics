let cards = [];

let input = [];
let inputReq = [];
let cardsSearched = 0;
const handSize = 7;

let deckSize = 0;

let validDeckSize = false;
let validSearchSize = false;

let quotes = ["It's not shuffle cheating, it's a statistical inclination.",
    "Back to examine your odds?",
    "Don't worry, just buy another copy. What do you mean it's $240?",
    "No, getting a card in foil does not increase your chances of drawing it.",
    "You know, mulliganing once isn't that bad.",
    "I'm here to make your life easier.",
    "You know that your odds don't stack, right?"];

function append(text) {
        // Create element:
        const para = document.createElement("div");
        para.innerText = text;
        para.className = "foo";
      
        // Append to body:
        //document.body.appendChild(para);
        document.getElementById("parent").appendChild(para);
}      

function setQuote() {
    let quoteIndex = Math.floor(Math.random() * quotes.length);
    let quote = quotes[quoteIndex];
    //document.getElementById('quote').textContent = '"' + quote + '" <br/><br/> bar <br/> baz';

    document.getElementById('quote').textContent = '"' + quote + '"';

    // append("Foo");
    // append("Boo");
    // append("Foo");
}

function addCard() {
    // if(!parseInt(document.getElementById('total_cards_in_deck')) || !parseInt(document.getElementById('ideal_cards_in_hand')))
    // {
    //     alert("Numerical inputs only.")
    //     return;
    // }
    
    let add = document.getElementById('total_cards_in_deck').value;
    
    if(add <= 0)
    {
        return;
    }
    
    input.push(add);
    deckSize += parseInt(add);

    let ideal = document.getElementById('ideal_cards_in_hand').value;

    if(ideal < 0)
    {
        return;
    }

    inputReq.push(ideal);

    cardsSearched += parseInt(ideal);

    validDeckSize = deckSize >= 7;
    validSearchSize = cardsSearched <= 7 && cardsSearched > 0;

    document.getElementById('total_cards_in_deck').value = '';
    document.getElementById('ideal_cards_in_hand').value = '';

    let deckFormat = '';
    let searchValidity = '';

    if(deckSize >= 40)
    {
       if(deckSize < 60)
       {
            deckFormat = "Looks like you're playing Limited.";      
       } else if(deckSize < 100)
       {
            deckFormat = "Looks like you're playing a standard format.";
       } else
       {
            deckFormat = "Looks like you're playing Commander."
       }
    } else
    {
        deckFormat = "Is this a real deck?";
    }

    searchValidity = validSearchSize ? 
    "Your search parameters are valid." 
    : "Make sure you're searching for more than 0 cards and fewer than 8 cards.";

    document.getElementById('card_searched_display').textContent = 'Cards searched: ' + cardsSearched + '/' + deckSize;
    document.getElementById('deck_valid_display').textContent 
    = (validDeckSize ? 'Your deck is valid.' : 'Your deck is invalid.') + ' ' + deckFormat;
    document.getElementById('valid_search_display').textContent = searchValidity;
}

function calculatePercentages() {
    //document.getElementById('bar').textContent = 'bar '+ input + ' length:' + input.length;
    
    for (let i = 0; i < input.length; i++) {
        for (let c = 0; c < input[i]; c++) {
            cards.push(i);
        }
    }

    //alert(cards.length);

    let results = [];
    const hands = 10000;

    for (let i = 0; i < hands; i++) {
        //alert('simulations: ' + i);
        //if (i % 1 == 0) {
        //    document.getElementById('bar').textContent = i + ' simulations run.';
        //}

        let result = simulateAndReturnMulligans((i / hands) * 100);

        if(result == -2)
        {
            return;
        }
        
        //alert(result);

        results.push(result);
    }

    let faliures = results.filter(d => d == -1).length;

    let favorable = [];

    for (let i = 0; i <= handSize - cardsSearched; i++) {
        let filtered = parseFloat(results.filter(d => d == i).length);
        //document.getElementById('debug').textContent += (", filtered: " + filtered);
        favorable.push(filtered / results.length);
    }

    let favorableDebug = '';

    let finalInfoDisplay = 'Opener successful ' + parseFloat(((results.length - faliures) / results.length) * 100).toFixed(2) +
        '% of ' + hands + ' simulated hands. (' + faliures + ' faliures) ' + favorableDebug;

        for (let i = 0; i < 7 - cardsSearched; i++) {
        // favorableDebug += ' ' + favorable[i] * 100 + '% of games begun with ' + i + ' mulligan(s).';
        append(' ' + parseFloat(favorable[i] * 100, 2).toFixed(2) + '% of games begun with ' + i + ' mulligan(s)');
    }

    document.getElementById('display').textContent = finalInfoDisplay;
}

function simulateAndReturnMulligans() {
    let mulligans = -1;
    let success = false;
    let terminate = false;

    let results = [];


    //alert(cards.length);

    if (deckSize < handSize) {
        alert("Your deck must contain at least " + handSize + " cards.");
        return -2;
    }

    while (!success && !terminate) {
        mulligans++;

        if(mulligans > handSize - cardsSearched)
        {
            terminate = true;
            mulligans = -1;
        }

        results = [];

        let selectedCards = [];

        for (let i = 0; i < handSize; i++) {
            let card = Math.floor(Math.random() * cards.length);

            while(selectedCards.includes(card))
            {
                card = Math.floor(Math.random() * cards.length);
            }

            selectedCards.push(card);
        }

        //alert(selectedCards + ' (' + mulligans + ' mulligan(s))');

        for(let i = 0; i < selectedCards.length; i++)
        {
            results.push(cards[parseInt(selectedCards[i])]);
        }

        success = true;

        for(let i = 0; i < input.length; i++)
        {
            let processed = results.filter(d => d == i);

            let idealCount = parseInt(inputReq[i]);

            if(processed.length < idealCount)
            {
                success = false;
                break;
            }
        }
    }

    return mulligans;
}