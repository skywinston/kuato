angular.module('kuato')
    .constant('STATE', {
        'DECK_INDEX': 'DECK_INDEX',
        'NEW_CARD': 'NEW_CARD',
        'CANCEL_CARD': 'CANCEL_CARD',
        'CARD_INDEX': 'CARD_INDEX',
        'STUDYING_QUESTION': 'STUDYING_QUESTION',
        'STUDYING_ANSWER': 'STUDYING_ANSWER'
    })
    .constant('TRANSITION', {
        // Initial loading of Deck Index
        'LOAD_DECK_INDEX': 'LOAD_DECK_INDEX',

        // Move from deck index to card index for selected deck & move back to deck index from card index
        'DECK_INDEX->CARD_INDEX': 'DECK_INDEX->CARD_INDEX',
        'CARD_INDEX->DECK_INDEX': 'CARD_INDEX->DECK_INDEX',

        // Create/cancel new card from the deck index view
        'DECK_INDEX->NEW_CARD': 'DECK_INDEX->NEW_CARD',
        'CANCEL_NEW_CARD->DECK_INDEX': 'CANCEL_NEW_CARD->DECK_INDEX',
        'CREATE_NEW_CARD->DECK_INDEX': 'CREATE_NEW_CARD->DECK_INDEX',

        // Create/cancel new card from the card index view
        'CARD_INDEX->NEW_CARD': 'CARD_INDEX->NEW_CARD',
        'CANCEL_NEW_CARD->CARD_INDEX': 'CANCEL_NEW_CARD->CARD_INDEX',
        'CREATE_NEW_CARD->CARD_INDEX': 'CREATE_NEW_CARD->CARD_INDEX',

        // Edit existing cards
        'CARD_INDEX->EDIT_CARD': 'CARD_INDEX->EDIT_CARD',
        'EDIT_CARD->CARD_INDEX': 'EDIT_CARD->CARD_INDEX',

        // Begin Studying from the deck index or the card index
        'DECK_INDEX->STUDYING': 'DECK_INDEX->STUDYING',
        'CARD_INDEX->STUDYING': 'CARD_INDEX->STUDYING',

        // During Study
        'STUDY->EDIT_CARD': 'STUDY->EDIT_CARD',
        'EDIT_CARD->STUDY': 'EDIT_CARD->STUDY',
        'RATE_CARD_1': 'RATE_CARD_1',
        'RATE_CARD_2': 'RATE_CARD_2',
        'RATE_CARD_3': 'RATE_CARD_3',
        'NEXT_CARD': 'NEXT_CARD',

        // End studying from deck index or card index
        'STUDYING->DECK_INDEX': 'STUDYING->DECK_INDEX',
        'STUDYING->CARD_INDEX': 'STUDYING->CARD_INDEX'
    })
    .factory('GlobalState', ["STATE", "TRANSITION", function(STATE, TRANSITION){
        return {
            state: STATE['DECK_INDEX'],
            prevState: null,
            transition: TRANSITION['LOAD_DECK_INDEX'],
            getState: getState,
            getPrevState: getPrevState,
            setState: setState,
            getTransition: getTransition,
            setTransition: setTransition
        };

        function getState () {
            return this.state;
        }

        function getPrevState() {
            return this.prevState;
        }

        function setState (state) {
            this.prevState = this.state;
            this.state = state;
        }

        function getTransition () {
            return this.transition;
        }

        function setTransition (transition) {
            this.transition = transition;
        }
    }]);