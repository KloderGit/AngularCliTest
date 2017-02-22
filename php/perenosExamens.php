<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');

$data = json_decode(file_get_contents('php://input'), true);

$set_start_time = '21.02.2017 20:10:00';
$set_end_time = '21.02.2017 20:30:00';


$arrayID = array_map(
	function( $item ){
		// print_r($item);
		return intval( $item["id"] );
	}, $data
);

$query = CIBlockElement::GetList( array(), array( "ID"=>$arrayID ), false, false, 
    array(
        "ID",
        "ACTIVE",
        "PROPERTY_SUBJECT",
        "PROPERTY_DATE_BEGIN",
        "PROPERTY_DATE_END",
        "PROPERTY_NO_INTERVALS",
        "PROPERTY_LIMIT" )
        );

$succesUpdate = array();
$errorUpdate = array();

  while( $res = $query->Fetch() ){

	$dataObject = $data[ array_search( $res["ID"], $arrayID ) ];

    $cur_student = array();
    $db_props = CIBlockElement::GetProperty(21, $res["ID"], 
		array("sort" => "asc"), 
		Array("CODE"=>"STUDENT"));

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
	        $PROP[312] = $dataObject["isShared"];
	        $PROP[313] = $dataObject["limit"];

			$arLoadProductArray = Array(
				"IBLOCK_ID"      => 21,
				"PROPERTY_VALUES"=> $PROP
				);
    
    if( $el->Update($res["ID"], $arLoadProductArray) ){
		$succesUpdate[] = $res["ID"];
	} else {
		$errorUpdate = $res["ID"];
	}
  }

  echo json_encode($succesUpdate);
?>