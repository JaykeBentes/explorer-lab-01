import "./css/index.css"
import IMask from "imask"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type) {
    const colors = {
        "visa": ["#236D99", "#2D57F2"],
        "mastercard": ["#DF6F29", "#C64747"],
        "default": ["black", "gray"],
        "elo": ["#FFCB05", "#FFE927"],
        "american-express": ["#27FF8A", "#A5F54D"]
    }  

    ccBgColor01.setAttribute("fill", colors[type][0])
    ccBgColor02.setAttribute("fill", colors[type][1])
    ccLogo.setAttribute("src", `cc-${type}.svg`)
}
globalThis.setCardType = setCardType


//security code
const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
    mask: "0000",
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

securityCodeMasked.on("accept", () => {
    updateSecurityCode(securityCodeMasked.value);
})
function updateSecurityCode(code) {
    const ccSecurity = document.querySelector(".cc-security .value")
    ccSecurity.innerText = code.length === 0 ? "123" : code
}


//card date
const expirationDate = document.querySelector("#expiration-date")
const expirationDatePattern = {
    mask: "MM{/}YY",
    blocks: {
        MM: {
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
        },
        YY: {
            mask: IMask.MaskedRange,
            from: String(new Date().getFullYear()).slice(2),
            to: String(new Date().getFullYear() + 10).slice(2),
        },
    }
}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

expirationDateMasked.on("accept", () => {
    updateDate(expirationDateMasked.value);
})
function updateDate(date) {
    const ccDate = document.querySelector(".cc-extra .value")
    ccDate.innerText = date.length ===0 ? "02/32" : date
}


//card number
const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
    mask: [
        {
            mask: "0000 0000 0000 0000",
            regex: /^4\d{0,15}/,
            cardType: "visa",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
            cardType: "mastercard",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^3[47]\d{0,13}/,
            cardType: "american-express",
        },
        {
            mask: "0000 0000 0000 0000",
            regex: /^((((636368)|(438935)|(504175)|(451416)|(636297))\d{0,10})|((5067)|(4576)|(4011))\d{0,12})$/,
            cardType: "elo",
        },
        {
            mask: "0000 0000 0000 0000",
            cardType: "default",
        },
    ],
    dispatch: function (appended, dynamicMasked) {
        const number = (dynamicMasked.value + appended).replace(/\D/g, "")
        const foundMask = dynamicMasked.compiledMasks.find(function(item) {
            return number.match(item.regex)
        })

        console.log(foundMask)

        return foundMask
    },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

cardNumberMasked.on("accept", () => {
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setCardType(cardType)
    updateCardNumber(cardNumberMasked.value);
})
function updateCardNumber(number) {
    const ccCardNumber = document.querySelector(".cc-number")

    ccCardNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}


//card name
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
    const ccHolder = document.querySelector(".cc-holder .value")

    ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value
})


//button
const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {
    alert("Cartão adicionado!")
})
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault()
})

