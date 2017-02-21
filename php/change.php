<? include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 

if (isset($_POST)&&!empty($_POST))
{
	CModule::IncludeModule("iblock");

	if (isset($_POST["selTeacher"])&&!empty($_POST["selTeacher"])) {
	    $user_id=intval($_POST["selTeacher"]);    
	}
	else
	{
	    global $USER;
	    $user_id=$USER->GetID();
	}
	
	if ($_POST["act"]=="subject")
	{
		$stat = ($_POST["stat"]=="Y") ? "N" : "Y";
		$ind = intval($_POST["ind"]);
		$el = new CIBlockElement;
		echo $el->Update($ind,array("ACTIVE"=>$stat));
	}
	if ($_POST["act"]=="exam")
	{
		$ind = intval($_POST["ind"]);
		$el = new CIBlockElement;
		echo $el->Update($ind,array("ACTIVE"=>$stat));
	}
	if ($_POST["act"]=="del")
	{
		$ind = intval($_POST["ind"]);
		echo CIBlockElement::Delete($ind);
	}
	if ($_POST["act"]=="deacday")
	{
		$ind = intval($_POST["ind"]);
		$start_day = date("Y-m-d H:i:s",strtotime($_POST["deacday"]." 01:00:00"));
		$end_day = date("Y-m-d H:i:s",strtotime($_POST["deacday"]." 23:59:00"));
		$result = CIBlockElement::GetList(array("ID"=>"ASC"),array("IBLOCK_ID"=>21,">=PROPERTY_DATE_BEGIN"=>$start_day,"<=PROPERTY_DATE_END"=>$end_day,"PROPERTY_SUBJECT"=>$ind));
		$dates=$result->SelectedRowsCount();
		while ($res = $result->Fetch())
		{
			$el = new CIBlockElement;
			if ($el->Update($res["ID"],array("ACTIVE"=>"N"))) $dates--;
		}
		echo json_encode(array("res"=>$dates));
	}
	if ($_POST["act"]=="groupExam")
	{
		$ind = intval($_POST["ind"]);
		$limit = intval($_POST["limit"]);
		CIBlockElement::SetPropertyValuesEx($ind, false, array('NO_INTERVALS' => 122));
		CIBlockElement::SetPropertyValuesEx($ind, false, array('LIMIT' => $limit));
		echo $ind.' changed '.$limit;
	}
	if ($_POST["act"]=="time")
	{
		$ind=intval($_POST["ind"]);
		$result=CIBlockElement::GetByID($ind)->GetNextElement();
		$end_result=$result->GetProperties();
		$start_time = substr($end_result["DATE_BEGIN"]["VALUE"],0,10);
		$end_time = substr($end_result["DATE_END"]["VALUE"],0,10);
		$start=false;

	//Проверка свободного времени
		$check_date=date("Y-m-d H:i:s",strtotime($start_time." 01:00:00"));
	    $last_date=date("Y-m-d H:i:s",strtotime($end_time." 23:30:00"));
	    $dates=array();
	    $subjects=array();
	    $result=CIBlockElement::GetList(array("ID"=>"ASC"),array("IBLOCK_ID"=>22,"PROPERTY_TEACHER"=>$user_id),false,false,array("ID","NAME"));
	    while ($res=$result->Fetch()) {$subjects[$res["NAME"]]=$res["ID"];}

	    $filter=array("IBLOCK_ID"=>21,">=PROPERTY_DATE_BEGIN"=>$check_date,"<=PROPERTY_DATE_END"=>$last_date,"PROPERTY_SUBJECT"=>$subjects);
	    $result=CIBlockElement::GetList(array("ID"=>"ASC"),$filter,false,false,array("ID","PROPERTY_SUBJECT","PROPERTY_STUDENT","PROPERTY_DATE_END","PROPERTY_DATE_BEGIN"));

	    while ($res = $result->Fetch())
	    {
	        $res["subject"]=array_search($res["PROPERTY_SUBJECT_VALUE"], $subjects);
	        if ($res["ID"]!=$ind) $dates[]=$res;
	    }
	    $set_start_time = $start_time." ".$_POST["time"][0].":".$_POST["time"][1].":00";
        $set_end_time = $end_time." ".$_POST["time"][2].":".$_POST["time"][3].":00";
        $newDateTime = date_create($set_start_time);
        date_modify($newDateTime,"+1 minutes");
        $newEndDateTime = date_create($set_end_time);
        date_modify($newEndDateTime,"-1 minutes");
        $checking = "";
        foreach ($dates as $key => $value) {
        	$exDateTime = date_create($value["PROPERTY_DATE_BEGIN_VALUE"]);
            $exDateTime2 = date_create($value["PROPERTY_DATE_END_VALUE"]);
            $begTimeRes = false;
            $endTimeRes = false;
            if ($newDateTime>=$exDateTime&&$newDateTime<=$exDateTime2) {$begTimeRes=true;}
            if ($newEndDateTime>=$exDateTime&&$newEndDateTime<=$exDateTime2) {$endTimeRes=true;}
            if ($begTimeRes||$endTimeRes)
            {
                $checking.="Занято с ".substr($value["PROPERTY_DATE_BEGIN_VALUE"],11,5)." до ".substr($value["PROPERTY_DATE_END_VALUE"],11,5)." предметом: ".$value["subject"]." ";
            }
        }


		if (empty($checking)) {
			$el = new CIBlockElement;
			$PROP = array();
			$PROP[261] = $set_start_time;
			$PROP[264] = $set_end_time;
			$PROP[265] = $end_result["DATE_CANCEL"]["VALUE"];
	        $PROP[266] = $end_result["DATE_ACCEPT"]["VALUE"];
	        $PROP[263] = $end_result["SUBJECT"]["VALUE"];
	        $PROP[267] = $end_result["STUDENT"]["VALUE"];
	        $PROP[269] = $end_result["RATED"]["VALUE"];
	        $PROP[312] = $end_result['NO_INTERVALS']['VALUE'];
	        $PROP[313] = $end_result['LIMIT']['VALUE'];
			$arLoadProductArray = Array(
				"MODIFIED_BY"    => $user_id,
				"IBLOCK_ID"      => 21,
				"PROPERTY_VALUES"=> $PROP
				);
			//echo json_encode($arLoadProductArray);
			
			echo json_encode(array("res"=>$el->Update($ind,$arLoadProductArray)));
		}
		else echo json_encode(array("res"=>"no","txt"=>$checking));

	}
}
?>