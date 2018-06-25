<?php include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

   if (isset($_REQUEST)&&!empty($_REQUEST))
   {
       $studentsIDs =  json_decode($_REQUEST["ids"]);
   } 

    $filter = array(    "IBLOCK_ID" => 21, 
                        "PROPERTY_STUDENT" => $studentsIDs);

    $order = array( "ID" => "ASC" );

    $selectFields = array(  "ID",
                            "ACTIVE",
                            "PROPERTY_SUBJECT",
                            "PROPERTY_DATE_BEGIN",
                            "PROPERTY_DATE_END",
                            "PROPERTY_NO_INTERVALS",
                            "PROPERTY_LIMIT" );

    $result = CIBlockElement::GetList( $order, $filter, false, false, $selectFields);


    while ($res = $result->Fetch()) {

        $cur_student = array();
        $db_props = CIBlockElement::GetProperty(21, $res["ID"], array("sort" => "asc"), Array("CODE"=>"STUDENT"));
        while ($ob = $db_props->GetNext())
        {
            if ($ob['VALUE']){
                $cur_student[] = $ob['VALUE'];
            }
        }

        $subjects[]= [ 
            "id" => $res["ID"], 
            "active" => $res["ACTIVE"] == "Y"? true: false,
            "disciplineId" => $res["PROPERTY_SUBJECT_VALUE"],
            "startTime" => strtotime(ConvertDateTime($res["PROPERTY_DATE_BEGIN_VALUE"], "YYYY-MM-DD HH:MI:SS", "ru")) * 1000,
            "endTime" => strtotime(ConvertDateTime($res["PROPERTY_DATE_END_VALUE"], "YYYY-MM-DD HH:MI:SS", "ru")) * 1000,
            "isShared" => $res["PROPERTY_NO_INTERVALS_VALUE"] == "Да"? true: false,
            "limit" => $res["PROPERTY_LIMIT_VALUE"],
            "students" => $cur_student
        ];
    }

    echo json_encode($subjects);
?>