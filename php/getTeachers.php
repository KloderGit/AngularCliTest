<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');
?>

<?php

$filter = Array ( "GROUPS_ID" => Array(1,7,8) );
$rsUsers = CUser::GetList(($by="ID"), ($order="asc"), $filter);




    while ($res = $rsUsers->Fetch()){
        $subjects[]= [ 
            "id" => $res["ID"], 
            "name" => $res["LAST_NAME"] . ' ' . $res["NAME"] . ' ' . $res["SECOND_NAME"]
            ];
    }

    echo json_encode($subjects);
?>