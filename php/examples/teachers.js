
//  Загрузка преподов в панель
function teacher_init() {    //  Заполнение блока преподов используя загрузку преподов.
    $.ajax({
        url: "load_teachers.php",
        type: "POST",
        data: { teachers_storage: localStorage.getItem("tech") },  //  Загрузит либо из ЛОкалСтораж либо для текущего препода
        success: function (data) {
            $("#only_selected_teacher").html(data);
                console.log("Преподаватели загружены и добавлены в панель!");
                $("#tabloid_full").html("<h3>Преподаватель не выбран</h3>");
            change_teachers();
        },
        error: function (data) {
            $("#only_selected_teacher").html("<h3>Не удалось загрузить\добавить преподавателей</h3>");
        }
    });
};

//  Пересоздание объекта для ВСЕХ преподов которые добавлены в панель...
function change_teachers() {
    var tchr = [];
    $("#tabloid_full").empty();
    $("#only_selected_teacher").find(".chbox_teacher").each(function (indx) {
        tchr.push($(this).val());	// Все кто добавлен в панель
    });

    console.log(tchr);
    console.log("Преподаватели установлены!");

    if (tchr.length > 0) {
        var teachers_array = JSON.stringify(tchr);
        $.ajax({
            url: "create_object.php",
            type: "POST",
            data: { teacher: teachers_array },
            success: function (data) {
                if (data) {
                    console.log("Объект создан");
                } else {
                    $("#tabloid_full").html("Неудалось загрузить данные");
                }
            },
            error: function (data) {
                $("#tabloid_full").html("Ошибка чтения данных");
            }
        });
    }
    else { $("#tabloid_full").html("<h3>Преподаватель не выбран</h3>"); }
}

// Выпор конкретного препода
function check_teacher(box) {
    var box = box;
    if (box.prop("checked")) { $('label[for = "' + box.attr("id") + '"]').css('background-color', '#aaED90'); }
    else { $('label[for = "' + box.attr("id") + '"]').css('background-color', 'beige'); }
    Fill_Tabloid();
}