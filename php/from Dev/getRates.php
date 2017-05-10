
<?php include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

   if (isset($_REQUEST)&&!empty($_REQUEST))
   {
        $arrayID = json_decode($_REQUEST["id"]);

        $filter = array(    "IBLOCK_ID" => 29, 
                            "PROPERTY_STUDENT" => $arrayID );

        $selectFields = array(  "ID",
                                "PROPERTY_EXAM",
                                "PROPERTY_STUDENT",
                                "PROPERTY_RATING" );

        $result = CIBlockElement::GetList( false, $filter, false, false, $selectFields);

        while ($res = $result->Fetch()) {
            $subjects[]= [ 
                "id" => $res["ID"], 
                "examenID" => $res["PROPERTY_EXAM_VALUE"],
                "studentID" => $res["PROPERTY_STUDENT_VALUE"],
                "rate" => $res["PROPERTY_RATING_VALUE"],
            ];
        }

        echo json_encode($subjects);


   } else {
        header("HTTP/1.0 404 Not Found");
        header("HTTP/1.1 404 Not Found");
        exit();
    }
?>