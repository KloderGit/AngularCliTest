<?php include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

    $objectsArray = json_decode(file_get_contents('php://input'), true);

    $succesDeleteID = array();
    $errorDeleteID = array();

    if (Count($objectsArray) < 1 )
    {
        $emptyArray = array();
        echo json_encode($emptyArray);    
        exit;
    }

    foreach ($objectsArray as $element) {
        if(CIBlockElement::Delete($element)){
            $succesDeleteID[] = $element;
        } else {
            $errorDeleteID[] = $element;
        }
    }

    echo json_encode($succesDeleteID);

?>
