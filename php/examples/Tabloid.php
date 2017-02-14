<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');

//setlocale(LC_ALL, 'ru_RU.UTF-8');

class Tabloid
{
    private $Predmets=array();

    function __construct($teacher) {
        //$teacher[] = 9;
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
    }

    // Выбор всех или конкретного предмета
    public function getPredmets( $value ) { 
        if (isset($value) and !empty($value)){
           return $this->Predmets[$value];
        } else {
           return $this->Predmets;
        }
    }
    public function addPredmet( $value ) { $this->Predmets[$value->getPredmetId()] = $value; }


    public function selectExamensFromID( $value ){

        $examens = array();
        if (isset($value) and !empty($value)) {            
        
            foreach ($this->getPredmets() as $Predmet_Key => $Predmet_Object){
                foreach ($Predmet_Object->getPredmetDates() as $DatePredmet_Key => $DatePredmet_Object){
                    foreach($DatePredmet_Object->getExamens() as $Examens_Key => $Examens_Object){
                        if ($Examens_Object->getExamenId() == $value){
                            $examens[] = $Examens_Object;
                        }
                    }
                }
            }
            
            return $examens;
        } 

    }

    public static function mb_ucwords($str) { return mb_convert_case($str, MB_CASE_TITLE, "UTF-8"); }
}

class Predmet
{
    private $Title;
    private $PredmetId;
    private $Teacher;
    private $TeacherId;
    private $Active;

    private $PredmetDate = array();

    public function getPredmetId($value) { return $this->PredmetId; }
    public function setPredmetId($value) {  $this->PredmetId = $value; }

    public function getTitle() { return $this->Title; }
    public function setTitle($value) { $this->Title = $value; }

    public function getTeacher() { return $this->Teacher; }
    public function setTeacher($value) { $this->Teacher = $value; }

    public function getTeacherId() { return $this->TeacherId; }
    public function setTeacherId($value) { $this->TeacherId = $value; }

    public function getActive() { return $this->Active; }
    public function setActive($value) { $this->Active = $value; }

    public function getPredmetDates() { return $this->PredmetDate; }
    public function addPredmetDate($value) { $this->PredmetDate[] = $value; }

    public function getMonth() {
        $month =array();
        foreach ($this->getPredmetDates() as $date_key => $date_object){
            $month[$date_object->getDate()->getMonthCount()] = $date_object->getDate()->getMonthName();
        }
        return $month;
    }

    public function PredmetPrepare(){

        // Подготовка Дат \ Экзаменов\ Студентов


        // Все экзамены предмета скопом
        $filter=array("IBLOCK_ID"=>21, "PROPERTY_SUBJECT" => $this->getPredmetId());
        $order= array("PROPERTY_DATE_BEGIN"=>"ASC");
        $select_fields = array("ID", "ACTIVE", "PROPERTY_DATE_BEGIN", "PROPERTY_DATE_CANCEL", "PROPERTY_DATE_ACCEPT", "PROPERTY_NO_INTERVALS", "PROPERTY_LIMIT", "PROPERTY_SUBJECT" );
    
        $result = CIBlockElement::GetList($order, $filter, $select_fields);

        // Сюда загрузим данные для последующего разбора, вид array[Дата][ид]  (!!!Если экзамене не принадлежит 2 предметам)
        $array_all = array();   

        while ($res = $result->Fetch())
        {
            $array_all[date("d-m-Y", strtotime($res["PROPERTY_DATE_BEGIN_VALUE"]))][$res["ID"]] = $res;
        }


        // Первый создает Даты предмета, второй принадлежащие ему экзамены,
        // за счет того что они все перенеслись под первый ключ
        foreach ($array_all as $itemDate => $itemArray) {

            // Предмет из первого ключа
            $d = new DataPredmet();
            $d->setDate(new xDate($itemDate));
            $d->setParentID($this->getPredmetId());

                // Перебираем строки выборки
                foreach ($itemArray as $itemKey => $itemValue){

                    // Из каждой строки получаем список студентов
                    $cur_student = array();
                    $db_props = CIBlockElement::GetProperty(21, $itemValue["ID"], array("sort" => "asc"), Array("CODE"=>"STUDENT"));
                    while ($ob = $db_props->GetNext())
                    {
                        if ($ob['VALUE']){
                            $cur_student[] = $ob['VALUE'];
                        }
                    }

                    // Из каждой строки получаем свойство - сколько может быть у экзамена студентов
                    $cur_limit = $itemValue["PROPERTY_LIMIT_VALUE"];

                    // Проверяем, указано ли в строке что экзамен груповой 
                    if (isset($cur_limit) and !empty($cur_limit)){
                        
                    // Если групповой то создаем столько объектов экзамена, сколько заявлено в PROPERTY_LIMIT
                        for ($cur_limit; $cur_limit >= 1; $cur_limit--){

                            // Для каждого создаваемого групового экзамена, вытаскиваем одного студента из масива студентов
                            // Студентов (теоретически) не больше чем LIMIT
                            $stud = array_pop($cur_student);

                            $ex = new Examen();
                            $ex->setTime(new xDate($itemValue["PROPERTY_DATE_BEGIN_VALUE"]));
                            $ex->setActive($itemValue["ACTIVE"]);
                            $ex->setExamenId($itemValue["ID"]);
                            $ex->setParentPredmet($itemValue["PROPERTY_SUBJECT_VALUE"]);
                            $ex->setCancel(new xDate($itemValue["PROPERTY_DATE_CANCEL_VALUE"]));
                            $ex->setAccept(new xDate($itemValue["PROPERTY_DATE_ACCEPT_VALUE"]));
                            $ex->setInterval($itemValue["PROPERTY_NO_INTERVALS_VALUE"]);
                            $ex->setLimit($itemValue["PROPERTY_LIMIT_VALUE"]);


                            // Если студент вылупился из масива студентов (не пустое значение), то создаем студента и пихаем в экзамен
                            if (isset($stud) and !empty($stud)){
                                $info = CUser::GetByID($stud)->Fetch();
                                if (isset($info) and !empty($info)){
                                    $newStudent = new Student();
                                    $newStudent->setStudentId($info['ID']); 
                                    $newStudent->setStudentName(ucwords(strtolower($info['NAME'])));
                                    $newStudent->setStudentLastName(ucwords(strtolower($info['LAST_NAME'])));
                                    $newStudent->setStudentPhone($info['PERSONAL_PHONE']);
                                    $newStudent->setStudentSkype($info['UF_SKYPE']);
                                    $newStudent->setStudentEmail($info['EMAIL']);    
                                    
                                    $ex->setStudent($newStudent);
                                }
                            }
                            $d->addExamens($ex);
                        }

                    //  Если же в строке указана запись не групового экзамена, то создаем 1 экзамен
                    } else {
                        $ex = new Examen();
                        $ex->setTime(new xDate($itemValue["PROPERTY_DATE_BEGIN_VALUE"]));
                        $ex->setActive($itemValue["ACTIVE"]);
                        $ex->setExamenId($itemValue["ID"]);
                        $ex->setParentPredmet($itemValue["PROPERTY_SUBJECT_VALUE"]);
                        $ex->setCancel(new xDate($itemValue["PROPERTY_DATE_CANCEL_VALUE"]));
                        $ex->setAccept(new xDate($itemValue["PROPERTY_DATE_ACCEPT_VALUE"]));
                        $ex->setInterval($itemValue["PROPERTY_NO_INTERVALS_VALUE"]);
                        $ex->setLimit($itemValue["PROPERTY_LIMIT_VALUE"]);

                    // И создаем 1го студента, если свойство студентов было не пусто. $stud = array_pop($cur_student) - вытащит 1 значение
                        if (isset($cur_student) and !empty($cur_student)){
                            $stud = array_pop($cur_student);
                            $info = CUser::GetByID($stud)->Fetch();
                            if (isset($info) and !empty($info)){            // Если студент существует в системе то сохдаем (не удален например)
                                $newStudent = new Student();
                                $newStudent->setStudentId($info['ID']); 
                                $newStudent->setStudentName(ucwords(strtolower($info['NAME'])));
                                $newStudent->setStudentLastName(ucwords(strtolower($info['LAST_NAME'])));
                                $newStudent->setStudentPhone($info['PERSONAL_PHONE']);
                                $newStudent->setStudentSkype($info['UF_SKYPE']);
                                $newStudent->setStudentEmail($info['EMAIL']);

                                $ex->setStudent($newStudent);
                            }
                        }
                        $d->addExamens($ex);
                    }
                }
                $this->addPredmetDate($d);
        }
    }
}


class DataPredmet
{
    private $selfDate;
    private $ParentID;
    private $Active;

    private $Examens = array();

    public function getDate() { return $this->selfDate; }
    public function setDate($value) { $this->selfDate = $value; }

    public function getParentID() { return $this->ParentID; }
    public function setParentID($value) { $this->ParentID = $value; }

    public function getActive() { return $this->Active; }
    public function setActive($value) { $this->Active = $value; }

    public function getExamens() { return $this->Examens; }
    public function addExamens($value) { $this->Examens[] = $value; }

    public function ExamenCount(){ return count($this->Examens); }

    public function ExamenInvite(){
        $invite = array_filter($this->Examens, 
            function ($item){ 
                if ($item->getStudent()){ 
                    return  true; 
                } else { 
                    return false; 
                } 
            });
        return count($invite);
    }
}


class Examen
{
    private $ExamenId;
    private $Time;
    private $Active;
    private $ParentPredmet;
    private $toAccept;
    private $toCancel;
    private $Interval;
    private $StudentLimit;

    private $Student;

    public function getTime() { return $this->Time; }
    public function setTime($value) { $this->Time = $value; }

    public function getExamenId() { return $this->ExamenId; }
    public function setExamenId($value) { $this->ExamenId = $value; }

    public function getAccept() { return $this->toAccept; }
    public function setAccept($value) { $this->toAccept = $value; }

    public function getParentPredmet() { return $this->ParentPredmet; }
    public function setParentPredmet($value) { $this->ParentPredmet = $value; }

    public function getCancel() { return $this->toCancel; }
    public function setCancel($value) { $this->toCancel = $value; }

    public function getInterval() { return $this->Interval; }
    public function setInterval($value) { $this->Interval = $value; }

    public function getLimit() { return $this->StudentLimit; }
    public function setLimit($value) { $this->StudentLimit = $value; }
    
    public function getActive() { return $this->Active; }
    public function setActive($value) { $this->Active = $value; }

    public function setStudent( $value ) { $this->Student = $value; }
    public function getStudent() { return $this->Student; }
}

class Student
{
    private $StudentName;
    private $StudentLastName;
    private $StudentOtchestvo;
    private $StudentId;
    private $StudentPhone;
    private $StudentSkype;
    private $StudentEmail;

    private $Rates = array();
    private $Comment = array();

    public function getStudentName() { return $this->StudentName; }
    public function setStudentName($value) { $this->StudentName = $value; }

    public function getStudentLastName() { return $this->StudentLastName; }
    public function setStudentLastName($value) { $this->StudentLastName = $value; }

    public function getStudentFIO() { return $this->StudentLastName.' '.$this->StudentName; }
    public function setStudentOtchestvo($value) { $this->StudentOtchestvo = $value; }

    public function getStudentId() { return $this->StudentId; }
    public function setStudentId($value) { $this->StudentId = $value;}

    public function getStudentPhone() { return $this->StudentPhone; }
    public function setStudentPhone($value) { $this->StudentPhone = $value; }

    public function getStudentSkype() { return $this->StudentSkype; }
    public function setStudentSkype($value) { $this->StudentSkype = $value; }

    public function getStudentEmail() { return $this->StudentEmail; }
    public function setStudentEmail($value) { $this->StudentEmail = $value; }

    // Получить комменты по предмету либо, если установлен $triger получаем комменты не принадлежащие предмету.
    public function getCommentsOfPredmet($predmet, $triger) {
        if (isset($predmet) and !empty($predmet)) {
            if (isset($triger) and !empty($triger) and $triger != 0){
                foreach ($this->Comment as $comment_key => $comment_object){
                    if ($comment_object->getCommentPredmet() != $predmet){
                        $comments_arr[] = $comment_object;
                    }
                }                
            } else {
                foreach ($this->Comment as $comment_key => $comment_object){
                    if ($comment_object->getCommentPredmet() == $predmet){
                        $comments_arr[] = $comment_object;
                    }
                }
            }
            return $comments_arr;

        } else {
            return $this->Comment;
        }  
    }

    public function getCommentsOfExamen($examen){
        if (isset($examen) and !empty($examen)) {
            foreach ($this->getComment() as $key => $comment_item){
                if ($comment_item->getCommentExamen() == $examen) { return $comment_item; } 
            }
        }
    }

    public function getComment(){ return $this->Comment; }

    public function LoadComments() {	
        $filter = array("IBLOCK_ID"=>28, "PROPERTY_EVENT_SUBJECT" => $this->StudentId);
        $order = array("ID"=>"ASC");
        $fields = array( "ID", "ACTIVE", "PROPERTY_EVENT_EXAMEN", "PROPERTY_EVENT_OBJECT_ID", "PROPERTY_EVENT_OBJECT_NAME",
                "PROPERTY_EVENT_DATE", "PROPERTY_EVENT_RATE", "PROPERTY_EVENT_IS_EXAMEN", "PROPERTY_EVENT_IS_KONSULT", "PROPERTY_EVENT_COMMENT",  "PROPERTY_EVENT_MISSED_SUBJECT",
                "PROPERTY_EVENT_MISSED_PREPOD");

        $result = CIBlockElement::GetList($order,$filter,false,false,$fields);


        while ($res = $result->Fetch())
        {
            $newComments[$res["PROPERTY_EVENT_OBJECT_ID_VALUE"]] [$res["PROPERTY_EVENT_EXAMEN_VALUE"]] [] = $res;
        }

        foreach ($newComments as $predmet_key => $examen_array){
            foreach ($examen_array as $array_key => $examen_row){
                $cc = new Comment();
                foreach ($examen_row as $key => $examen_object){
                    $cc->setCommentId($examen_object["ID"]);
                    $cc->setCommentPredmet($predmet_key);
                    $cc->setCommentExamen($examen_object["PROPERTY_EVENT_EXAMEN_VALUE"]);
                    if (!empty($examen_object["PROPERTY_EVENT_IS_KONSULT_VALUE"])){
                        $cc->setisKonsult($examen_object["PROPERTY_EVENT_IS_KONSULT_VALUE"]);
                    }
                    if (!empty($examen_object["PROPERTY_EVENT_MISSED_SUBJECT_VALUE"])){
                        $cc->setStudentMissed($examen_object["PROPERTY_EVENT_MISSED_SUBJECT_VALUE"]);
                    }
                    if (!empty($examen_object["PROPERTY_EVENT_MISSED_PREPOD_VALUE"])){
                        $cc->setPerenos($examen_object["PROPERTY_EVENT_MISSED_PREPOD_VALUE"]);
                    }

                    $cc->setCommentData($examen_object["PROPERTY_EVENT_DATE_VALUE"]);
                    
                    if (!empty($examen_object["PROPERTY_EVENT_COMMENT_VALUE"])){
                        $cc->addNewComment($examen_object["PROPERTY_EVENT_COMMENT_VALUE"]);
                    }
                }

                if ($cc->getisKonsult() || $cc->getPerenos() || $cc->getStudentMissed() || count($cc->getCommentText())>0){
                    $this->Comment[]=$cc;
                }
            }
        }
    }

    public function LoadRates(){
        $filter = array("IBLOCK_ID"=>29, "PROPERTY_STUDENT" => $this->StudentId);
        $result = CIBlockElement::GetList(array("ID"=>"ASC"),$filter,false,false,array( "ID", "ACTIVE", "PROPERTY_EXAM", "PROPERTY_RATING"));

        while ($res = $result->Fetch())
        {
            $this->Rates[$res["PROPERTY_EXAM_VALUE"]] = $res["PROPERTY_RATING_VALUE"];
        }
    }

    public function getRate( $value ){
        if (isset($value) and !empty($value)) {
            if (!empty($this->Rates[$value])) {return $this->Rates[$value];} ;
        } else {
            return $this->Rates;
        }
    }
}

class Comment
{
    private $CommentId;
    private $CommentPredmet;
    private $CommentExamen;
    private $isKonsult;
    private $StudentMissed;
    private $Perenos;
    private $CommentData;

    private $comment_text=array();

    public function getCommentId() { return $this->CommentId; }
    public function setCommentId($value) { $this->CommentId = $value; }
    
    public function getCommentPredmet() { return $this->CommentPredmet; }
    public function setCommentPredmet($value) { $this->CommentPredmet = $value; }

    public function getCommentExamen() { return $this->CommentExamen; }
    public function setCommentExamen($value) { $this->CommentExamen = $value; }

    public function getCommentData() { return $this->CommentData; }
    public function setCommentData($value) { $this->CommentData = $value; }

    public function getisKonsult() { return $this->isKonsult; }
    public function setisKonsult($value) { $this->isKonsult = $value; }

    public function getStudentMissed() { return $this->StudentMissed; }
    public function setStudentMissed($value) { $this->StudentMissed = $value; }

    public function getPerenos() { return $this->Perenos; }
    public function setPerenos($value) { $this->Perenos = $value; }

    public function addNewComment($value) { $this->comment_text[] = $value; }
    public function getCommentText() { return $this->comment_text; }
}

class xDate{

    private $Timestamp;

    function __construct($date) {
        $this->Timestamp = strtotime($date);
    }

    public function getMonthName(){
        return strftime("%B", $this->Timestamp);
    }

    public function getMonthCount(){
        return strftime("%m", $this->Timestamp);
    }

    public function getFullDate(){
        return strftime("%d-%m-%G", $this->Timestamp);
    }

    public function getShortDate(){
        return strftime("%d-%B", $this->Timestamp);
    }

    public function getWeekDay(){
        return strftime("%A", $this->Timestamp);
    }

    public function getTime(){
        return strftime("%H:%M", $this->Timestamp);
    }

    public function getTimestamp(){
        return $this->Timestamp;
    }
}

?>
