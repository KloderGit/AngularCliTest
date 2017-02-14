<?
    unset ($itg);

    include 'predmets.php';

    if (isset($view) && !empty($view)){$all = $view;} else {$all = 0;}
    if ($flag_for_complit) {$all = 2;}

  //Получаем список экзаменов
    $filter = array("IBLOCK_ID"=>21, "PROPERTY_STUDENT" => $filter_student, "ID" => $filter_exam, "ACTIVE"=>"Y");
    $result = CIBlockElement::GetList(array("PROPERTY_DATE_BEGIN"=>"ASC"),$filter,false,false,array(
              "ID","NAME","ACTIVE","PROPERTY_SUBJECT","PROPERTY_DATE_BEGIN",
              "PROPERTY_DATE_END","PROPERTY_STUDENT","PROPERTY_DATE_CANCEL",
              "PROPERTY_DATE_ACCEPT","PROPERTY_RATED"));

    while ($res = $result->Fetch())
    {
      switch($all){
        case '0' :
		    if (array_key_exists($res["PROPERTY_SUBJECT_VALUE"], $subjects))
			{$not_all = true;}
			else
			{$not_all = false;}

        break;
        case '1' :
          if (array_key_exists($res["PROPERTY_SUBJECT_VALUE"], $subjects) and !empty($res["PROPERTY_STUDENT_VALUE"])){
            $not_all = true;
          } else { $not_all = false; }
        break;
        case '2' :
        if (array_key_exists($res["PROPERTY_SUBJECT_VALUE"], $subjects)
            and !empty($res["PROPERTY_STUDENT_VALUE"])
            and !empty($res["PROPERTY_RATED_VALUE"]))
        {
          $not_all = true;
        } else { $not_all = false; }
        break;
      }



        if ($not_all){

        $user_info = CUser::GetByID($res["PROPERTY_STUDENT_VALUE"])->Fetch();
        if ($res["PROPERTY_RATED_VALUE"]>0) {$ocenka = $res["PROPERTY_RATED_VALUE"];} else {$ocenka = 0;}
        $user_old_id = $res["PROPERTY_STUDENT_VALUE"]; $res["PROPERTY_STUDENT_VALUE"] = $user_info["LAST_NAME"]." ".$user_info["NAME"];
        $itg[$subjects[$res["PROPERTY_SUBJECT_VALUE"]]["Title"]][date("d-m-Y", strtotime($res["PROPERTY_DATE_BEGIN_VALUE"]))][]=[
              'FullDate' => $res["PROPERTY_DATE_BEGIN_VALUE"],
              'Time' => date("G:i", strtotime($res["PROPERTY_DATE_BEGIN_VALUE"])),
              'Rate' => $ocenka,
              'FIO' => $res["PROPERTY_STUDENT_VALUE"],
              'Student_id' =>$user_old_id,
              'exam_id' => $res["ID"],
              'predmet_id' => $res["PROPERTY_SUBJECT_VALUE"]];
        }
      }
?>
