    const canvas1 = document.getElementById('clock-dots');
    const ctx1 = canvas1.getContext("2d");

    ctx1.canvas.width = innerWidth || document.querySelector('.clock-dots-wrapper').clientWidth || document.body.clientWidth;
    ctx1.canvas.height = innerHeight || document.querySelector('.clock-dots-wrapper').clientHeight || document.body.clientHeight;

    ctx1.translate(canvas1.width / 2, canvas1.height / 2);

    const numberDots = 60;
    let radius = canvas1.height / 4;
    let dotIndex = 0;
    let dots = [];
    let x = 0;
    let y = radius;
    let vectorLength = Math.sqrt(Math.pow(radius, 2));
    let vectorDirection = (2 * Math.PI) / numberDots;
    let levels = 6;
    let newLevel = [];
    let lastDotSize;

    function Dot(dotSize) {
        this.dotRadius = dotSize;
        lastDotSize = dotSize;
        this.x = x;
        this.y = y;
        this.dotIndex = dotIndex;
        dots[dotIndex] = this;
        dotIndex++;
        this.colour = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
        this.draw = function() {
            ctx1.beginPath();
            ctx1.arc(this.x, this.y, this.dotRadius, 0, 2 * Math.PI);
            ctx1.fillStyle = this.colour;
            ctx1.fill();
            ctx1.closePath();
        }
        x = vectorLength * Math.sin(vectorDirection);
        y = vectorLength * Math.cos(vectorDirection);
        vectorDirection = vectorDirection + ((2 * Math.PI) / numberDots);

        this.dotMove = function(size) {
            this.x = vectorLength * Math.sin(vectorDirection);
            this.y = vectorLength * Math.cos(vectorDirection);
            this.dotRadius = size;
            vectorDirection = vectorDirection + ((2 * Math.PI) / numberDots);

        }
    }

    function drawLevels(size) {
        for (let j = levels; j > 0; j--) {
            radius += size * 2 + 2;
            x = 0;
            y = radius;
            vectorDirection = 0;
            vectorLength = Math.sqrt(Math.pow(radius, 2));
            let subArr = [];
            for (let i = 0; i < numberDots; i++) {
                subArr[i] = $.extend(true, {}, dots[i]);
                subArr[i].dotMove(size);
            }
            newLevel.push(subArr);
            console.log('newLevel= ' + newLevel);
            size++;
        }
        for (let i in newLevel) {
            for (let j = 0; j < newLevel[i].length; j++) {
                newLevel[i][j].draw();
            }
        }
    }

    (function drawDottedClock() {
        ctx1.beginPath();
        ctx1.arc(0, 0, vectorLength + (lastDotSize * 5), 0, 2 * Math.PI);
        ctx1.fillStyle = 'rgb(238,238,238)';
        ctx1.fill();
        ctx1.closePath();
        for (let i = 0; i < numberDots; i++) {
            new Dot(4);
            console.log('drawing dot');
            dots[i].draw();
        }
        drawLevels(5);
    })();


    setInterval(function() {
        ctx1.clearRect(-canvas1.width, -canvas1.height, 2 * canvas1.width, 2 * canvas1.height);
        ctx1.beginPath();
        ctx1.arc(0, 0, vectorLength + (lastDotSize * 5), 0, 2 * Math.PI);
        ctx1.fillStyle = 'rgb(238,238,238)';
        ctx1.fill();
        ctx1.closePath();
        ctx1.rotate(-1 / (numberDots - 1) * 2 * Math.PI);
        for (let i in dots) {
            dots[i].draw();
        }
        for (let i in newLevel) {
            for (let j = 0; j < newLevel[i].length; j++) {
                newLevel[i][j].draw();
            }
        }
    }, 100);

    const canvas2 = document.getElementById('clock-rainbow');
    const ctx2 = canvas2.getContext("2d");

    ctx2.canvas.width = innerWidth || document.querySelector('.clock-rainbow-wrapper').clientWidth || document.body.clientWidth;
    ctx2.canvas.height = innerHeight || document.querySelector('.clock-rainbow-wrapper').clientHeight || document.body.clientHeight;

    ctx2.translate(canvas2.width / 2, canvas2.height / 2);
    let radius2 = (canvas2.height / 4.5);
    let startAngle = -.5 * Math.PI;
    let sliceAngle = 1 / numberDots * 2 * Math.PI;
    let rainbow = {};
    let rainbowIndex = 0;

    function RainbowSlice() {
        this.startAngle = startAngle;
        this.sliceAngle = sliceAngle;
        rainbow[rainbowIndex] = this;
        rainbowIndex++;
        this.colour;
        this.strokeColour;
        this.strokeLineW;
        if (rainbowIndex % 2 == 0) {
            this.colour = 'hsl(' + 360 * Math.random() + ',' + 100 * Math.random() + '%' + ', 50%)';
            this.strokeColour = 'pink';
            this.strokeLineW = 6;
        } else {
            this.colour = 'transparent';
            this.strokeColour = 'transparent';
            this.strokeLineW = 6;
        }
        this.draw = function() {
            ctx2.globalAlpha = .3;
            ctx2.beginPath();
            ctx2.arc(0, 0, radius2, this.startAngle, this.startAngle + this.sliceAngle);
            ctx2.strokeStyle = this.strokeColour;
            ctx2.lineWidth = this.strokeLineW;
            ctx2.stroke();
            ctx2.lineTo(0, 0);
            ctx2.fillStyle = this.colour;
            ctx2.fill();
            startAngle += sliceAngle;
        }
    }

    (function drawRainbowClock() {
        for (let i = 0; i < numberDots; i++) {
            new RainbowSlice();
            rainbow[i].draw();
        }
    })();


    setInterval(function() {
        ctx2.clearRect(-canvas2.width, -canvas2.height, 2 * canvas2.width, 2 * canvas2.height);
        ctx2.rotate(1 / numberDots * 2 * Math.PI);
        for (let i in rainbow) {
            rainbow[i].draw();
        }
    }, 100);

    const canvas3 = document.getElementById('clock-hands');
    const ctx3 = canvas3.getContext("2d");

    ctx3.canvas.width = innerWidth || document.querySelector('.clock-hands-wrapper').clientWidth || document.body.clientWidth;
    ctx3.canvas.height = innerHeight || document.querySelector('.clock-hands-wrapper').clientHeight || document.body.clientHeight;

    ctx3.translate(canvas3.width / 2, canvas3.height / 2);

    function updateTime(radius) {
        (function drawTime() {
            let now = new Date();
            let hour = now.getHours();
            let minute = now.getMinutes();
            let second = now.getSeconds();
            hour = hour % 12;
            hour = (hour * Math.PI / 6) +
                (minute * Math.PI / (6 * 60)) +
                (second * Math.PI / (360 * 60));
            drawHand(hour, radius2 * 0.7, radius2 * 0.09);
            minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
            drawHand(minute, radius2 * 0.9, radius2 * 0.07);
            second = (second * Math.PI / 30);
            drawHand(second, radius2, radius2 * 0.02);
        })();

        function drawHand(pos, length, width) {
            ctx3.beginPath();
            ctx3.lineWidth = width;
            ctx3.lineCap = "round";
            ctx3.moveTo(0, 0);
            ctx3.rotate(pos);
            ctx3.lineTo(0, -length);
            ctx3.strokeStyle = 'black';
            ctx3.stroke();
            ctx3.rotate(-pos);
        }
    }

    setInterval(function() {
        ctx3.clearRect(-canvas3.width, -canvas3.height, 2 * canvas3.width, 2 * canvas3.height);
        updateTime(canvas3.height / 5.5);
    }, 1000);


    const canvas4 = document.getElementById('face');
    const ctx4 = canvas4.getContext("2d");

    ctx4.canvas.width = innerWidth || document.querySelector('.face-wrapper').clientWidth || document.body.clientWidth;
    ctx4.canvas.height = innerHeight || document.querySelector('.face-wrapper').clientHeight || document.body.clientHeight;

    ctx4.translate(canvas4.width / 2, canvas4.height / 2);

    function drawPerson() {
        function drawCircle(x, y, width, angleStart, angleEnd, clockwise, fill) {
            ctx4.beginPath();
            ctx4.arc(x, y, width, angleStart, angleEnd, clockwise);
            ctx4.fillStyle = fill;
            ctx4.fill();
            ctx4.closePath();
        }

        drawCircle(canvas4.width / 2 - 140, canvas4.height / 2, 90, 0, Math.PI, true, 'rgb(110, 121, 117)');
        drawCircle(canvas4.width / 2 - 100, canvas4.height / 2 - 140, 100, 0, 2 * Math.PI, false, 'rgb(110, 121, 117)');
        drawCircle(canvas4.width / 2 - 120, canvas4.height / 2 - 190, 25, 0, 2 * Math.PI, false, 'rgba(245, 245, 245, .5)');
        drawCircle(canvas4.width / 2 - 185, canvas4.height / 2 - 180, 20, .35 * Math.PI, 2 * Math.PI, false, 'rgb(110, 121, 117)');
        drawCircle(canvas4.width / 2 - 130, canvas4.height / 2 - 190, 15, 0, 2 * Math.PI, false, 'rgb(238,238,238)');
        drawCircle(canvas4.width / 2 - 135, canvas4.height / 2 - 193, 10, 0, 2 * Math.PI, false, 'rgb(100,100,100)');
        drawCircle(canvas4.width / 2 - 185, canvas4.height / 2 - 130, 7, 0, Math.PI * 2, false, 'rgb(195, 195, 195)');
    }

    drawPerson();

    const canvas5 = document.getElementById('particles');
    const ctx5 = canvas5.getContext("2d");

    let numberMovingDots = 20;
    let movingDots = [];
    let movingDotIndex = 0;
    ctx5.canvas.width = innerWidth || document.querySelector('.particles-wrapper').clientWidth || document.body.clientWidth;
    ctx5.canvas.height = innerHeight || document.querySelector('.particles-wrapper').clientHeight || document.body.clientHeight;

    ctx5.translate(canvas5.width / 2, canvas5.height / 2);

    function MovingDot() {
        this.x = 0;
        this.y = 0;
        this.vector = Math.floor(Math.random() * 6 + 5);
        this.angle = Math.floor(Math.random() * 361);
        movingDotIndex++;
        movingDots[movingDotIndex] = this;
        this.radius = Math.floor(Math.random() * 4 + 1);
        this.life = 0;
        this.id = movingDotIndex;
        this.colour = 'hsl(' + 360 * Math.random() + ', 50%, 50%)';
        this.draw = function() {
            if (this.life > 70 || this.x >= canvas5.width || this.y >= canvas5.height) {
                delete movingDots[this.id];
            }
            if (this.vector == 0) this.vector = 1;
            if (this.angle == 0) this.angle = 125;

            this.x += this.vector * Math.cos(this.angle * Math.PI / 180);
            this.y += this.vector * Math.sin(this.angle * Math.PI / 180);
            this.life++;
            ctx5.globalAlpha = .8;
            ctx5.beginPath();
            ctx5.arc(this.x, this.y, this.radius, 0, 3 * Math.PI);
            ctx5.fillStyle = this.colour;
            ctx5.fill();

        }
    }

    function dotBurst() {
        for (let i = 0; i < numberMovingDots; i++) {
            new MovingDot();
        }
    }
    setInterval(function() {
        dotBurst();
        ctx5.clearRect(-(canvas5.width / 2), -(canvas5.height / 2), canvas5.width, canvas5.height);
        for (let i = 0; i < numberMovingDots; i++) {
            new MovingDot();
        }
        for (let i in movingDots) {
            movingDots[i].draw();
        }
    }, 100);