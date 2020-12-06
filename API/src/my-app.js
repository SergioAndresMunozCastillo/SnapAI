const { default: Framework7 } = require("framework7");

var app = new Framework7();

var app = new Framework7({
    root: '#app',
    name: 'My app',
    id: 'com.myapp.test',
    panel: {
        swipe: true,
    },
    routes: [
        {
            path: '/home/',
            url: '/views/index.html',
        },
    ],
});

var maiView = app.views.create('.view-main');