document.addEventListener('DOMContentLoaded', () =>{
    let elements = {
        Game: document.querySelector('.game'),
        Desk: document.querySelector('.desk'),
        wallContainer: document.querySelector('.walls'),
        Ball: document.querySelector('.ball'),
        topWall: document.querySelector('.top-wall'),
        bottomWall: document.querySelector('.bottom-wall'),
        rightWall: document.querySelector('.right-wall'),
        leftWall: document.querySelector('.left-wall'),
        scoreElem: document.querySelector('.score'),
        overElem: document.querySelector('.over'),
        winElem: document.querySelector('.win'),
        Walls: []
    }
    let styleRoot = document.querySelector(':root')
    let gameWidth = elements.Game.getBoundingClientRect().width
    let gameHeight = elements.Game.getBoundingClientRect().height
    let wallLength = 40
    let Score = 0
    let enableUpdate = true
    let ballPhysics = {
        x: getStyleProperty('--ballLeft'),
        y: getStyleProperty('--ballTop'),
        w: elements.Ball.getBoundingClientRect().width,
        h: elements.Ball.getBoundingClientRect().height,
        vx: 3,
        vy: 3,
        speed: 1.5
    }

    defData()
    requestAnimationFrame(update) 

    function update(){
        if (!enableUpdate){
            return
        }
        checkGameOver()
        ballCatchDesk()
        requestAnimationFrame(update)
    }

    function defData() {
        mouseMove()
        createWall()
        console.log(elements.Walls)
    }

    function ballCatchDesk(){
        elements.Walls.forEach((item) =>{
            if (collision(elements.Ball.getBoundingClientRect(), item.getBoundingClientRect())){
                crashWall(parseInt(item.getAttribute('data')))
            }
        }
        )
        if(collision(elements.Desk.getBoundingClientRect(), elements.Ball.getBoundingClientRect())) {
            let random = randomNumber(2)
            if (random === 1){
                ballPhysics.vx *= 1
                ballPhysics.vy *= -1
            } else {
                ballPhysics.vx *= -1
                ballPhysics.vy *= -1
            }  
        } else if (collision(elements.rightWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
            ballPhysics.vx *= -1
            ballPhysics.vy *= 1  
        } else if (collision(elements.leftWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
            ballPhysics.vx *= -1
            ballPhysics.vy *= 1 
        } else if (collision(elements.topWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
            ballPhysics.vx *= 1
            ballPhysics.vy *= -1 
        } else if (collision(elements.bottomWall.getBoundingClientRect(), elements.Ball.getBoundingClientRect())){
           console.log('lose') 
        }

        setStyleProperty('--ballLeft', `${ballPhysics.x += ballPhysics.vx}px`)
        setStyleProperty('--ballTop', `${ballPhysics.y += ballPhysics.vy}px`)
    }

    function crashWall(id){
        elements.Walls.forEach((item) => {
            if (parseInt(item.getAttribute('data')) === id){
                if(item.classList.contains('disable')) {
                    return
                }
                item.classList.add('disable')
                if (Score % 5 == 0) {
                    ballPhysics.speed = ballPhysics.speed + 1
                    ballPhysics.vx = ballPhysics.speed
                    ballPhysics.vy = ballPhysics.speed
                }
                ballPhysics.vx *= 1
                ballPhysics.vy *= -1
                Score += 1
                elements.scoreElem.textContent = `Score ${Score} El Jefe!`
                if (Score === wallLength){
                    gameWin()
                }
            }
        })
    }

    function mouseMove() {
        elements.Game.addEventListener('mousemove', (e) => {
            if(!enableUpdate) {
                return
            }
            setStyleProperty('--deskLeft', `${e.offsetX}px`)
        })
    }
    function setStyleProperty(variable, value){
        styleRoot.style.setProperty(variable, value)
    }
    function getStyleProperty(variable){
        return parseFloat(getComputedStyle(styleRoot).getPropertyValue(variable))
    }
    function createWall(){
        for (i = 0; i < wallLength; i += 1){
            let elem = document.createElement('div')
            elem.classList.add('wall')
            elem.setAttribute('data', i)
            elements.Walls.push(elem)
            elements.wallContainer.appendChild(elem)
        }
    }

    function checkGameOver(){
        if(collision(elements.Ball.getBoundingClientRect(), elements.bottomWall.getBoundingClientRect())){
            gameOver()
        }
    }

    function gameOver(){
        enableUpdate = false
        elements.overElem.style.display = 'block';
    }

    function gameWin(){
        enableUpdate = false
        elements.winElem.textContent = "Ganador Jefe!"
        elements.winElem.style.display = 'block';
    }

    function collision(rect1, rect2){
        if(
            rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y){
                return true
            } else {
                return false
            }
    }
    function randomNumber(max){
        return Math.floor(Math.random() * max)
    }
})