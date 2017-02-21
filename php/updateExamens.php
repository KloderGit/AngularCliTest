<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');
?>

<?php

$data = json_decode(file_get_contents('php://input'), true);


	

//    if ($data)
//    {
//        echo json_encode($user);
//    }

$set_start_time = '21.02.2017 20:10:00';
$set_end_time = '21.02.2017 20:30:00';

// $ELEMENT_ID = 9068;  // код элемента
// $PROPERTY_CODE = 261;  // код свойства
// $PROPERTY_VALUE = $set_start_time;  // значение свойства

// // Установим новое значение для данного свойства данного элемента
// $ res = CIBlockElement::SetPropertyValuesEx($ELEMENT_ID, 21, array($PROPERTY_CODE => $PROPERTY_VALUE));

// echo $res;

// $res = CIBlockElement::GetByID(9068);
//  $end_result = $res->GetNext();

// $dbr = CIBlockElement::GetList(array("PROPERTY_*"), array("=ID"=>9068), false, false, array());


// if ($dbr_arr = $dbr->Fetch())
// {
//   $IBLOCK_ID = $dbr_arr["IBLOCK_ID"];
//   CIBlockElement::SetPropertyValues($ELEMENT_ID, $IBLOCK_ID, $PROPERTY_VALUE, $PROPERTY_CODE);
// }

// $arSelect = Array("ID", "IBLOCK_ID", "PROPERTY_*");//IBLOCK_ID и ID обязательно должны быть указаны, см. описание arSelectFields выше
// $arFilter = Array("IBLOCK_ID"=>IntVal($yvalue), "ACTIVE_DATE"=>"Y", "ACTIVE"=>"Y");
// $res = CIBlockElement::GetList(Array(), $arFilter, false, Array("nPageSize"=>50), $arSelect);
// while($ob = $res->GetNextElement()){ 
//  $arFields = $ob->GetFields();  
// print_r($arFields);
//  $arProps = $ob->GetProperties();
// print_r($arProps);
// }


//  echo '<pre>';

// 		print_r($dbr->Fetch());
//  echo '</pre>';

	// $el = new CIBlockElement;
	
	// $PROP = array();
	// 		$PROP[261] = $set_start_time;
	// 		$PROP[264] = $set_end_time;
	// 		$PROP[265] = $end_result["DATE_CANCEL"]["VALUE"];
	//         $PROP[266] = $end_result["DATE_ACCEPT"]["VALUE"];
	//         // $PROP[263] = $end_result["PROPERTY_SUBJECT_VALUE"];
	//         // $PROP[267] = $end_result["PROPERTY_STUDENT_VALUE"];
	//         // $PROP[312] = $end_result["PROPERTY_NO_INTERVALS_VALUE"];
	//         // $PROP[313] = $end_result["PROPERTY_LIMIT_VALUE"];
	// 		$arLoadProductArray = Array(
	// 			"MODIFIED_BY"    => $user_id,
	// 			"IBLOCK_ID"      => 21,
	// 			"PROPERTY_VALUES"=> $PROP
	// 			);
    
    // 			echo json_encode(array("res"=>$el->Update(9068,$arLoadProductArray)));


	// echo 'sdsadasd';
?>