const deckStrings = require('deckStrings');

const mapToId = (map, card) => Object.assign(map, {[card.dbfId]: card});

let cards = {};

const getCards = () => https
  .get('https://api.hearthstonejson.com/v1/18336/enUS/cards.collectible.json', res => {

    const { statusCode } = res;
    const contentType = res.headers['content-type'];
    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        cards = parsedData.reduce(mapToId, {});
        console.log("cards successfully parsed");
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });

const getCardMap = () => cards;

const validateDeckCode = (deckCode) => {
  const deck = deckStrings.decode(deckCode);
}

module.exports = {
  getCardMap,
  getCards,
  validateDeckCode,
}