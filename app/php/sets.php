<?
try {
	$db = new PDO('mysql:host=localhost;dbname=Refinancement', 'root', 'root');
	$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
}catch (Exception $e){
	echo 'impossble de se connecter à la db ';
	echo $e->getMessage();
	die();
}


	$data = file_get_contents("php://input");
if (isset($data)) {
	$datatab = json_decode($data);
	foreach ($datatab->rates as $key => $value) {
		for($i=267;$i<268;$i++){
			$date = trim($allDataInSheet[$i]["A"]);
			$A = trim($allDataInSheet[$i]["B"]);
			$C = trim($allDataInSheet[$i]["C"]);
			$E = trim($allDataInSheet[$i]["D"]);
			$query = $query.", ('$date', $A, $C, $E)";
		}
		var_dump($query);
			$db->query($query);
			}

}
