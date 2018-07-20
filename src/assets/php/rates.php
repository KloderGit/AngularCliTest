<? include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php"); 
   CModule::IncludeModule("iblock");

    // echo '<pre>';
    //     print_r($elementID);
    // echo '</pre>';


$query = json_decode(file_get_contents('php://input'), true);

if (Count($query) < 1 )
{
    echo json_encode('[]');    
    exit;
}


    switch ($query['action']) {
        case 'add':         // { action: 'add', params: { examenID: any; studentID: any, value: any}}
            $examenID = intval( $query['params']['examenID'] );
            $studentID = intval( $query['params']['studentID'] );
            $rateValue = $query['params']['value'].'';

            $rate = new Rate();            
            echo json_encode( $rate->add($examenID, $studentID, $rateValue) );

            break;
        case 'edit':        // { action: 'edit', params: { itemID: any ; value: any}}
            $elementID = intval( $query['params']['itemID'] );
            $elementValue = intval( $query['params']['value'] );

            $rate = new Rate();
            $rate->id = $elementID;
            echo json_encode( $rate->edit( $elementValue ) );

            break;
        case 'delete':       // { action: 'delete', params: { itemID: any }}
            $elementID = intval( $query['params']['itemID'] );

            $rate = new Rate();
            $rate->id = $elementID;
            echo json_encode( $rate->delete() );
            break;            
    }





class Rate
{
    public $id;

    public function add($exam_id, $student_id, $exam_rate){

           $el = new CIBlockElement;
           $PROP = array();
           $PROP[309] = $exam_id;
           $PROP[310] = $student_id;
           $PROP[311] = $exam_rate;

           $arLoadProductArray = Array( 
             "IBLOCK_ID"      => 29,
             "PROPERTY_VALUES"=> $PROP,
             "NAME"           => $exam_id.'-'.$student_id,
             "ACTIVE"         => "Y"
           );

           $result = $el->Add($arLoadProductArray);

           if ($result){
               $this->id = $result;
               return $this->getSelfElement();
           }
    }

    public function edit( $value ) {
        $res = CIBlockElement::GetByID( $this->id );
        if($ar_res = $res->GetNext()){
            CIBlockElement::SetPropertyValuesEx( $this->id, 29, array("RATING"=> $value));
            return $this->getSelfElement();
        }
    }

    public function delete (){
        if(CIBlockElement::Delete($this->id)){
            return true;
        } else {
            return false;
        }
    }

    private function getSelfElement(){
        $filter = array(    "IBLOCK_ID" => 29, 
                            "ID" => $this->id );

        $selectFields = array(  "ID",
                                "PROPERTY_EXAM",
                                "PROPERTY_STUDENT",
                                "PROPERTY_RATING" );

        $result = CIBlockElement::GetList( false, $filter, false, false, $selectFields);

        while ($res = $result->Fetch()) {
            $subjects = [ 
                "id" => $res["ID"], 
                "examenID" => $res["PROPERTY_EXAM_VALUE"],
                "studentID" => $res["PROPERTY_STUDENT_VALUE"],
                "rate" => $res["PROPERTY_RATING_VALUE"],
            ];
        }

        return $subjects;
    }
}


?>