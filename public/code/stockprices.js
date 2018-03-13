/* global simplAR */

(function () {

    function init() {
        simplAR.initAr();

        const type = simplAR.firstParamSet(["ring", "table", "helix", "sphere", "random"]);
        switch (type) {
            case "ring":
                simplAR.ring();
                break;

            case "helix":
                simplAR.helix();
                break;

            case "sphere":
                simplAR.sphere();
                break;

            case "random":
                simplAR.sphereRandom(100);
                break;

            default:
                simplAR.table(3, 600, 200, 0, 500);
                break;

        }

        const interval = simplAR.paramValue(type) || 2000;

        simplAR.initTween();

        setInterval(function () {
            simplAR.rotate();
        }, interval)

        receiveMessages();
    }

    /* global d3 */

    function receiveMessages() {
        function onMessage(messageString) {
            const received = JSON.parse(messageString);

            try {
            received.map((element) => {
                const updated = element.updated;
                const trend = element.trend;
                const amount = element.value.amount + " " + element.value.currency;

                document.getElementById("company-" + element.id).innerHTML = element.company;
                document.getElementById("updated-" + element.id).innerHTML = updated;
                document.getElementById("value-" + element.id).innerHTML = amount;
                document.getElementById("shift-" + element.id).innerHTML = element.shift;
                document.getElementById("shift-" + element.id).style.cssText = element.shift > 0 ? "color: green" : "color: red";
                document.getElementById("trend-" + element.id).innerHTML = trend + " %";
                document.getElementById("trend-" + element.id).style.cssText = element.trend > 0 ? "color: green" : "color: red";
            })} catch(error) {
                console.log(error);
            }
        }

        simplAR.connect(onMessage);
    }

    window._start = init;

})();
