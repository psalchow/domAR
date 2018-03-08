/* global simplAR */

(function () {

    function init() {
        simplAR.initAr();

        const type = simplAR.firstParamSet(["ring", "table", "helix", "sphere", "random"]);
        switch(type) {
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
            var parts = messageString.split(";");
            var number = parts[0] > 0 ? parts[0] : 1;
            var text = parts[1];

            var page = d3.select(".html" + number + ".title");

            var divs = page.selectAll(".char.font-effect-anaglyph")
                .data(text.split(''));

            divs.enter()
                .append("div")
                .attr("class", "char font-effect-anaglyph")
                .merge(divs)
                .text(function(d) {
                    return d;
                });

            divs.exit().remove();

        }

        simplAR.connect(onMessage);
    }

    window._start = init;

})();
