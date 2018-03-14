const moment = require("moment");
const request = require("request");

const {WebSocketServer} = require('./WebSocketServer');

const customers = [
    {
        key: "DLAKF",
        company: "Deutsche Lufthansa AG"
    },
    {
        key: "MSFT",
        company: "Microsoft Corporation"
    },
    {
        key: "PBSFF",
        company: "ProsiebenSat.1 Media SE"
    },
    {
        key: "GOOGL",
        company: "Alphabet Inc."
    },
    {
        key: "FB",
        company: "Facebook, Inc."
    },
    {
        key: "BAMXF",
        company: "BMW AG"
    },
    {
        key: "DDAIF",
        company: "Daimler AG"
    },
    {
        key: "ADDDF",
        company: "Adidas AG"
    },
    {
        key: "DB",
        company: "Deutsche Bahn AG"
    }
];

function fetchRemoteApi(url) {
    console.log("Fetching stock updates...")
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) {
                return reject(error);
            }
            resolve(body);
        });
    });
}

function getUrl(customerKey) {
    return "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="
        + customerKey + "&interval=5min&apikey=NJLAVFTJ4P80CEWR&datatype=json"
}

function createStockDto(customer, index, jsonData) {
    try {
        const stockValue = JSON.parse(jsonData);
        const symbol = stockValue["Meta Data"]["2. Symbol"];
        const lastRefreshed = stockValue["Meta Data"]["3. Last Refreshed"];
        const currentValue = stockValue["Time Series (5min)"];

        const lastValues = [];
        let i = 0;
        for (let obj in currentValue) {
            let key = obj;
            let val = currentValue[key];

            if (i == 0) {
                lastValues.push(val["2. high"]);
            } else if (i == 1) {
                lastValues.push(val["3. low"]);
            } else {
                break;
            }

            i++;
        }

        const shift = parseFloat(lastValues[0]) - parseFloat(lastValues[1]);
        const trend = (parseFloat(lastValues[0]) / parseFloat(lastValues[1])) * 100 - 100;

        return {
            id: index + 1,
            company: customer.key + " (" + customer.company + ")",
            abbr: symbol,
            updated: moment(lastRefreshed).locale("de").format("DD.MMMM YYYY"),
            value: {
                amount: parseFloat(lastValues[0]).toFixed(2),
                currency: "$"
            },
            shift: shift.toFixed(2),
            trend: trend.toFixed(2)
        };
    } catch (error) {
        console.log(error);
        return null;
    }
}

async function loadStockData(customer, index) {
    return new Promise((resolve) => {
        fetchRemoteApi(getUrl(customer.key)).then((fetchedData) => {
            const jsonData = createStockDto(customer, index, fetchedData);
            resolve(jsonData);
        })
    })

}

function sendStockPrices() {
    const webSocketPort = process.argv[4] || 1337;
    const webSocketServer = new WebSocketServer();
    webSocketServer.connect(webSocketPort);

    customers.map(async (customer, index) => {
        loadStockData(customer, index).then((stockData) => {
            webSocketServer.sendObjectToAllSockets(stockData)
        })
    });

    setInterval(async () => {
        customers.map(async (customer, index) => {
            loadStockData(customer, index).then((stockData) => {
                console.log(stockData);
                webSocketServer.sendObjectToAllSockets(stockData)
            })
        });
    }, 1000 * 60 * 5); // reload every 5 minutes
}

module.exports = {
    sendStockPrices
};
