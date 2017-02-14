<?php include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

   if (isset($_REQUEST)&&!empty($_REQUEST))
   {
       $disciplineId = intval($_REQUEST["disciplineId"]);
       $year = intval($_REQUEST["year"]);
       $month = intval($_REQUEST["month"]);
   }

   $startDate = ConvertDateTime( '1.'.$month.'.'.$year, "YYYY-MM-DD") . " 00:00:00";
   $endDate = ConvertDateTime( '28.'.$month.'.'.$year, "YYYY-MM-DD") . " 00:00:00";

   echo $disciplineId, $startDate, $endDate ;

   $filter = array( "IBLOCK_ID" => 21, "PROPERTY_SUBJECT" => $disciplineId,
                    ">=PROPERTY_DATE_BEGIN" => $startDate, "<=PROPERTY_DATE_END" => $endDate );

    $result = CIBlockElement::GetList(array("PROPERTY_DATE_BEGIN" => "ASC"), $filter, false, false, array(
    "ID", "ACTIVE", "PROPERTY_SUBJECT", "PROPERTY_DATE_BEGIN",
    "PROPERTY_DATE_END", "PROPERTY_STUDENT"));

    while ($res = $result->Fetch()) {
        $array[] = $res;
    }

    echo '<pre>';
        print_r($array);
    echo '<pre>';
?>