//Oferece controle sobre a execução de algoritmos apenas

var threads_ativas = [];
var lastSpeed;
var currentInterval = null;
var dangerInterval = false;

//INTERVAL

function timerInterval(f, delay) {
    if (currentInterval !== null) {
        console.error("thread interval atualmente ativa, sendo desligada");
        clearTimerInterval();
    }
    var speed = getSpeed();
    var thread = {
        callback: f,
        delay: delay * speed,
        oridelay: delay,
        started: Date.now()
    };

    thread.t = setInterval(function(){
        currentInterval.started = Date.now();
        f();
    }, thread.delay);

    currentInterval = thread;
}

function clearTimerInterval() {
    if (currentInterval === null) {
        console.error("nenhuma thread interval para desativar");
    } else {
        clearInterval(currentInterval.t);
        currentInterval = null;
    }
}

//TIMEOUTS
function timeout(f, delay) {
    var speed = getSpeed();
    var thread = {
        callback: f,
        delay: delay * speed,
        started: new Date()
    };

    thread.t = setTimeout(function (){
        var index = threads_ativas.indexOf(thread);
        if (index !== -1) {
            threads_ativas.splice(index, 1);
        } else {
            console.log("Vazamento de thread");
        }
        f();
    }, thread.delay);

    threads_ativas.push(thread);
}

//ANIMAÇÕES
function animateAction(idDoElemento) {
    var that = $("#" + idDoElemento);
    var queue = that.data("queue");
    if (queue) {
        queue[0].started = Date.now();
        var desc = {
            duration: queue[0].time,
            easing: "easeOutCubic",
            complete: function() {
                dequeueAnimation(idDoElemento);
            },queue:false
        };
        if (queue[0].fn) {
            if (queue[0].fn.updateConnection) {
                desc.complete = function() {
                    Plumb.repintarElemento(idDoElemento);
                    dequeueAnimation(idDoElemento);
                };
                desc.step = function() {
                    Plumb.repintarElemento(idDoElemento);
                };
            }
            if (queue[0].fn.easing) {
                desc.easing = queue[0].fn.easing;
            }
            if (queue[0].fn.onInit) {
                queue[0].fn.onInit();
            }
        }
        that.animate(queue[0].target, desc);
    } else {
        console.log("fila de animação não encontrada, possível erro pode ter ocorrido");
    }
}

function dequeueAnimation(idDoElemento) {
    var that = $("#" + idDoElemento);

    var queue = that.data("queue");
    if (queue) {
        var last = queue.shift();

        if (queue.length > 0) {
            animateAction(idDoElemento);
        }
    } else {
        console.log("fila de animação não encontrada, possível erro pode ter ocorrido");
    }
}

function denoqueueAnimation(idDoElemento){
    var that = $("#" + idDoElemento);

    var queue = that.data("queue");
    if (queue) {
        queue.shift();
    } else {
        console.log("fila de animação não encontrada, possível erro pode ter ocorrido");
    }
}
//volátil, não usar
function noqueueAnimation(idDoElemento, target, time, fn) {
    
    var that = $("#" + idDoElemento);
    var speed = getSpeed();
    var action = {
        target: target,
        time: time * speed,
        fn: fn
    };
    
    var noqueue = that.data("noqueue");
    
    if (noqueue === undefined) {
        noqueue = [];
        noqueue.push(action);
        that.data("queue", noqueue);
    } else {
        noqueue.push(action);
    }
    
    action.started = Date.now();
    var desc = {
        duration: action.time,
        easing: "easeOutCubic",
        complete: function() {
            denoqueueAnimation(idDoElemento);
        },queue:false
    };
    
    that.animate(target,desc);
}

function queueAnimation(idDoElemento, target, time, fn) {

    var that = $("#" + idDoElemento);

    var speed = getSpeed();

    var action = {
        target: target,
        time: time * speed,
        fn: fn
    };

    var queue = that.data("queue");
    if (queue === undefined) {
        queue = [];
        queue.push(action);
        that.data("queue", queue);
        animateAction(idDoElemento);
    } else if (queue.length === 0) {
        queue.push(action);
        animateAction(idDoElemento);
    } else {
        queue.push(action);
    }
}

//STOP AND RESUME
//talvez um nivel acima to UI


function stopAll() {

    lastSpeed = getSpeed();

    for (var key in threads_ativas) {
        var t = threads_ativas[key];
        const tempo_restante = t.started - Date.now() + t.delay;
        t.delay = tempo_restante;
        clearTimeout(t.t);
    }

    $(".element").each(function(key, obj){
        var queue = $(obj).data("queue");
        if (queue && queue.length !== 0) {
            const tempo_restante = queue[0].started - Date.now() + queue[0].time;
            queue[0].time = tempo_restante;
            $(obj).stop(true, false);
        }
    });

    if (currentInterval !== null && !dangerInterval) {
        const tempo_restante = currentInterval.started - Date.now() + currentInterval.delay;
        currentInterval.delay = tempo_restante;
        clearTimeout(currentInterval.t);
    }
}

function updateTimes() {
    var newSpeed = getSpeed();
    if (newSpeed !== lastSpeed) {
        console.log("atualizando tempos");
        var ratio = newSpeed / lastSpeed;
        for (var key in threads_ativas) {
            var thread_desc = threads_ativas[key];
            thread_desc.delay = thread_desc.delay * ratio;
        }

        $(".element").each(function(key, obj){
            var queue = $(obj).data("queue");
            if (queue) {
                for (key in queue) {
                    queue[key].time = queue[key].time * ratio;
                }
            }
        });

        if (currentInterval !== null) {
            currentInterval.delay = currentInterval.delay * ratio;
        }
    }
}

function resumeAll() {

    updateTimes();

    var copy = [];

    while (threads_ativas.length !== 0) {
        const stopedtimer = threads_ativas.pop();

        stopedtimer.started = Date.now();

        stopedtimer.t = setTimeout(function(){
            var index = threads_ativas.indexOf(stopedtimer);
            if (index !== -1) {
                threads_ativas.splice(index, 1);
            } else {
                console.log("Vazamento de thread / procurando id " + stopedtimer.t);
            }
            stopedtimer.callback();
        }, stopedtimer.delay);

        copy.push(stopedtimer);
    }

    threads_ativas = copy;

    $(".element").each(function(key, obj){
        var queue = $(obj).data("queue");
        if (queue && queue.length !== 0) {
            animateAction(obj.id);
        }
    });

    if (currentInterval !== null) {
        dangerInterval = true;
        timeout(function(){
            currentInterval.started = Date.now();
            currentInterval.callback();//pode acabar encerrando o callback
            dangerInterval = false;
            if (currentInterval !== null) {
                currentInterval.t = setInterval(function(){
                    currentInterval.started = Date.now();
                    currentInterval.callback();
                }, currentInterval.oridelay * getSpeed());
            }
        }, currentInterval.delay);
    }
}