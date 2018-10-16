const twit        = require('twit');
const deckStrings = require('deckStrings');
const config      = require('./config.js');
const cards       = require('./cards').getCards();
// const players     = JSON.parse(require('./players.json'));
const Twitter = new twit(config);
const scanParams = {q: "from:F2K_Control", tweet_mode: 'extended'};

const FORMATS = ['Wild', 'Standard'];
const HEROES = {
  '7': 'WARRIOR',
  '31': 'HUNTER',
  '274': 'DRUID',
  '637': 'MAGE',
  '671': 'PALADIN',
  '813': 'PRIEST',
  '893': 'WARLOCK',
  '930': 'ROGUE',
  '1066': 'SHAMAN',
  '2826': 'HUNTER',
  '2827': 'PALADIN',
  '2828': 'WARRIOR',
  '2829': 'MAGE',
  '39117': 'MAGE',
  '40183': 'SHAMAN',
  '40195': 'ROGUE',
  '41887': 'PRIEST'
};

const scan = () =>  Twitter.get('search/tweets', scanParams, (err, data, response) => {
  const decks = {};
  if (err) {
    console.log("Error while getting tweets: " + JSON.stringify(err))
  }
  console.log(data.statuses
    .filter(status => status.full_text
        .split('\n')
        .reduce((words, line) => {
          line
            .split(' ')
            .forEach(word => words.push(word));
          return words;
        }, [])
        .filter(word => {
          try {
            deck = deckStrings.decode(word);
          } catch(error) {
            return false;
          }
          decks[status.id_str] = deck;
          return true;
        })
        .map(word => {
          return word;
        })[0]
    )
    .map(({user, id_str}) => {
      deck = decks[id_str];
      return [
      `### ${user.name}`,
      `# Class: ${HEROES[deck.heroes[0]]}`,
      `# Format: ${deck.format -1}`,
      deckStrings.encode(deck),
      `#`
    ].join('\n')})
  );
});

module.exports = {
  scan
};