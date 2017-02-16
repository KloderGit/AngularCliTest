<?php include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

   if (isset($_REQUEST)&&!empty($_REQUEST))
   {
       $disciplineId = intval($_REQUEST["disciplineId"]);
       $year = intval($_REQUEST["year"]);
       $month = intval($_REQUEST["month"]);
   }


   $startDate = new DateTime($year . '-' . $month . '-1');
   $endDate = new DateTime( $year . '-' . $month . '-' . $startDate->format('t') );

   $filter = array( "IBLOCK_ID" => 21, "PROPERTY_SUBJECT" => $disciplineId,
                    ">=PROPERTY_DATE_BEGIN" => $startDate, "<=PROPERTY_DATE_END" => $endDate );

    $result = CIBlockElement::GetList(array("PROPERTY_DATE_BEGIN" => "ASC"), $filter, false, false, array(
    "ID", "ACTIVE", "PROPERTY_SUBJECT", "PROPERTY_DATE_BEGIN",
    "PROPERTY_DATE_END", "PROPERTY_STUDENT"));

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
            "active" => $res["ACTIVE"],
            "disciplineId" => $res["PROPERTY_SUBJECT_VALUE"],
            "startTime" => ConvertDateTime($res["PROPERTY_DATE_BEGIN_VALUE"], "YYYY-MM-DD HH:MI:SS", "ru"),
            "endTime" => ConvertDateTime($res["PROPERTY_DATE_END_VALUE"], "YYYY-MM-DD HH:MI:SS", "ru"),
            "students" => $cur_student
        ];
    }

    echo json_encode($subjects);
?>