<?php

require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
require_once 'excel.class.php';

CModule::IncludeModule('iblock');

if (isset($_REQUEST)&&!empty($_REQUEST))
{
	$disciplineId = intval($_REQUEST["disciplineId"]);
	$year = intval($_REQUEST["year"]);
	$month = intval($_REQUEST["month"]);
}

	$subjects=array();
	$itg = array();


	$filter=array("IBLOCK_ID"=>22, "ACTIVE"=>"Y");
	$result = CIBlockElement::GetList(array("ID"=>"DESC"),$filter,false,false,array("ID","NAME"));
	while ($res = $result->Fetch()){
		$subjects[$res[ID]]=$res[NAME];
	}


	if ($disciplineId == null || $year == null || $month == null)
	{
		$filter = array(    "IBLOCK_ID" => 21);
	} else {

		$startDateFilter = new DateTime($year . '-' . ($month+1) . '-' . '1 00:00:00');
		$endDateFilter = new DateTime( $year . '-' . ($month+1) . '-' . $startDate->format('t') . ' 23:59:00' );

		$filter = array(    "IBLOCK_ID" => 21, 
							"PROPERTY_SUBJECT" => $disciplineId,
							">=PROPERTY_DATE_BEGIN" => $startDate->format('Y-m-d H:i:s'),
							"<=PROPERTY_DATE_END" => $endDate->format('Y-m-d H:i:s') );
	}


	$result = CIBlockElement::GetList(array("PROPERTY_DATE_BEGIN"=>"ASC"),$filter,false,false,array("ID","NAME","ACTIVE","PROPERTY_SUBJECT","PROPERTY_DATE_BEGIN","PROPERTY_DATE_END","PROPERTY_STUDENT","PROPERTY_DATE_CANCEL","PROPERTY_DATE_ACCEPT","PROPERTY_RATED"));
	while ($res = $result->Fetch())
	{
		if ($res["PROPERTY_STUDENT_VALUE"]){
			if (array_key_exists($res["PROPERTY_SUBJECT_VALUE"], $subjects)) {
				$res["PROPERTY_SUBJECT_VALUE"] = $subjects[$res["PROPERTY_SUBJECT_VALUE"]];
			}
			$user_info = CUser::GetByID($res["PROPERTY_STUDENT_VALUE"])->Fetch(); 
			$res["PROPERTY_STUDENT_VALUE"] = $user_info["LAST_NAME"]." ".$user_info["NAME"];
			$itg[$res["PROPERTY_SUBJECT_VALUE"]][date("d-m-Y", strtotime($res["PROPERTY_DATE_BEGIN_VALUE"]))][]=[date("G:i:s", strtotime($res["PROPERTY_DATE_BEGIN_VALUE"])), $res["PROPERTY_RATED_VALUE"], $res["PROPERTY_STUDENT_VALUE"], $user_info["UF_SKYPE"], $user_info["EMAIL"], $user_info["PERSONAL_PHONE"]];
		}
	}

    $rrr = array();
    $excel_data = array();

	$excel_data[]=array( "EXAMEN"=>"Предмет",
						 "DATA"=>"Дата",
						 "TIME"=>"Время",
						 "STUDENT"=>"Студент",
						//  "OTMETKA"=>"Оценка",
						 "SKIPE"=>"Скайп",
						 "EMAIL"=>"Емаил",
						 "PHONE"=>"Телефон");

	foreach ($itg as $key => $value){
		foreach ($value as $key1 => $value1){
			foreach ($value1 as $key2 => $value2){
				$to_excel["EXAMEN"]=$key;
				$to_excel["DATA"]=$key1;
				$to_excel["TIME"]=$value2[0];
				$to_excel["STUDENT"]=$value2[2];
				// $to_excel["OTMETKA"]=$value2[1];
				$to_excel["SKYPE"]=$value2[3];
				$to_excel["EMAIL"]=$value2[4];
				$to_excel["PHONE"]=$value2[5];
				$excel_data[] = $to_excel;
			}
		}
	}



$myarray =  array (
       1 => array ("Oliver", "Peter", "Paul"),
            array ("Marlene", "Mica", "Lina")
    );

// echo "<pre>";
//      print_r($excel_data);
//  echo "</pre>";


$xls = new Excel_XML('UTF-8', false, "Коды активации");
$xls->addArray($excel_data);
$xls->generateXML("Examen");

?>
