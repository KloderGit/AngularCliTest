
<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');

if (isset($_REQUEST)&&!empty($_REQUEST))
{
    $filter = json_decode($_REQUEST["students"]);

    // $rsUsers = CUser::GetList(($by="ID"), ($order="asc"), array('ID' => implode('|', $filter)), array( "ID", "NAME", "LAST_NAME", "SECOND_NAME", "UF_SKYPE", "PERSONAL_PHONE", "EMAIL") );
    $rsUsers = CUser::GetList(($by="ID"), ($order="asc"), array('ID' => implode('|', $filter)), array("SELECT" => array("UF_*") ) );
    

    while ($res = $rsUsers->Fetch()){
        $subjects[]= [ 
            "id" => $res["ID"], 
            "name" => $res["LAST_NAME"] . ' ' . $res["NAME"] . ' ' . $res["SECOND_NAME"],
            "skype" => $res["UF_SKYPE"],
            "phone" => $res["PERSONAL_PHONE"],
            "email" => $res["EMAIL"],
            "photo" => $res['PERSONAL_PHOTO'] ? 'http://' . $_SERVER['HTTP_HOST'] . CFile::GetPath($res['PERSONAL_PHOTO']) : 'http://data.ht/images/no-avatar.png'
        ];
    }
    echo json_encode($subjects);    
} 
else 
{
    header("HTTP/1.0 404 Not Found");
    header("HTTP/1.1 404 Not Found");
    exit();
}

?>