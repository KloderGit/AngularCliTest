<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');
?>

<?php

$set_start_time = '21.02.2017 20:10:00';
$set_end_time = '21.02.2017 20:30:00';

	$el = new CIBlockElement;
	$PROP = array();
	$PROP[261] = $set_start_time;
	$PROP[264] = $set_end_time;

	$arLoadProductArray = Array(
		"MODIFIED_BY"    => $user_id,
		"IBLOCK_ID"      => 21,
		"PROPERTY_VALUES"=> $PROP
		);
	//echo json_encode($arLoadProductArray);
    
    $el->Update($ind,$arLoadProductArray);

	echo 'sdsadasd';
?>