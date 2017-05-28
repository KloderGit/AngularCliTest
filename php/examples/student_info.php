<?
header("Content-Type: text/html; charset=utf-8");
include 'Tabloid.php';
include 'views/view_tabloid_block.php';

setlocale(LC_ALL, 'ru_RU.UTF-8');
session_start();

$tabloid = unserialize($_SESSION['tabloid']);

if (isset($_POST['examen']) and !empty($_POST['examen']))
{
    $examen_id = $_POST['examen'];
}
if (isset($_POST['student']) and !empty($_POST['student']))
{
    $student_id = $_POST['student'];
}
if (isset($_POST['predmet']) and !empty($_POST['predmet']))
{
    $predmet_id = $_POST['predmet'];
}

$examen_objects = $tabloid->selectExamensFromID($examen_id);

$examenOO = array_filter($examen_objects, function($item){
    if ($item->getStudent()) { return true; } else { return false; }
});

foreach ($examenOO as $key => $value){
    if ($value->getStudent()->getStudentId() == $student_id) { $examen = $value; }
}

$student = $examen->getStudent();

$student->LoadRates(); 
$student->LoadComments();
$rates = $student->getRate();
$current_rate = $rates[$examen_id];

if (!$current_rate){
    $cur_comnt = $student->getCommentsOfExamen($examen->getExamenId());
    if ($cur_comnt){
        if ($cur_comnt->getStudentMissed()){ $current_rate = 9; }
        if ($cur_comnt->getisKonsult()){ $current_rate = 8; }
        if ($cur_comnt->getPerenos()){ $current_rate = 10; }
    }
}

?>
<div id="student_wraper">
    <div id="student_name">
        <h1><? echo $student->getStudentFIO(); ?></h1>
    </div>
    <div id="student_info_wrapper">
        <div id="student_info">
            <p>Skype: <? echo $student->getStudentSkype(); ?></p>
            <p>Тел.:  <? echo $student->getStudentPhone(); ?></p>
            <p>Email: <? echo $student->getStudentEmail(); ?></p>
        </div>
    </div>
    <div id="student_rate">
        <h1><? echo $tabloid->getPredmets($examen->getParentPredmet())->getTitle(); ?></h1>
        <h3><? echo $examen->getTime()->getFullDate(); ?></h3>
        <p>Оценка:</p>
        <form style="position:relative" name="student-rate" id="student-rate" data-predmet="<? echo $examen->getParentPredmet(); ?>" data-examen ="<? echo $examen->getExamenId(); ?>" data-student ="<? echo $student->getStudentId(); ?>">
            <div class="rate_info" id="save_succes">Сохранено</div>
            <div class="rate_info" id="save_error">Ошибка</div>
            <div>
                <? for ($it=1; $it <= 5; $it++ ) { ?>
                <? if ($it == $current_rate) { $act_class = "rate_active"; } else { $act_class = ""; } ?>
                <label class="rateLeft <? echo $act_class ?>">
                    <input type="radio" name="form_rate" value="<? echo $it ?>"><? echo $it ?></label>
                <? } ?>
                |
        <? if ($current_rate == 6) { $act_class = "rate_active"; } else { $act_class = ""; } ?>
                <label style="margin-left: 15px;" class="rateLeft <? echo $act_class ?>">
                    <input type="radio" name="form_rate" value="6" />
                    Зачет
                </label>
                <? if ($current_rate == 7) { $act_class = "rate_active"; } else { $act_class = ""; } ?>
                <label class="rateLeft <? echo $act_class ?>">
                    <input type="radio" name="form_rate" value="7" />
                    Не зачет
                </label>
            </div>
            <div style="border-top: 1px solid #eee;">
                <? if ($current_rate == 8 ) { $act_class = "rate_active"; } else { $act_class = ""; } ?>
                <label class="rateLeft <? echo $act_class ?>">
                    <input type="radio" name="form_rate" value="8" />
                    Проведена консультация
                </label>

                <? if ($current_rate == 9 ) { $act_class = "rate_active"; } else { $act_class = ""; } ?>
                <label class="rateLeft <? echo $act_class ?>">
                    <input type="radio" name="form_rate" value="9" />
                    Пропущен
                </label>

                <? if ($current_rate == 10 ) { $act_class = "rate_active"; } else { $act_class = ""; } ?>
                <label class="rateLeft <? echo $act_class ?>">
                    <input type="radio" name="form_rate" value="10" />
                    Перенос
                </label>
            </div>
        </form>
    </div>
    <div id="bottom_slide_up"></div>
    <div id="comment_wraper">
        <div id="tabs_button" class="comment_tab">
            <a href="#" class="comment_tab">Комментарии</a>
            <? if (count($rates) > 0) { ?><a href="#" class="rate_tab">Оценки</a><? } ?>
        </div>
        <div id="tabs_items" class="comment_tab">
            <div class="comment_tab">
                <ul class="accordion_mini">

                    <? if (count($student->getCommentsOfPredmet()) > 0) { ?>
                    <? if (count($student->getCommentsOfPredmet($predmet_id)) > 0) { ?>
                    <li class="slider_item">
                        <h4 class="slideTitle">Комментарии предмета</h4>
                        <div class="slider_wrap" style="display: none;">
                            <h1 style="margin: 10px 0"><? echo $tabloid->getPredmets($predmet_id)->getTitle(); ?></h1>
                            <? foreach ($student->getCommentsOfPredmet($predmet_id) as $comment_key => $comment_object) { ?>

                            <div class="comment_spliter" data-examen="<? echo $comment_object->getCommentExamen();?>">
                                <div class="comment_date"><? echo $comment_object->getCommentData(); ?></div>
                                <div class="comment_text">
                                    <div style="display: table; padding: 5px 0;">
                                        <? if ($comment_object->getisKonsult()) { ?>
                                        <p class="commentintext commentintextkonsult">Проведена консультация</p>
                                        <? } ?>
                                        <? if ($comment_object->getStudentMissed()) { ?>
                                        <p class="commentintext commentintextpropusk">Пропущено студентом</p>
                                        <? } ?>
                                        <? if ($comment_object->getPerenos()) { ?>
                                        <p class="commentintext commentintextperenos">Перенос экзамена</p>
                                        <? } ?>
                                    </div>
                                    <? foreach ($comment_object->getCommentText() as $key => $comment) {?>
                                    <p style="padding: 7px; margin-bottom: 3px; box-sizing: border-box; border-left: 3px solid #566e9b"><? echo $comment; ?></p>
                                    <? } ?>
                                </div>
                            </div>
                            <? } ?>
                        </div>
                    </li>
                    <? } ?>

                    <? if (count($student->getCommentsOfPredmet($predmet_id, 1)) > 0) { ?>

                    <? $predmetsOfComment = array_unique (array_map (function ($eee) { return $eee->getCommentPredmet(); }, $student->getCommentsOfPredmet($predmet_id,1) )  ); ?>

                    <li class="slider_item">
                        <h4 class="slideTitle">Комментарии других предметов</h4>
                        <div class="slider_wrap" style="display: none;">
                            <? foreach ($predmetsOfComment as $key =>$pred) { ?>
                            <h1 style="margin: 10px 0"><? echo $tabloid->getPredmets($pred)->getTitle(); ?></h1>
                            <? foreach ($student->getCommentsOfPredmet($pred) as $comment_key => $comment_object) { ?>

                            <div class="comment_spliter">
                                <div class="comment_date"><? echo $comment_object->getCommentData(); ?></div>
                                <div class="comment_text">
                                    <div style="display: table; padding: 5px 0;">
                                        <? if ($comment_object->getisKonsult()) { ?>
                                        <p class="commentintext commentintextkonsult">Проведена консультация</p>
                                        <? } ?>
                                        <? if ($comment_object->getStudentMissed()) { ?>
                                        <p class="commentintext commentintextpropusk">Пропущено студентом</p>
                                        <? } ?>
                                        <? if ($comment_object->getPerenos()) { ?>
                                        <p class="commentintext commentintextperenos">Перенос экзамена</p>
                                        <? } ?>
                                    </div>
                                    <? foreach ($comment_object->getCommentText() as $key => $comment) {?>
                                    <p style="padding: 7px; margin-bottom: 3px; box-sizing: border-box; border-left: 3px solid #566e9b"><? echo $comment; ?></p>
                                    <? } ?>
                                </div>
                            </div>
                            <? } ?>

                            <? } ?>
                        </div>
                    </li>
                    <? } ?>

                    <? } ?>

                </ul>
                <div id="add_comment_button">
                    <label class="addcommentlabel">
                        <input type="button" name="addcomment" />
                        Добавить комментарий к экзамену
                    </label>
                    <div id="add_textareya" style="display: none;">
                        <textarea id="event_comment" name="event_comment" cols="60" rows="8"></textarea>
                        <div class="add_textareya_button">
                            <label class="comment save commentlabel">
                                <input type="button" name="savecomment" />
                                Сохранить
                            </label>
                            <label class="commentcancel commentlabel">
                                <input type="button" name="cancelcomment" />
                                Отмена
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <? if (count($rates) > 0) { ?>
            <div class="rate_tab">
                <?  //  Предметы по которым получены оценки. Вернее предметы оценок из массива оценок - $rates
                   foreach ($rates as $examen_key => $examen_rate){ ?>
                <? if (isset($examen_key) and !empty($examen_key)) { 
                       $ex = $tabloid->selectExamensFromID($examen_key)[0];
                       if ($ex) {$rate_predmet[] = $ex->getParentPredmet();}
                   }
                   }
                   $rate_predmet = array_unique($rate_predmet);
                ?>

                <? foreach ($rate_predmet as $key => $predmet_key) { ?>
                <h1><? echo $tabloid->getPredmets($predmet_key)->getTitle(); ?></h1>
                <? foreach ($rates as $examen_key => $rate_value) { ?>
                <? if (isset($examen_key) and !empty($examen_key)) { ?>
                <? $ex = $tabloid->selectExamensFromID($examen_key)[0];
                   if ($ex and $ex->getParentPredmet() == $predmet_key) { ?>
                <div>
                    <p><? echo $ex->getTime()->getFullDate(); ?></p>
                    <p>Оценка — <? echo  $rate_value; ?></p>
                </div>
                <? } ?>
                <? } ?>
                <? } ?>
                <? } ?>
            </div>
            <? } ?>
        </div>
    </div>
    <div id="bottom_slide_bottom"></div>
</div>

<script>
    $("#student_wraper").on("click", "#student_info", function () {
        console.log($(this).html());
    });

    $('#student_wraper').on("click", "#bottom_slide_up, #bottom_slide_bottom", function () {
        $("#comment_wraper").slideToggle("slow");
    });

    $('#tabs_button').on("click", "a", (function (event) {
        event.preventDefault();
        if ($(this).attr('class') != $('#tabs_items').attr('class')) {
            $('#tabs_items').attr('class', $(this).attr('class'));
            $('#tabs_button').attr('class', $(this).attr('class'));
        }
    }));

    $(".addcommentlabel").on("click", function () {
        $("#tabs_items .accordion_mini").fadeOut();
        $("#tabs_items .addcommentlabel").fadeOut();
        $("#add_textareya").slideDown();
    });
    $(".commentcancel").on("click", function () {
        $("#add_textareya").slideUp();
        $("#event_comment").val("");
        $("#tabs_items .accordion_mini").fadeIn();
        $("#tabs_items .addcommentlabel").fadeIn();
    });

    $("#tabs_items").on("click", "ul > li.slider_item", function () {
        var selfClick = $(this).find('div.slider_wrap:first').is(':visible');

        if (!selfClick) {
            $(this)
              .parent()
              .find('> li.slider_item div.slider_wrap:visible')
              .slideToggle();
        }

        $(this)
          .find('div.slider_wrap:first')
          .stop(true, true)
          .slideToggle();
    });

    //  Изменение оценки, пропуска, переноса и консультации
    $("#student-rate").on('change', 'input', function () {
        //  Выделим только выбраный
        $("#student-rate .rateLeft").each(function () {
            $(this).removeClass("rate_active");
        });
        $(this).parent().addClass("rate_active");

        var select_value = $(this).val();
        var select_predmet = $(this).parent().parent().parent().data("predmet");
        var select_examen = $(this).parent().parent().parent().data("examen");
        var select_student = $(this).parent().parent().parent().data("student");
        var select_comment = null;

        // Сохраним если это оценка
        if (select_value < 8) {
            save_rate(select_value, select_examen, select_student);
        }

        // Сохраним если это коментарии
        if (select_value > 7) {
            save_comment(select_value, select_examen, select_student, select_predmet, select_comment);
        }
    });

    $("#add_textareya").on("click", ".save > input", function (e) {
        e.preventDefault();

        var select_value = null;
        var select_predmet = $("form#student-rate").data("predmet");
        var select_examen = $("form#student-rate").data("examen");
        var select_student = $("form#student-rate").data("student");
        var select_comment = $("#event_comment").val();

        save_comment(select_value, select_examen, select_student, select_predmet, select_comment);
        console.log("Нажато сохранение");
    });

    function save_rate(rate, examen, student) {
        $.ajax({
            url: "save_rate.php",
            type: "POST",
            data: { examen: examen, student: student, rate: rate },
            success: function (data) {
                if (data == "yes") {
                    console.log('Оценка сохранена');
                    $("#student-rate").find("#save_succes").fadeTo("slow", 1).fadeTo(2000, 0);

                    var block_position = $("#children > div.student_reg[data-button-student=" + student + "][data-button-examen=" + examen + "]");
                    var rate_position = block_position.children(".com_rate");

                    console.log(rate_position.html());

                    if (rate == 6) {
                        rate_position.removeClass().addClass("comment_exist comment_zachet com_rate");
                        rate_position.html('<span class="icon-star-1"></span> Зачет </p>');
                    }
                    if (rate == 7) {
                        rate_position.removeClass().addClass("comment_exist comment_nezacet com_rate");
                        rate_position.html('<span class="icon-star"></span> Не зачет </p>');
                    }
                    if (rate >= 1 & rate <= 5) {
                        rate_position.removeClass().addClass("comment_exist com_rate");
                        var str = "";
                        for (i = 0; i < rate; i++) {
                            str = str + '<span style="color:green" class="icon-star-1"></span>';
                        }
                        for (i = 0; i < (5 - rate) ; i++) {
                            str = str + '<span class="icon-star"></span>';
                        }
                        rate_position.html(str);
                    }
                }
            },
            error: function (data) {
                $("#student-rate").find("#save_error").fadeTo("slow", 1).fadeTo(2000, 0);
            }
        });
    }

    function save_comment(rate, examen, student, predmet, comment) {
        console.log(comment);

        $.ajax({
            url: "save_comment.php",
            type: "POST",
            data: { examen: examen, student: student, rate: rate, predmet: predmet, comment: comment },
            success: function (data) {
                console.log('Комментарий сохранен');
                $("#student-rate").find("#save_succes").fadeTo("slow", 1).fadeTo(2000, 0);

                var block_position = $("#children > div.student_reg[data-button-student=" + student + "][data-button-examen=" + examen + "]");
                var rate_position = block_position.children(".com_rate");

                if (rate == 9) {
                    rate_position.removeClass().addClass("comment_konsult com_rate");
                    rate_position.html("Пропущено студентом");
                    $("#tabs_items")
                        .find(".comment_spliter[data-examen=" + examen + "]").children(".comment_text")
                        .append('<div style="display:table; padding: 5px 0;">' +
                                '<p class="commentintext commentintextpropusk">Пропущено студентом</p>' +
                                '</div>');
                }
                if (rate == 8) {
                    rate_position.removeClass().addClass("comment_missed com_rate");
                    rate_position.html("Консультация");
                    $("#tabs_items")
                        .find(".comment_spliter[data-examen=" + examen + "]").children(".comment_text")
                        .append('<div style="display:table; padding: 5px 0;">' +
                                '<p class="commentintext commentintextkonsult">Проведена консультация</p>' +
                                '</div>');
                }
                if (rate == 10) {
                    rate_position.removeClass().addClass("comment_perenos com_rate");
                    rate_position.html("Перенос");
                    $("#tabs_items")
                        .find(".comment_spliter[data-examen=" + examen + "]").children(".comment_text")
                        .append('<div style="display:table; padding: 5px 0;">' +
                                '<p class="commentintext commentintextperenos">Перенос экзамена</p>' +
                                '</div>');
                }

                if (comment) {
                    $(".commentcancel").click();
                    var comment_block = $("#tabs_items").find(".comment_spliter[data-examen=" + examen + "]");

                    if (comment_block.length) {
                        comment_block.children(".comment_text")
                            .append('<p style="padding: 7px; margin-bottom: 3px; box-sizing: border-box; border-left: 3px solid #566e9b">' + comment + '</p>');
                    } else {
                        var into = $("#tabs_items").find("ul.accordion_mini");
                        into.append(
                            '<li class="slider_item">' +
                            '<h4 class="slideTitle">Комментарии предмета</h4>' +
                                '<div class="slider_wrap">' +
                                    '<h1 style="margin: 10px 0">' + $("div#student_rate").children("h1").text() + '</h1>' +
                                    '<div class="comment_spliter" data-examen="' + examen + '">' +
                                        '<div class="comment_date">' + $("div#student_rate").children("h3").text() + '</div>' +
                                        '<div class="comment_text">' +
                                            '<p style="padding: 7px; margin-bottom: 3px; box-sizing: border-box; border-left: 3px solid #566e9b">' + comment + '</p>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                            '<li>'
                            );
                    }

                }


            },
            error: function (data) {
            }
        });

    }


</script>


<?
echo '<pre>';
//print_r($student->getCommentsOfPredmet(5349));
//print_r($student);
echo '</pre>';

unset($tabloid);
?>

