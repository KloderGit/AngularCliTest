<? include($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");

session_start();
unset($_SESSION['TEACHER']);

if (isset($_POST['teachers_storage']) and !empty($_POST['teachers_storage']))
{
  $list = json_decode( $_POST['teachers_storage'] );
  teacher_html($list);
}
elseif (CSite::InGroup( array(7) ))
{ $list[] = $USER->GetID();
  teacher_html($list);
}

$_SESSION['TEACHER'] = serialize($list);

function teacher_html($teachers_for_list){
    foreach ($teachers_for_list as $techr_key => $techr_value) {
      $rsUser = CUser::GetByID($techr_value); $arUser = $rsUser->Fetch();
      $new_id = rand();?>
      <p data-id-teacher="<? echo $new_id; ?>">
        <label  for="<? echo $new_id; ?>"
                class="one_teacher">
                <? if (!empty($arUser['PERSONAL_PHOTO'])){
                    echo CFile::ShowImage($arUser['PERSONAL_PHOTO'], 100, 100, 'border=0', '', false);
                  } else { echo '<img src="http://data.ht/images/no-avatar.png" width="100" height="100" />'; }
                ?>
        </label>
         <input class="chbox_teacher" type="checkbox" name="Teachers" id="<? echo $new_id; ?>" value="<? echo $arUser['ID']; ?>" hidden="hidden" >
         <p><? echo $arUser["LAST_NAME"]." ".$arUser["NAME"]; ?></p>
      </p>
  <? }
  }
?>
