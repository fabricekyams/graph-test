<?
	/************************ YOUR DATABASE CONNECTION START HERE   ****************************/

	try {
		$db = new PDO('mysql:host=localhost;dbname=Refinancement', 'root', 'root');
		$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
	}catch (Exception $e){
		echo 'impossble de se connecter à la db ';
		echo $e->getMessage();
		die();
	}
	/************************ YOUR DATABASE CONNECTION END HERE  ****************************/


	set_include_path(get_include_path() . PATH_SEPARATOR . 'Classes/');
	include 'PHPExcel/IOFactory.php';

// This is the file path to be uploaded.
	$inputFileName = 'discussdesk.xlsx'; 

	try {
		$objPHPExcel = PHPExcel_IOFactory::load($inputFileName);
	} catch(Exception $e) {
		die('Error loading file "'.pathinfo($inputFileName,PATHINFO_BASENAME).'": '.$e->getMessage());
	}


	$allDataInSheet = $objPHPExcel->getActiveSheet()->toArray(null,true,true,true);
$arrayCount = count($allDataInSheet);  // Here get total count of row in that Excel sheet
var_dump($arrayCount);
$query = "INSERT INTO ref_inds ( date, A, C, E ) VALUES('2022-05-05', 5, 5 , 5)";
for($i=267;$i<268;$i++){
	$date = trim($allDataInSheet[$i]["A"]);
	$A = trim($allDataInSheet[$i]["B"]);
	$C = trim($allDataInSheet[$i]["C"]);
	$E = trim($allDataInSheet[$i]["D"]);
	$query = $query.", ('$date', $A, $C, $E)";
}
var_dump($query);
	$db->query($query);
echo "<div style='font: bold 18px arial,verdana;padding: 45px 0 0 500px;'>".$msg."</div>";
