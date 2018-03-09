(function () {
    var defaultSettings = window._pages = [
        {id: "html1", name: "html1.html"},
        {id: "html2", name: "html2.html"},
        {id: "html3", name: "html3.html"},
        {id: "html4", name: "html4.html"},
        {id: "html5", name: "html5.html"},
        {id: "html6", name: "html6.html"},
        {id: "html7", name: "html7.html"},
        {id: "html8", name: "html8.html"},
        {id: "html9", name: "html9.html"},
    ];

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    // check for qr-code defined param
    if (window.location.href.indexOf("qrTarget") > 1) {
        var target = getParameterByName("qrTarget");

        console.log("got something: " + target);

        switch (target) {
            case "logo":
                window._pages = [
                    {id: "html1", name: "logo/html1.html"},
                    {id: "html2", name: "logo/html2.html"},
                    {id: "html3", name: "logo/html3.html"},
                    {id: "html4", name: "logo/html4.html"},
                    {id: "html5", name: "logo/html5.html"},
                    {id: "html6", name: "logo/html6.html"},
                    {id: "html7", name: "logo/html7.html"},
                ];
                break;
            case "schedule":
                window._pages = [
                    {id: "schedule", name: "schedule/schedule.html"}
                ];
                break;
            case "stocks":
                window._pages = [
                    {id: "html1", name: "stocks/html1.html"},
                    {id: "html2", name: "stocks/html2.html"}
                ];
                break;
            default:
                console.log("qrTarget-parameter " + target + " did not match!");
            // do nothing
        }
    }
})()
