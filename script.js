// TERMINOLOGY
// Position - index in the board

function Player(symbol){
    if(!new.target) throw Error("Must be called with new operator!");
    this.symbol = symbol;
}

const eventBroadcaster = (
    function(){
        const events = {};

        function subscribe(type, ...handlers){
            if(!events[type]){
                console.log(`${type} Event doesn't exist!`);
                createEvent(type);
            }
            
            events[type].push(...handlers);
        }

        function unsubscribe(type, handler){
            let handlers = events[type];

            if(!handlers){
                console.log(`Cannot unsubscribe. ${type} Event doesn't exist!`);
                return;
            }

            if(handler){
                let index = handlers.findIndex( item  => item === handler);
                if(index !== -1) handlers.splice(index, 1);
            }
        }

        function createEvent(type){
            if(events[type]){
                console.log(`${type} Event already exists!`);
                return;
            }
            
            events[type] = [];
            console.log(`${type} Event created!`);
        }
        
        function deleteEvent(type){
            delete events[type];
            console.log(`${type} Event deleted!`);
        }
        
        function raiseEvent(type, data){
            let handlers = events[type];
            
            if(!handlers){
                console.log(`${type} Event already exists!`);
                createEvent(type);
                handlers = events[type];
            }
            
            for(let handler of handlers){
                handler(data);
            }
            
            console.log(`${type} Event raised!`);
        }

        function reset(){
            events = {};
        }

        return{
            createEvent,
            deleteEvent,
            raiseEvent,
            subscribe,
            unsubscribe,
            reset
        }
    }
)();



const screenController = (function(doc){
    const gameoverModal = doc.querySelector('#gameover-panel');
    const gameoverText = gameoverModal.querySelector('#gameover-message')
    const closeModalBtn = gameoverModal.querySelector('#gameover-panel-close');

    const turnLabel = doc.querySelector('#turn-label');

    const boardUI = doc.querySelector("#board");
    const cells = [...boardUI.querySelectorAll(".cell")];
    
    if(cells){
        cells.forEach( (cell, index) => {
            cell.dataset.id = index
            cell.dataset.symbol = "_";
        });
    }
    
    
    eventBroadcaster.subscribe("GameOver", handleGameOver);
    eventBroadcaster.subscribe("UpdateBoard", handleBoardUpdate);
    eventBroadcaster.subscribe("GameWin", handleGameWin);
    eventBroadcaster.subscribe("PlayerChange", handlePlayerChange);

    // Event Handling
    boardUI.addEventListener('click', event => eventBroadcaster.raiseEvent("PlayerInput", Number(event.target.dataset.id)));


    closeModalBtn.addEventListener('click', () => {
        for(let cell of cells){
            cell.dataset.symbol = "_";
            delete cell.dataset.highlight;
        }
        
        eventBroadcaster.raiseEvent("RestartGame");

        gameoverModal.close();
    })

    function handlePlayerChange(player){
        if(turnLabel) turnLabel.textContent = `${player.symbol}'s turn`;
    }

    function handleGameWin(pattern){
        for(let i of pattern){
            cells[i].dataset.highlight = '';
        }
    }

    function handleGameOver(message){
        if(gameoverText) gameoverText.textContent = message;
        gameoverModal.showModal();
    }

    function handleBoardUpdate(boardElements){
        let length = Math.min(cells.length, boardElements.length);
        for(let i = 0; i < length; i++){
            cells[i].dataset.symbol = boardElements[i] ?? "_";
        }
    }
})(document);


const board = (
    function(){
        const size = 9;
        let board;
        let availablePositions;
        
        function resetBoard(){
            board = [];
            availablePositions = [];
            for(let i = 0; i< size; i++){
                availablePositions.push(i);
            }
        };


        function updateBoardPosition(position, symbol){
            const index = availablePositions.findIndex(el => (el === position));

            if(index === -1) return false;

            board[position] = symbol;
            availablePositions.splice(index, 1);

            eventBroadcaster.raiseEvent("UpdateBoard", [...board]);

            return true;
        };

        function logBoard(){
            let str = "";
            for(let i = 0; i < size; i++){
                if(i % 3 === 0) str += "\n";
                str += board[i] ?? '_';
            }

            console.log(str);
        }

        function getSymbolAt(position){
            if(position >= size) return;

            return board[position];
        }

        return {
            getEmptyCellsCount: () => availablePositions.length,
            resetBoard,
            updateBoardPosition,
            logBoard,
            getSymbolAt
        }
    }
)();

const gameController = (
    function(board){
        const players = [new Player("X"), new Player("O")];
        let currentPlayerIndex = 0;

        initializeController();
        
        const winPositions = [
            [0, 1, 2], // row 0
            [3, 4, 5], // row 1
            [6, 7, 8], // row 2
            [0, 3, 6], // column 0
            [1, 4, 7], // column 1
            [2, 5, 8], // column 2
            [0, 4, 8], // diagonal l-r
            [2, 4, 6]  // diagonal r-l
        ];
        
        
        eventBroadcaster.subscribe("PlayerInput", playRound);
        eventBroadcaster.subscribe("RestartGame", initializeController);
        
        function initializeController(){
            board.resetBoard();
            
            // let randomPlayer = Math.floor(Math.random() * players.length);

            switchPlayer(0);
        }

        function switchPlayer(index){
            currentPlayerIndex = index % players.length;
            eventBroadcaster.raiseEvent("PlayerChange", players[currentPlayerIndex])
        }

        function playRound(position){
            if( !Number.isInteger(position)) return false;
            
            const symbol = players[currentPlayerIndex].symbol;

            if(!!board && board.updateBoardPosition(position, symbol)){
                concludeRound(symbol);
            }
        };

        function concludeRound(symbol) {
            const winPatten =  (winPositions.find(pattern => !pattern.some(pos => board.getSymbolAt(pos) !== symbol)));
            if(winPatten){
                eventBroadcaster.raiseEvent("GameWin", winPatten);
                eventBroadcaster.raiseEvent("GameOver", `The winner is ${symbol}`);
            }
            else if(board.getEmptyCellsCount() === 0){
                eventBroadcaster.raiseEvent("GameOver", "The game ended in a tie.")
            }else{
                switchPlayer(currentPlayerIndex + 1);
            }
        };
    }
)(board);

