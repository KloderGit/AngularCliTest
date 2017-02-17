<?
    if (isset($prepod) && !empty($prepod)){$filter_teaher = $prepod;} else {$filter_teaher = null;}

	//Получаем список предметов
	$filter=array("IBLOCK_ID"=>22, "PROPERTY_TEACHER"=>$filter_teaher, "ACTIVE"=>"Y" );
	$result = CIBlockElement::GetList(array("ID"=>"DESC"),$filter,false,false,array("ID","NAME","PROPERTY_TEACHER"));
	while ($res = $result->Fetch()){
		$user_info = CUser::GetByID($res[PROPERTY_TEACHER_VALUE])->Fetch();
		$subjects[$res[ID]]=["Title"=>$res[NAME], "Teacher" => $user_info["LAST_NAME"]." ".$user_info["NAME"]];
	}
?>
