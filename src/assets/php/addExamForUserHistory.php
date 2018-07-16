<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');

$objectsArray = json_decode(file_get_contents('php://input'), true);

$succesInsertId = array();
$errorInsertId = array();

foreach ($objectsArray as $element) {

    $arFields = array(
        "ACTIVE" => "Y",
        "IBLOCK_ID" => 21,
        "NAME" => "Экзамен для дисциплины - " . $element["disciplineId"] . ". Дата: " . ConvertTimeStamp( strtotime($element["startTime"]), '"SHORT"'),
        "CODE" => "examen-random-code-" . rand(5, 1500),
        "PROPERTY_VALUES" => array(
                "SUBJECT" => $element["disciplineId"],
                "DATE_BEGIN" => ConvertTimeStamp( strtotime($element["startTime"]), 'FULL'),
                "DATE_END" => ConvertTimeStamp( strtotime($element["endTime"]), 'FULL'),
                "DATE_CANCEL" => ConvertTimeStamp( strtotime($element["startTime"]), '"SHORT"'),
                "DATE_ACCEPT" => ConvertTimeStamp( strtotime($element["startTime"]), '"SHORT"'),
                "NO_INTERVALS" => $element['isShared'] ? Array("VALUE" => 122) : null,
					 "LIMIT" => $element['limit'] ? $element['limit'] : null,
					 "STUDENT" => $element['students']
        )
    );

    $oElement = new CIBlockElement();
    $idElement = $oElement->Add($arFields, false, false, true); 

    if ($idElement){
        $succesInsert[] = $idElement;
    } else {
        $errorInsert = $idElement;
    }
}

    $subject = array();

    foreach ( $succesInsert as $item ){
        $query = CIBlockElement::GetList( 
                        array(), 
                        array( "=ID"=>$item), 
                            false, 
                            false, 
                            array(
                                "ID",
                                "ACTIVE",
                                "PROPERTY_SUBJECT",
                                "PROPERTY_DATE_BEGIN",
                                "PROPERTY_DATE_END",
                                "PROPERTY_NO_INTERVALS",
										  "PROPERTY_LIMIT",
										  "PROPERTY_STUDENT" )
                                );

        $res = $query->Fetch();

        $subject[]= [ 
            "id" => $res["ID"], 
            "active" => $res["ACTIVE"] == "Y"? true: false,
            "disciplineId" => $res["PROPERTY_SUBJECT_VALUE"],
            "startTime" => strtotime(ConvertDateTime($res["PROPERTY_DATE_BEGIN_VALUE"], "YYYY-MM-DD HH:MI:SS", "ru")) * 1000,
            "endTime" => strtotime(ConvertDateTime($res["PROPERTY_DATE_END_VALUE"], "YYYY-MM-DD HH:MI:SS", "ru")) * 1000,
            "isShared" => $res["PROPERTY_NO_INTERVALS_VALUE"] == "Да"? true: false,
            "limit" => $res["PROPERTY_LIMIT_VALUE"],
            "students" => $res["PROPERTY_STUDENT_VALUE"]
        ];
    }

    echo json_encode( $subject );

?>

