<?
try {
	$db = new PDO('mysql:host=localhost;dbname=Refinancement', 'root', '');
	$db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
}catch (Exception $e){
	echo 'impossble de se connecter à la db ';
	echo $e->getMessage();
	die();
}

if (isset($_GET['data'])) {
	if ($_GET['data'] == 'all') {
		$slect = $db->query("
		SELECT *
		FROM rates
		");
		$rates = $slect->fetchAll();

		echo json_encode($rates);
		# code...
	}
}
