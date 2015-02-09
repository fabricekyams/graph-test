<?
try {
	$db = new PDO('mysql:host=ubuweb.alpha1.localt;dbname=c1phptest', 'c1phptest', '8j7wzF0x');
	//$db = new PDO('mysql:host=localhost;dbname=Refinancement', 'root', '');
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
	$query = "INSERT INTO rates (id, type, cap_pos, cap_neg, duration_min, duration_max, rate ) VALUES ";
	foreach ($datatab->rates as $key => $value) {
		///var_dump($value);
		$query = $query." ($value->id, '$value->type', $value->cap_pos, $value->cap_neg, $value->duration_min, $value->duration_max, $value->rate),";
	}
	$query = substr($query, 0, -1);
	$query = $query." ON DUPLICATE KEY UPDATE type=VALUES(type), cap_pos=VALUES(cap_pos), cap_neg=VALUES(cap_neg), duration_min=VALUES(duration_min), duration_max=VALUES(duration_max), rate=VALUES(rate)";
	

	if ($db->query($query)!= false){
		echo "Données sauvegardée";
	}else{
		echo "Erreur. Veuillez contacter Fabrice Kyams";
	}
	}

