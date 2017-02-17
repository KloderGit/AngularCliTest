<?
require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/header.php");
$APPLICATION->SetTitle("Результаты");
?>
<div class="center clearfix">
    <? $APPLICATION->ShowViewContent("underbreadcrumb"); ?>	
</div>
 <?$APPLICATION->IncludeComponent(
	"andrix:exam.results", 
	".default", 
	array(
		"AJAX_MODE" => "Y",
		"AJAX_OPTION_JUMP" => "N",
		"AJAX_OPTION_STYLE" => "Y",
		"AJAX_OPTION_HISTORY" => "N",
		"CACHE_TYPE" => "A",
		"CACHE_TIME" => "36000000",
		"CACHE_FILTER" => "N",
		"CACHE_GROUPS" => "Y",
		"AJAX_OPTION_ADDITIONAL" => ""
	),
	false
);?>
<? require($_SERVER["DOCUMENT_ROOT"] . "/bitrix/footer.php"); ?>