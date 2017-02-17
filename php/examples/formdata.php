<?
define("NO_KEEP_STATISTIC", true);
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
CModule::IncludeModule('iblock');

$filter_student = $_POST['user'];
$filter_exam = $_POST['exam'];

//$filter_student = 906;
//$filter_exam = 5352;
$json_flag = 1;

  include 'examens.php';

    print_r (json_encode($itg));

  $filter_student = null;
  $filter_exam = null;
?>
