<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');
?>

<?php

    $filter=array("IBLOCK_ID"=>22 );
    $order= array("ID"=>"ASC");
    $select_fields = array("ID", "ACTIVE", "NAME","PROPERTY_TEACHER","PROPERTY_FORM");
    $result = CIBlockElement::GetList($order,$filter,false,false,$select_fields);

    while ($res = $result->Fetch()){

        $subjects[]= [ 
            "id" => $res["ID"], 
            "title"=>$res["NAME"], 
            "teacherId" => $res["PROPERTY_TEACHER_VALUE"], 
            "active" => $res["ACTIVE"], 
            "format" => $res["PROPERTY_FORM_VALUE"] ];
    }

    echo json_encode($subjects);
?>