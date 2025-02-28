<html>
<head>
	<h1>CAJERO</h1>
</head>
<body>
<br>
<?php
//se inicilizan las variable, en este caso los billetes a repartir
$BC=0; $BV=0; $BD=0; $BC2=0; $BM=0;
//se introduce la cantidad a repartir con los billetes
$C= $_POST["C"];
$N=$C;
if ($N>=1000)
{
//se cuentan cuantos billetes de 50000 se necesitan
	while ($C>50000){
		$BC +=1;
		$C -=50000;};
//se cuentan cuantos billetes de 20000 se necesitan
	while ($C>20000){
		$BV +=1;
		$C -=20000;};
//se cuentan cuantos billetes de 10000 se necesitan
	while ($C>10000){
		$BD +=1;
		$C -=10000;};
//se cuentan cuantos billetes de 5000 se necesitan
	while ($C>5000){
		$BC2 +=1;
		$C -=5000;};
//se cuentan cuantos billetes de 1000 se necesitan
	while ($C>1000){
		$BV +=1;
		$C -=1000;};
}
//se calcula el resto que no puede ser repartido con los billetes disponibles
$resto=$C;
/*mensaje para saber cuantos billetes y de 
que tipo se usaran para repartir la cantidad*/
print  ("La cantidad de $N se debe repartir con:");?><br><br><br>
<?php print  ("$BC billetes de 50000, $BV billetes de 20000, $BD billetes de 10000, $BC2 billetes de 5000 y $BM billetes de 1000, quedando un resto de $resto");
?>
</body>
<html>
