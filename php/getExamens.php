<?php
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');
?>

<?php
        $filter=array("IBLOCK_ID"=>22 );
        $order= array("ID"=>"ASC");
        $select_fields = array("ID", "ACTIVE", "NAME","PROPERTY_TEACHER");
        $result = CIBlockElement::GetList($order,$filter,false,false,$select_fields);

        while ($res = $result->Fetch()){
            $p = new Predmet();
            $p->setPredmetId($res['ID']);
            $p->setTitle($res['NAME']);
            $p->setActive($res['ACTIVE']);
            $user_info = CUser::GetByID($res['PROPERTY_TEACHER_VALUE'])->Fetch();
            $p->setTeacherId($user_info["ID"]);
            $p->setTeacher(Tabloid::mb_ucwords(strtolower($user_info["LAST_NAME"]." ".$user_info["NAME"])));

            if (in_array($p->getTeacherId(), $teacher)) { $p->PredmetPrepare(); }

            $this->addPredmet($p);
        }
?>