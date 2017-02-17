<?
define("NO_KEEP_STATISTIC", true);
define("NOT_CHECK_PERMISSIONS", true);
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');

include 'predmets.php';

//  $user_id = 906;

// Комментарии
$filter = array("IBLOCK_ID" => 28, "PROPERTY_EVENT_SUBJECT" => $user_id);
$result = CIBlockElement::GetList(array("ID" => "ASC"), $filter, false, false, array(
    "ID", "ACTIVE", "PROPERTY_EVENT_OBJECT_ID", "PROPERTY_EVENT_OBJECT_NAME",
    "PROPERTY_EVENT_DATE", "PROPERTY_EVENT_RATE", "PROPERTY_EVENT_IS_EXAMEN",
    "PROPERTY_EVENT_IS_KONSULT", "PROPERTY_EVENT_COMMENT", "PROPERTY_EVENT_MISSED_SUBJECT",
    "PROPERTY_EVENT_MISSED_PREPOD", "PROPERTY_EVENT_IS_EXCELLENT_GRADE", "PROPERTY_EVENT_EXCELLENT_GRADE_COMMENT"));


while ($res = $result->Fetch()) {
    if (array_key_exists($res["PROPERTY_EVENT_OBJECT_ID_VALUE"], $subjects)) {
        $res["PROPERTY_EVENT_OBJECT_NAME_VALUE"] = $subjects[$res["PROPERTY_EVENT_OBJECT_ID_VALUE"]]['Title'];
    } elseif (empty($res["PROPERTY_EVENT_OBJECT_NAME_VALUE"])) {
        $res["PROPERTY_EVENT_OBJECT_NAME_VALUE"] = 'Не указано';
    }

    $comments[$res["PROPERTY_EVENT_OBJECT_NAME_VALUE"]][$res["ID"]] = [
        'FullDate'          => $res["PROPERTY_EVENT_DATE_VALUE"],
        'RateEvent'         => $res["PROPERTY_EVENT_RATE_VALUE"],
        'isExamen'          => $res["PROPERTY_EVENT_IS_EXAMEN_VALUE"],
        'isKonsult'         => $res["PROPERTY_EVENT_IS_KONSULT_VALUE"],
        'Comment'           => $res["PROPERTY_EVENT_COMMENT_VALUE"],
        'StudentMissed'     => $res["PROPERTY_EVENT_MISSED_SUBJECT_VALUE"],
        'TeacherMissed'     => $res["PROPERTY_EVENT_MISSED_PREPOD_VALUE"],
        'is_excellent'      => $res["PROPERTY_EVENT_IS_EXCELLENT_GRADE"],
        'comment_excellent' => $res["PROPERTY_EVENT_EXCELLENT_GRADE_COMMENT"],
        'ID'                => $res["ID"]];
}

//        echo '<pre>'; print_r($comments); echo '<pre>';

?>
