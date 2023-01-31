function debounce(db, time, immediate) {
    let timer;
    let immediateStart = immediate;
    return function() {
        if (immediateStart) {
            db.apply(this, arguments);
            immediateStart = false;
        }
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            db.apply(this, arguments);
        }, time);
    };
}

function setBody() {
    let body = document.body;
    let clientWidth = body.clientWidth,
        arr = [990, 1024, 1190, 1270, 1365, 1440, 1920],
        i = 0;
    while (i < arr.length) {
        if (arr[i] > clientWidth) {
            body.classList.add("s" + arr[i]);
        } else {
            if (body.classList.contains("s" + arr[i])) {
                body.classList.remove("s" + arr[i]);
            }
        }
        i++;
    }
}

(function(g) {
    setBody();
    g.onresize = debounce(setBody, 200);
})(window);