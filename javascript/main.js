var start = 60;$(document).ready(function(){    newGame(start);    $('#settings_input').val(1);    //$('#modalIntro button').click(function(){    //    $(this).parent().remove();    //    newGame(start);  //TODO comment back in when done    //    //});    $('.reset').click(function(){        clearInterval(clockInterval);        newGame(start);    });    $('#about').click(function() {        $('div.navbar-collapse').removeClass('collapse in').addClass('collapsing').removeClass('collapsing').attr('aria-expanded', 'false').css('height', '1px').addClass('collapse');    });    $('body').click(function(e){         var targetId = $(e.target).attr('id');         console.log(targetId);            if(targetId === 'settings') {                $('#dropdown').toggle();            }            else if(targetId !== 'dropdown'){               $('#dropdown').css('display', 'none');           }    });    $('#about').click(function(){        $('#modalAbout').show();    });    $('#playAgain button').click(function(){        $(this).parent().hide();        newGame(start);    });    $('#nextRound button, #modalAbout button').click(function(){       $(this).parent().hide();        nextRound();    });});