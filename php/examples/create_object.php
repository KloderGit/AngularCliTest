<?
include 'Tabloid.php';

session_start();


if (isset($_POST['teacher']) and !empty($_POST['teacher'])){
  $teacher_id = json_decode($_POST['teacher']);
  $tabloid = new Tabloid($teacher_id);
  $_SESSION['tabloid'] = serialize($tabloid);
  echo "1";
 }
  else
 { echo "0"; }

?>
