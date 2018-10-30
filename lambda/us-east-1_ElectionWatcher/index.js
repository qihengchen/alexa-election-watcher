/*
By Qiheng Chen. 2018.
*/

const alexa = require('ask-sdk-core');
const format = require('string-format');
const data = require('./senate'); //read from ./data.json

// ========== Constants ========== //
const WELCOME_MESSAGE = 'Check house and senate election polls.';
const FALLBACK_MESSAGE = 'I\'m getting smarter everyday. Say help to see what I have learned!';
const ERR_MESSAGE = 'Sorry didn\'t understand what you said. Let\'s try again.';
const HELP_MESSAGE = 'I read data from fivethirtyeight.com. Ask me to check live polls for your state.';

// ========== Handlers, Custom Intents ========== //
const PollingIntentHandler = {
	    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && (request.intent.name === 'PollingIntent' || request.dialogState === 'COMPLETED');
    },

    handle(handlerInput) {
    	const request = handlerInput.requestEnvelope.request;
    	if (request.dialogState != 'COMPLETED') {
            return handlerInput.responseBuilder
            .addDelegateDirective(request.intent)
            .getResponse();
        }
        
        //const slotValues = getSlotValues(handlerInput.requestEnvelope.request.intent.slots);
        let state = request.intent.slots.state.value; //.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        console.log('State: ' + JSON.stringify(state));

        if (Object.keys(allStates).includes(state)) { //.toLowerCase())) {
            let speech = prepareSpeech(allStates[state]);
        	return handlerInput.responseBuilder.speak(speech).getResponse();

        } else {
			return handlerInput.responseBuilder.speak("Did not find the state you requested. But the democrats is winning nationwide. ").getResponse();
        }
        
    },
};

// ========== Helper Functions ========== //
function prepareSpeech(state) {
    let speech = format('In {}, ', state);

    if (!data[state]) {return 'I did not find the state. ';}
    if (data[state].senate) {
        (function() {
            let election = data[state].senate;
            if (election.D.candidate && election.R.candidate) {
                if (election.D.voteShare > election.R.voteShare) {
                    speech += format('Democrat {} is leading Republican {} in the senate race, with vote shares {} to {}. ', election.D.candidate,
                            election.R.candidate, election.D.voteShare, election.R.voteShare);
                } else {
                    speech += format('Republican {} is leading Democrat {} in the senate race, with vote shares {} to {}. ', election.R.candidate,
                            election.D.candidate, election.R.voteShare, election.D.voteShare);
                }
            } else if (election.D.candidate) {
                speech += format('Democrat {} is leading in the senate race with {} vote share without Republican rival. ', election.D.candidate, election.D.voteShare);
            } else if (election.R.candidate) {
                speech += format('Republican {} is leading in the senate race with {} voate share without Democrat rival. ', election.R.candidate, election.R.voteShare);
            } else {
                speech += format('No candidate from the two major parties is in the senate race. ');
            }
        }) ();
    } else {
        speech += 'No senate election found. ';
    }

    /*
    if (data[state].house) {
        (function() {
            let houseElections = data[state].house;
            speech += format('For house elections. ');
            Object.keys(houseElections).forEach(function(key) {
                speech += format('In district {}, ', key);
                let election = houseElections[key];
                if (election.D && election.R) {
                    if (election.D.voteShare > election.R.voteShare) {
                        speech += format('Democrat {} is leading Republican {}, with vote shares {} to {}. ', election.D.candidate,
                                election.R.candidate, election.D.voteShare, election.R.voteShare);
                    } else {
                        speech += format('Republican {} is leading Democrat {}, with vote shares {} to {}. ', election.R.candidate,
                                election.D.candidate, election.R.voteShare, election.D.voteShare);
                    }
                } else if (election.D) {
                    speech += format('Democrat {} is leading without Republican rival. ', election.D.candidate);
                } else if (election.R) {
                    speech += format('Republican {} is leading without Democrat rival. ', election.R.candidate);
                } else {
                    speech += format('No candidate from the two major parties is in. ');
                }
            });
        })();
    } else {
        speech += "No house election found. ";
    }*/

    return speech;
}

// ========== Hard-Coded Data ========== //
const allStates = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'American Samoa': 'AS',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'District Of Columbia': 'DC',
    'Federated States Of Micronesia': 'FM',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Guam': 'GU',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Marshall Islands': 'MH',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Northern Mariana Islands': 'MP',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Palau': 'PW',
    'Pennsylvania': 'PA',
    'Puerto Rico': 'PR',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virgin Islands': 'VI',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
};


// ========== Handlers, Built-in Intents ========== //
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
		return handlerInput.responseBuilder
        	.speak(WELCOME_MESSAGE)
        	.getResponse();
    },
};

const ErrorHandler = {
    canHandle() {
        return true;  
    },
    handle(handlerInput, error) {
        console.log('Error handled: ' + error.message);
        return handlerInput.responseBuilder
            .speak(ERR_MESSAGE)
            .getResponse();
    },
};

const HelpHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;

        return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(HELP_MESSAGE)
        .getResponse();
    },
};

const FallbackHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const attributes = handlerInput.attributesManager.getSessionAttributes();
        attributes.isAskingForAnythingElse = true;
        handlerInput.attributesManager.setSessionAttributes(attributes);
        return handlerInput.responseBuilder
            .speak(FALLBACK_MESSAGE)
            .reprompt('anything else?')
            .getResponse();
    },
};

const ExitHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest'
            && (request.intent.name === 'AMAZON.CancelIntent'
            || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
        .speak('Great talking to you.')
        .getResponse();
    },
};

// ========== Lambda Handler ========== //
const skillBuilder = alexa.SkillBuilders.custom();

exports.handler = skillBuilder.addRequestHandlers(
    PollingIntentHandler,
    LaunchRequestHandler,
    HelpHandler,
    FallbackHandler,
    ExitHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
