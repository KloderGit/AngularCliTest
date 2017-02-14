<? include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

   if (isset($_REQUEST)&&!empty($_REQUEST))
   {
       global $USER;
       $exam_id = intval($_REQUEST["examen"]);
       $student_id = intval($_REQUEST["student"]);
       $exam_rate = intval($_REQUEST["rate"]);

       //новый инфоблок оценок
       $res=CIBlockElement::GetList(
           array('ID'=>'ASC'),
           array('IBLOCK_ID'=>RATES_IBLOCK_ID, 'PROPERTY_EXAM'=>$exam_id, 'PROPERTY_STUDENT'=>$student_id),
           false,
           false,
           array('ID')
       );
       if ($arFields=$res->GetNext()) {
           CIBlockElement::SetPropertyValuesEx($arFields['ID'],RATES_IBLOCK_ID,array("RATING"=>$exam_rate));
           echo "yes";
       } else {
           $el = new CIBlockElement;
           $PROP = array();
           $PROP[309] = $exam_id;
           $PROP[310] = $student_id;
           $PROP[311] = $exam_rate;
           $arLoadProductArray = Array( 
             "IBLOCK_ID"      => RATES_IBLOCK_ID,
             "PROPERTY_VALUES"=> $PROP,
             "NAME"           => $exam_id.'-'.$student_id,
             "ACTIVE"         => "Y"
           );
           $el->Add($arLoadProductArray);
           echo "yes";
       }
   }
?>