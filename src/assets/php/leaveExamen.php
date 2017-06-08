<?php

define("STOP_STATISTICS", true);
define("PUBLIC_AJAX_MODE", true);
require_once($_SERVER["DOCUMENT_ROOT"] . "/bitrix/modules/main/include/prolog_before.php");

$query_params = json_decode(file_get_contents('php://input'), true);

if ( $query_params[id] > 0 && $query_params[student] > 0){
    $el = new CIBlockElement();
    $users = array();
    $db_props = $el->GetList(array("ID" => "ASC"), array("ID" => $query_params[id]), false, false, array("PROPERTY_STUDENT"));
    while ($ar_props = $db_props->Fetch()) {
        if ($ar_props["PROPERTY_STUDENT_VALUE"] != $query_params[student]) {
            $users[] = ($ar_props["PROPERTY_STUDENT_VALUE"]);
        }
    }

    if ($el->SetPropertyValueCode($query_params[id], "STUDENT", $users)) {
        echo json_encode('success');
        return;
    }
}

echo json_encode('error');