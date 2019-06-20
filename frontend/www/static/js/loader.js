(() => {
    acceptStyles();
})();

const loader = {
    open(elem = "loader") {
        document.getElementById(elem).style.display = 'block';
    },
    openProgressBar(speed, elem = "loader") {
        this.open(elem);
        const loader = new window.ldBar("#myItem1");
        loader.fit();
        window.ldr = {
            l: loader,
            percent: 0,
            addPercentage: function (percentage) {
                const newValue = this.percent + Number(percentage);
                this.l.set(newValue);
                this.percent = newValue;
            },
            setPercentage: function (percentage) {
                this.l.set(percentage);
                this.percent = percentage;
            },
            smoothTransition: function (steps, time, total) {
                const addPerStep = total/steps;
                let step = 1;
                const i = setInterval(() => {
                    this.addPercentage(addPerStep);
                    if (steps === step)
                        clearInterval(i);
                    step++;
                }, time/steps);
                return i;
            }
        };
        window.ldr.addPercentage(randomInteger(3,7));
        window.artificialLoader = setInterval(() => {
            try {
                window.ldr.addPercentage(randomInteger(3,7));
                if (window.ldr.percent >= randomInteger(93, 97))
                    clearInterval(window.artificialLoader);
            } catch (e) {
                clearInterval(window.artificialLoader);
            }
        }, speed);
    },
    close(elem = "loader") {
        if (window.ldr) {
            window.ldr.setPercentage(0);
            window.ldr = undefined;
        }
        if (document.getElementById(elem))
            document.getElementById(elem).style.display = 'none';
    },
    closeAfter(msec, elem = "loader") {
        if (window.ldr)
            window.ldr.setPercentage(100);
        return new Promise(async resolve => {
            setTimeout(() => {
                this.close(elem);
                resolve(true);
            }, msec);

        });
    }
};

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
}



function acceptStyles() {
    const styles = `
    .loader {
        position: fixed !important;
        top: 0;
        right: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: white;
        z-index: 10000;
    }
    
    .loader-container {
        height: 200px;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
    }
    
    .ldBar {
        position: relative;
    }
    
    .ldBar.label-center > .ldBar-label {
        position: absolute;
        top: 50%;
        left: 50%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        text-shadow: 0 0 3px #fff
    }
    
    .ldBar-label:after {
        content: "%";
        display: inline
    }
    
    #balancer {
        margin-top: -5em !important;
     }
     
    @media screen and (max-width: 800px) {
         #balancer {
            margin-top: 7em !important;
         }
    }
    
    .ldBar.no-percent .ldBar-label:after {
        content: ""
    }
    
    .ldBar-label {
        font-weight: bold;
    }
    .wallet-png {
        margin-top: 9em;
    }
    @media screen and (max-width: 430px) {
        .wallet-png {
            width: 300px;
        }
    }`;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styles;
}

