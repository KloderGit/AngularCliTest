
<?php include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

   if (isset($_REQUEST)&&!empty($_REQUEST))
   {
        $arrayID = json_decode($_REQUEST["id"]);

        $filter = array(    "IBLOCK_ID" => 28, 
                            "PROPERTY_EVENT_SUBJECT" => $arrayID );

        $selectFields = array( "ID", 
		  								"PROPERTY_EVENT_SUBJECT",
		  								"PROPERTY_EVENT_EXAMEN", 
										"PROPERTY_EVENT_OBJECT_ID", 
										"PROPERTY_EVENT_DATE",
										"PROPERTY_EVENT_IS_EXAMEN",
										"PROPERTY_EVENT_IS_KONSULT",
										"PROPERTY_EVENT_COMMENT",
										"PROPERTY_EVENT_IS_EXCELLENT_GRADE"
										);

        $result = CIBlockElement::GetList( false, $filter, false, false, $selectFields);

        while ($res = $result->Fetch()) {
            $subjects[]= [ 
                "id" => $res["ID"], 
					 "studentID" => $res["PROPERTY_EVENT_SUBJECT_VALUE"], 
                "examenID" => $res["PROPERTY_EVENT_EXAMEN_VALUE"],
                "disciplineID" => $res["PROPERTY_EVENT_OBJECT_ID_VALUE"],
                "date" => $res["PROPERTY_EVENT_DATE_VALUE"],
					 "isExamen" => $res["PROPERTY_EVENT_IS_EXAMEN_VALUE"],
					 "isConsult" => $res["PROPERTY_EVENT_IS_KONSULT_VALUE"],
					 "comment" => $res["PROPERTY_EVENT_COMMENT_VALUE"],
					 "excelent" => $res["PROPERTY_EVENT_IS_EXCELLENT_GRADE_VALUE"]
            ];
        }

        echo json_encode($subjects);

		// echo '<pre>';
		// 	print_r($subjects);
		// echo '<pre>';


   } else {
        header("HTTP/1.0 404 Not Found");
        header("HTTP/1.1 404 Not Found");
        exit();
    }
?>