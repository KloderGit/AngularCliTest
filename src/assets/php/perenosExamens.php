<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');

$data = json_decode(file_get_contents('php://input'), true);

$arrayID = array_map(
	function( $item ){
		return intval( $item["id"] );
	}, $data
);

if ( count($arrayID) < 1 )
{
	echo json_encode("Ошибка. Не получены экзамены для переноса");
	exit();
}

	$filter = array(
		"IBLOCK_ID" => 21, 
		"ID"=>$arrayID
	);

	$order = array( "PROPERTY_DATE_BEGIN" => "ASC" );

	$selectFields = array(
		"ID",
		"ACTIVE",
		"NAME",
		"PROPERTY_SUBJECT",
		"PROPERTY_DATE_BEGIN",
		"PROPERTY_DATE_END",
		"PROPERTY_NO_INTERVALS",
		"PROPERTY_LIMIT" 
	);

$query = CIBlockElement::GetList( $order, $filter, false, false, $selectFields);

$succesUpdate = array();
$errorUpdate = array();

  while( $res = $query->Fetch() ){

	$dataObject = $data[ array_search( $res["ID"], $arrayID ) ];

    $cur_student = array();
    $db_props = CIBlockElement::GetProperty(21, $res["ID"], 
		array("sort" => "asc"), 
		Array("CODE"=>"STUDENT")
	);

    while ($ob = $db_props->GetNext())
    {
        if ($ob['VALUE']){
            $cur_student[] = intval( $ob['VALUE'] );
        }
    }

	$el = new CIBlockElement;

	$PROP = array();
	$PROP[263] = $dataObject["disciplineId"];
	$PROP[261] = ConvertTimeStamp( strtotime( $dataObject["startTime"]), 'FULL' );			
	$PROP[264] = ConvertTimeStamp( strtotime( $dataObject["endTime"]), 'FULL' );
	$PROP[265] = ConvertTimeStamp( strtotime( $dataObject["startTime"]), 'SHORT' );
	$PROP[266] = ConvertTimeStamp( strtotime( $dataObject["startTime"]), 'SHORT' );
	$PROP[267] = $cur_student;
	$PROP[312] = $dataObject["isShared"] ? array("VALUE"=>"122") : null;
	$PROP[313] = $dataObject["limit"];

	$valuesArray = Array(
		"IBLOCK_ID"      => 21,
		"NAME" => $res["NAME"] . '. Перенесен на ' . ConvertTimeStamp( strtotime( $dataObject["startTime"]), 'SHORT' ),
		"PROPERTY_VALUES"=> $PROP
	);
    
    if( $el->Update($res["ID"], $valuesArray) ){
		$succesUpdate[] = $res["ID"];
	} else {
		$errorUpdate = $res["ID"];
	}
  }

  echo json_encode($succesUpdate);
?>