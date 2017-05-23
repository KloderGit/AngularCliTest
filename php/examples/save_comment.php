<? include 'Tabloid.php';

   session_start();
   $tabloid = unserialize($_SESSION['tabloid']);

   if (isset($_REQUEST)&&!empty($_REQUEST))
   {
       $exam_id = intval($_REQUEST["examen"]);
       $student_id = intval($_REQUEST["student"]);
       $exam_rate = intval($_REQUEST["rate"]);
       $predmet_id = intval($_REQUEST["predmet"]);
       $comment_text = $_REQUEST["comment"];

       $examen_objects = $tabloid->selectExamensFromID($exam_id);
       $examenOO = array_filter($examen_objects, function($item){
           if ($item->getStudent()) { return true; } else { return false; }
       });
       foreach ($examenOO as $key => $value){
           if ($value->getStudent()->getStudentId() == $student_id) { $examen = $value; }
       }

       $student = $examen->getStudent();
       $predmet = $tabloid->getPredmets($predmet_id);

       // Название
       $title = $student->getStudentLastName()." ".$student->getStudentName().' '.$examen->getTime()->getFullDate();

       if ($exam_rate == 8) {$is_konsult = 1;}
       if ($exam_rate == 9) {$st_miss = 1;}
       if ($exam_rate == 10) {$tchr_miss = 1;}


       $arFields = array(
           "ACTIVE" => "Y",
           "IBLOCK_ID" => 28,
           "IBLOCK_SECTION_ID" => false,
           "NAME" => $title,
           "DETAIL_TEXT" => "Описание элемента",
           "PROPERTY_VALUES" => array(
             "EVENT_EXAMEN" => $examen->getExamenId(),
             "EVENT_OBJECT_ID" => $examen->getParentPredmet(),
             "EVENT_DATE" => strftime("%d.%m.%G", $examen->getTime()->getTimestamp()).' '.$examen->getTime()->getTime().':00',
             "EVENT_SUBJECT" =>$student->getStudentId(),
             "EVENT_IS_KONSULT" => $is_konsult,
             "EVENT_COMMENT" => $comment_text,
             "EVENT_MISSED_SUBJECT" => $st_miss,
             "EVENT_MISSED_PREPOD" => $tchr_miss,
             "EVENT_OBJECT_NAME" => $predmet->getTitle()
           )
        );

       $oElement = new CIBlockElement();

       if($idElement = $oElement->Add($arFields, false, false, true)) {
           echo 'yes';
       } else {
           echo 'Error: '.$oElement->LAST_ERROR;
       }
       //print_r($arFields);

   }

?>