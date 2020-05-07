$(document).ready(function() {
    /*get true value of screen (without browser adress bar)*/
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    $(window).on('orientationchange resize', function() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
    $('.preloader').delay(500).fadeOut(500);
    $('#canvas').attr('width', $(window).width());
    $('#canvas').attr('height', $(window).height());
    createTaskStorageCopy = {};

    let clone_and_render = function() {
        $('.drag_and_canvas_wrapper > .drag_block').remove();
        var i = 0;
        for (i in createTaskStorageCopy) {
            $('.task_script_block > .drag_block').clone().appendTo('.drag_and_canvas_wrapper').attr('id', createTaskStorageCopy[i].id);
            if (createTaskStorageCopy[i].status == true) {
                $('.drag_block#' + createTaskStorageCopy[i].id).addClass('completed');
            }
            $('.drag_block#' + createTaskStorageCopy[i].id + ' .task_content h4 input').attr("value", createTaskStorageCopy[i].title);
            $('.drag_block#' + createTaskStorageCopy[i].id + ' .task_content div textarea').val(createTaskStorageCopy[i].text);
        }
    }
    clone_and_render();
    window.createTaskStorageCopy = createTaskStorageCopy

    var line_draw = function() {
        for (i in createTaskStorageCopy) {
            if ((createTaskStorageCopy[i].connection.from !== "") && (createTaskStorageCopy[i].connection.to !== "")) {
                if (($('#' + createTaskStorageCopy[i].connection.from + '').length) && ($('#' + createTaskStorageCopy[i].connection.to + '').length)) {
                    var el_from = $('#' + createTaskStorageCopy[i].connection.from + '');
                    var el_to = $('#' + createTaskStorageCopy[i].connection.to + '');
                    var c = document.getElementById("canvas");
                    var ctx = c.getContext("2d");
                    ctx.strokeStyle = "#ee6e73";
                    ctx.lineWidth = 2;
                    var el1_left = el_from.position().left + 300;
                    var el1_top = el_from.position().top + 120;
                    var el2_left = el_to.position().left - 0;
                    var el2_top = el_to.position().top + 120;
                    var gradient = ctx.createLinearGradient(el1_left, el1_top, el2_left, el2_top);
                    gradient.addColorStop("0", "#ee6e73");
                    gradient.addColorStop("1.0", "#ee6e73");
                    ctx.strokeStyle = gradient;
                    ctx.beginPath();
                    ctx.moveTo(el1_left, el1_top);
                    ctx.bezierCurveTo((el1_left + 50), (el1_top), (el2_left - 50), (el2_top), (el2_left), (el2_top));
                    ctx.stroke();
                }
            }
        }
    }
    $('body').delegate('.drag_block', 'click', function() {
        $('.drag_block').removeClass('active');
        $(this).toggleClass('active');
    });
    /*click on before & after element on dragable block*/
    var connect = {
        from: "",
        to: ""
    };
    $('body').delegate('.drag_block > div[data-element="pseudoelement"]', 'click', function() {
        $('.drag_block > div[data-is-active="true"]').removeAttr('data-is-active')
        $(this).attr('data-is-active', true);
        var parent_id = $(this).closest('.drag_block').attr('id');
        var pseudoelement_type = $(this).attr('class');
        if (pseudoelement_type == "before") {
            var parent_id_to = $(this).closest('.drag_block').attr('id');
            var pseudoelement_type_to = $(this).attr('class');
            connect.to = parent_id_to;
            clean()
        }
        if (pseudoelement_type == "after") {
            var parent_id_from = $(this).closest('.drag_block').attr('id');
            var pseudoelement_type_from = $(this).attr('class');
            connect.from = parent_id_from;
            clean()
        }
    });
    var clean = function() {
        if (connect.from === connect.to) {
            connect = {
                from: "",
                to: ""
            };
            $('.drag_block > div[data-is-active="true"]').removeAttr('data-is-active')
        } else if ((connect.from !== "") && (connect.to !== "") && (connect.from !== connect.to)) {
            for (i in createTaskStorageCopy) {
                if (createTaskStorageCopy[i].connection.from == connect.from) {
                    createTaskStorageCopy[i].connection.from = "";
                }
                if (createTaskStorageCopy[i].connection.to == connect.to) {
                    createTaskStorageCopy[i].connection.to = "";
                }
                if (createTaskStorageCopy[i].id == connect.from) {
                    createTaskStorageCopy[i].connection.from = connect.from
                    createTaskStorageCopy[i].connection.to = connect.to
                }
            }
            for (i in createTaskStorageCopy) {
                if (createTaskStorageCopy[i].connection.from == connect.from) {
                    createTaskStorageCopy[i].connection.from = "";
                }
                if (createTaskStorageCopy[i].connection.to == connect.to) {
                    createTaskStorageCopy[i].connection.to = "";
                }
                if (createTaskStorageCopy[i].id == connect.from) {
                    createTaskStorageCopy[i].connection.from = connect.from;
                    createTaskStorageCopy[i].connection.to = connect.to;
                }
            }
            document.getElementById("canvas").getContext("2d").clearRect(0, 0, $('.drag_and_canvas_wrapper').width(), $('.drag_and_canvas_wrapper').height());
            line_draw()
            connect = {
                from: "",
                to: ""
            };
            $('.drag_block > div[data-is-active="true"]').removeAttr('data-is-active')
        } else {}
    }
    var remove_connection = function(e) {
        if (connect.from == "") {
            for (i in createTaskStorageCopy) {
                if (createTaskStorageCopy[i].connection.to == connect.to) {
                    createTaskStorageCopy[i].connection.to = "";
                    createTaskStorageCopy[i].connection.from = "";
                    document.getElementById("canvas").getContext("2d").clearRect(0, 0, $('.drag_and_canvas_wrapper').width(), $('.drag_and_canvas_wrapper').height());
                    line_draw();
                }
            }
            for (i in createTaskStorageCopy) {
                if (createTaskStorageCopy[i].connection.to == connect.to) {
                    createTaskStorageCopy[i].connection.to = "";
                    createTaskStorageCopy[i].connection.from = "";
                    document.getElementById("canvas").getContext("2d").clearRect(0, 0, $('.drag_and_canvas_wrapper').width(), $('.drag_and_canvas_wrapper').height());
                    line_draw();
                }
            }
            connect = {
                from: "",
                to: ""
            };
        }
        if (connect.to == "") {
            for (i in createTaskStorageCopy) {
                if (createTaskStorageCopy[i].connection.from == connect.from) {
                    createTaskStorageCopy[i].connection.from = "";
                    createTaskStorageCopy[i].connection.to = "";
                    document.getElementById("canvas").getContext("2d").clearRect(0, 0, $('.drag_and_canvas_wrapper').width(), $('.drag_and_canvas_wrapper').height());
                    line_draw();
                }
            }
            for (i in createTaskStorageCopy) {
                if (createTaskStorageCopy[i].connection.from == connect.from) {
                    createTaskStorageCopy[i].connection.from = "";
                    createTaskStorageCopy[i].connection.to = "";

                    document.getElementById("canvas").getContext("2d").clearRect(0, 0, $('.drag_and_canvas_wrapper').width(), $('.drag_and_canvas_wrapper').height());
                    line_draw();
                }
            }
            connect = {
                from: "",
                to: ""
            };
        }
        $('.drag_block > div[data-element="pseudoelement"]').removeAttr('data-is-active')
    }
    /*remove connection on PRESS DELETE KEY*/
    function runOnKeys(func, ...codes) {
        let pressed = new Set();
        document.addEventListener('keydown', function(event) {
            pressed.add(event.keyCode);
            for (let keyCode of codes) {
                if (!pressed.has(keyCode)) {
                    return;
                }
            }
            pressed.clear();
            func();
        });
        document.addEventListener('keyup', function(event) {
            pressed.delete(event.keyCode);
        });
    }
    runOnKeys(() => remove_connection(), 91, 8);
    runOnKeys(() => remove_connection(), 46);

    /*Delete*/
    var delete_func = function(id_task_to_delete) {
        for (i in createTaskStorageCopy) {
            if (createTaskStorageCopy[i].connection.from == id_task_to_delete) {
                createTaskStorageCopy[i].connection.from = "";
            }
            if (createTaskStorageCopy[i].connection.to == id_task_to_delete) {
                createTaskStorageCopy[i].connection.to = "";
            }
            if (createTaskStorageCopy[i].id == id_task_to_delete) {
                delete createTaskStorageCopy[i]
            }
        };
        $('.drag_block#' + id_task_to_delete).remove();
        document.getElementById("canvas").getContext("2d").clearRect(0, 0, $('.drag_and_canvas_wrapper').width(), $('.drag_and_canvas_wrapper').height());
        line_draw();
        clean();
    }
    $('body').delegate('.task_buttons .delete', 'click', function() {
        var id_task_to_delete = $(this).closest('.drag_block').attr('id');
        delete_func(id_task_to_delete)
    });


    /*Create New Task*/
    var createNewTask = function(){
        var newTaskNumber = Object.keys(createTaskStorageCopy).length + 1;
        var newTaskObject = {
            id: "id_" + newTaskNumber,
            title: "",
            text: "",
            connection: {
                from: "",
                to: "",
            }
        }
        createTaskStorageCopy[newTaskNumber] = newTaskObject;

        /*clone_and_render();*/
        $('.task_script_block > .drag_block').clone().appendTo('.drag_and_canvas_wrapper').attr('id', createTaskStorageCopy[newTaskNumber].id);
        $('.drag_block#' + createTaskStorageCopy[newTaskNumber].id + ' .task_content h6 input').attr("value", createTaskStorageCopy[newTaskNumber].title);
        $('.drag_block#' + createTaskStorageCopy[newTaskNumber].id + ' .task_content div textarea').val(createTaskStorageCopy[newTaskNumber].text);
        
        $(".drag_block").each(function() {
            $(this).draggable({
                containment: $(this).parent(),
                drag: function() {
                    document.getElementById("canvas").getContext("2d").clearRect(0, 0, $('.drag_and_canvas_wrapper').width(), $('.drag_and_canvas_wrapper').height());
                    line_draw();
                    $('.drag_block').removeClass('active');
                    $(this).addClass('active');
                },
                stop: function() {
                    var id_el = $(this).attr('id');
                }
            }).css("position", "absolute");
        });
    }
    $('.add_task').click(function(){
        createNewTask()
    });

    /*make block dragable*/
    $(".drag_block").each(function() {
        $(this).draggable({
            containment: $(this).parent(),
            drag: function() {
                document.getElementById("canvas").getContext("2d").clearRect(0, 0, $('.drag_and_canvas_wrapper').width(), $('.drag_and_canvas_wrapper').height());
                line_draw();
                $('.drag_block').removeClass('active');
                $(this).addClass('active');
            },
            stop: function() {
                var id_el = $(this).attr('id');
            }
        }).css("position", "absolute");
    });

    $('body').delegate('.task .complete' , 'click' , function(){
        $(this).closest('.task').addClass("completed");
    });
    $('body').delegate('.task .uncomplete' , 'click' , function(){
        $(this).closest('.task').removeClass("completed");
    });

});