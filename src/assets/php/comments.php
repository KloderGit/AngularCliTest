<? include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

$query = json_decode(file_get_contents('php://input'), true);

switch ($query['action']) {
    case 'add':         // { action: 'add', params: { object: {} }}
        $rate = new Comment(); 
        echo json_encode( $rate->add($query['params']['object']) );
        break;
    case 'edit':        // { action: 'edit', params: { itemID: any; value: { comment, isConsult, exelent } }}
        $elementID = intval( $query['params']['itemID'] );
        $elementComment = $query['params']['value']['comment'];
        $elementIsConsult = $query['params']['value']['isConsult'];
        $elementExelent = $query['params']['value']['excelent'];     

        $rate = new Comment();
        $rate->id = $elementID;
        echo json_encode( $rate->edit( $elementComment, $elementIsConsult, $elementExelent ) );
        break;
}







class Comment
{
    public $id;

    public function add( $object ){

        $el = new CIBlockElement;
        $PROP = array();
        $PROP[301] = intval( $object['examenID'] );
        $PROP[302] = intval( $object['disciplineID'] );
        $PROP[304] = ConvertTimeStamp( strtotime($object['date']), '"SHORT"');

        if ($object['isConsult'] == 'true' ) { $PROP[297] = 1; }
        if ($object['isConsult'] == 'false' ) { $PROP[297] = 0; }        

        if ($object['excelent'] == 'true' ) { $PROP[373] = 1; }
        if ($object['excelent'] == 'false' ) { $PROP[373] = 0; }

        $PROP[295] = intval( $object['studentID'] );
        $PROP[294] = $object['comment'];       

           $arLoadProductArray = Array( 
             "IBLOCK_ID"      => 28,
             "PROPERTY_VALUES"=> $PROP,
             "NAME"           => 'Комментарий' . ' ' . $object['examenID'] . ' ' . $object['studentID'],
             "ACTIVE"         => "Y"
           );

        // echo '<pre>';
        //     print_r($arLoadProductArray);
        // echo '<pre>';           

           $result = $el->Add($arLoadProductArray);

           if ($result){
               $this->id = $result;
               return $this->getSelfElement();
           }        
    }

    public function edit( $comment, $isConsult, $excelent ) {

        $arField = [];
        if ($comment) { $arField["EVENT_COMMENT"] = $comment; }

        if ($isConsult == 'true' ) { $arField["EVENT_IS_KONSULT"] = 1; }
        if ($isConsult == 'false' ) { $arField["EVENT_IS_KONSULT"] = 0; }        

        if ($excelent == 'true' ) { $arField["EVENT_IS_EXCELLENT_GRADE"] = 1; }
        if ($excelent == 'false' ) { $arField["EVENT_IS_EXCELLENT_GRADE"] = 0; }

        $res = CIBlockElement::GetByID( $this->id );
        if($ar_res = $res->GetNext()){
            CIBlockElement::SetPropertyValuesEx( $this->id, 28, $arField );
            return $this->getSelfElement();
        }
    }

    private function getSelfElement(){
        $filter = array(    "IBLOCK_ID" => 28, 
                            "ID" => $this->id );
        $selectFields = array(  "ID", 
		  						"PROPERTY_EVENT_SUBJECT",
		  						"PROPERTY_EVENT_EXAMEN", 
								"PROPERTY_EVENT_OBJECT_ID", 
								"PROPERTY_EVENT_DATE",
								"PROPERTY_EVENT_IS_EXAMEN",
								"PROPERTY_EVENT_IS_KONSULT",
								"PROPERTY_EVENT_COMMENT",
								"PROPERTY_EVENT_IS_EXCELLENT_GRADE"
							);

        $result = CIBlockElement::GetList( false, $filter, false, false, $selectFields);

        while ($res = $result->Fetch()) {
            $subjects[]= [ 
                    "id" => $res["ID"], 
					"studentID" => $res["PROPERTY_EVENT_SUBJECT_VALUE"], 
                    "examenID" => $res["PROPERTY_EVENT_EXAMEN_VALUE"],
                    "disciplineID" => $res["PROPERTY_EVENT_OBJECT_ID_VALUE"],
                    "date" => $res["PROPERTY_EVENT_DATE_VALUE"],
					"isExamen" => $res["PROPERTY_EVENT_IS_EXAMEN_VALUE"],
					"isConsult" => $res["PROPERTY_EVENT_IS_KONSULT_VALUE"],
					"comment" => $res["PROPERTY_EVENT_COMMENT_VALUE"],
					"excelent" => $res["PROPERTY_EVENT_IS_EXCELLENT_GRADE_VALUE"]
            ];
        }
        return $subjects;
    }

}




?>