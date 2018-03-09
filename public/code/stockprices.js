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
            // TODO receive and handle more than one data object
            const value = JSON.parse(messageString);

            const updated = value.updated;
            const trend = (value.trend > 0) ? "+ " + value.trend : "- " + value.trend;
            const amount = value.value.amount + " " + value.value.currency;

            document.getElementById("updated").innerHTML = updated;
            document.getElementById("value").innerHTML = amount;
            document.getElementById("shift").innerHTML = value.shift;
            document.getElementById("shift").style.cssText = value.shift > 0 ? "color: green" : "color: red";
            document.getElementById("trend").innerHTML = trend + " %";
            document.getElementById("trend").style.cssText = value.trend > 0 ? "color: green" : "color: red";
        }

        simplAR.connect(onMessage);
    }

    window._start = init;

})();
