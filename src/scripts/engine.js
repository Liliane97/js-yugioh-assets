const state = {
    score:{
        playerScore:0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points")

    },
    cardSprites:{
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type")
    },
    fieldCards:{
        player:document.getElementById("player-field-card"),
        computer:document.getElementById("computer-field-card")
    },
    playersSides : {
        player1: "player-cards",
        player1Box :document.querySelector("#player-cards") ,
        computer:"computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions:{
        button:document.getElementById("next-duel")
    }
}
const path = "./src/assets/icons/"
// enum
const cardData = [
    {
        id:0,
        name:"Blue Eyes White Dragon",
        type:"Paper",
        img:`${path}dragon.png`,
        winOf:[1],
        loseOf:[2]
    },
    {
        id:1,
        name:"Dark Magician",
        type:"Rock",
        img:`${path}magician.png`,
        winOf:[2],
        loseOf:[0]
    },
    {
        id:2,
        name:"Exodia",
        type:"Scissors",
        img:`${path}exodia.png`,
        winOf:[0],
        loseOf:[1]
    }
]

async function getRandomCardId(){
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(idCard,fieldSide){
    const cardImage = document.createElement("img")
    cardImage.setAttribute("height","100px");
    cardImage.setAttribute("src","./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id",idCard)
    cardImage.classList.add("card")

    if(fieldSide === state.playersSides.player1){
        cardImage.addEventListener("mouseover",()=>{
            drawerSelectCard(idCard)
        });
        cardImage.addEventListener("click",()=>{
            setCardsField(cardImage.getAttribute("data-id"));
        })
    }


    return cardImage
}

async function setCardsField(cardId){
    await removeAllCardsImages();
    let computerCardId = await getRandomCardId()
    
    await drawCardsInField(cardId,computerCardId)

    let duelResults = await checkDuelResults(cardId,computerCardId);

    await showHiddenCardFieldsImages(true)
    await hiddencardDetails()
    await updateScore();
    await drawButton(duelResults);
}
async function drawCardsInField(cardId,computerCardId){
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

}
async function showHiddenCardFieldsImages(value){
    if(value === true){
        state.fieldCards.player.style.display="block";
    state.fieldCards.computer.style.display="block";
    }
    if(value === false){
        state.fieldCards.player.style.display="none";
    state.fieldCards.computer.style.display="none";
    }
}
async function hiddencardDetails(){

    state.cardSprites.avatar.src = ""
    state.cardSprites.name.innerText = ""
    state.cardSprites.type.innerText = ""
}

async function drawButton(text){
    state.actions.button.innerText = text
    state.actions.button.style.display = "block"
}

async function updateScore(){
    state.score.scoreBox.innerText = `Win:${state.score.playerScore} | Lose:${state.score.computerScore}`
}
async function checkDuelResults(playerCardId,computerCardId){
    let duelResults = "Draw"
    
    let playerCard = cardData[playerCardId]
    if(playerCard.winOf.includes(computerCardId)){
        duelResults= "Win"
        await playAudio(duelResults)
        state.score.playerScore++
    }
    if(playerCard.loseOf.includes(computerCardId)){
        duelResults="Lose"
        await playAudio(duelResults)

        state.score.computerScore++
    }
 
    await playAudio(duelResults)
     return duelResults
}

async function removeAllCardsImages(){
    let {computerBox,player1Box} = state.playersSides;
    let imgElements = computerBox.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())

    imgElements = player1Box.querySelectorAll("img")
    imgElements.forEach((img) => img.remove())
    
}
async function drawerSelectCard(index){
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attrubute" + cardData[index].type;


}


async function drawCards(cardNumbers,fieldSide){
    for(let i = 0; i <  cardNumbers; i++) {
        const randomIdCard = await getRandomCardId()
        const cardImage = await createCardImage(randomIdCard,fieldSide)
        document.getElementById(fieldSide).appendChild(cardImage)
    }
}
async function resetDuel(){
    state.cardSprites.avatar.rsc =" "
   
    state.actions.button.style.display="none"

    state.fieldCards.player.style.display="none"
    state.fieldCards.computer.style.display="none"
    init()


}

async function playAudio(status){
const audio = new Audio(`./src/assets/audios/${status}.wav`)
    audio.play()
    audio.volume = 0.3

}
function init(){
     showHiddenCardFieldsImages(false)


    drawCards(5,state.playersSides.player1)
    drawCards(5,state.playersSides.computer)
    const bgm = document.getElementById("bgm")
    bgm.play()
    bgm.volume = 0.05
}

init()