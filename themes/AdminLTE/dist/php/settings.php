<?php
include("../../../../includes/helpers.php");
include("db.class.php");

// start ogp session
startSession();

// initialize dbclass
$ThemeDB = new ThemeDB;
$ThemeDB->settingsTable = $ThemeDB->tablePrefix().'adminlte_settings';

// declarations
$isadmin = false;
$uploadsFolder = dirname(__FILE__).'/uploads';


// check if uploads folder exists and create if not
if(!file_exists($uploadsFolder))
{
	mkdir($uploadsFolder, 0644, true);
}

// check if theme settings db exists and create if not
$sql = 'show tables like "'.$ThemeDB->settingsTable.'"';
if(empty($ThemeDB->query($sql)))
{
	// create settings table
	$query = "
	CREATE TABLE ".$ThemeDB->settingsTable." (
		id int(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
		user int(4) NOT NULL,
		name varchar(255) NOT NULL,
		value mediumtext NOT NULL,
		UNIQUE KEY UniqueSetting (user,name)
	);
	";
	$ThemeDBCreate = $ThemeDB->query($query);
	
	if($ThemeDBCreate===true)
	{
		// echo 'table "'.$ThemeDB->settingsTable.'" successfully created';
	}
	else
	{
		// error
		echo "<pre>";
		print_r($ThemeDBCreate);
		echo "</pre>";
	}
}


// check if user session exists
if(isset($_SESSION['users_group']))
{
	// set admin
	if($_SESSION['users_group']=='admin')
	{
		$isadmin = true;
	}
	
	if(isset($_GET['m']))
	{
		if(isset($_GET['m'])=='dashboard')
		{
			if(isset($_GET['p']) && ($_GET['p']=='columnsettings'))
			{
				$columns = $ThemeDB->getSetting('dashboard_columns');
				if(empty($columns))
				{
					// no column settings available, set default settings
					$newColumns = array();
					// select remote server
					$newColumns[] = array('item' => 'item6', 'section' => 'column4', 'collapsed' => 0);
					// server status
					$newColumns[] = array('item' => 'item7', 'section' => 'column5', 'collapsed' => 0);
					// process monitor
					$newColumns[] = array('item' => 'item8', 'section' => 'column6', 'collapsed' => 0);
					// server status
					$newColumns[] = array('item' => 'item9', 'section' => 'column4', 'collapsed' => 0);
					
					// write to db
					$setSetting = $ThemeDB->setSetting('dashboard_columns', $newColumns);
					
					$columns = $newColumns;
				}
				
				header("Content-Type: application/json");
				echo json_encode($columns);
				exit();
			}
			elseif(isset($_GET['p']) && ($_GET['p']=='updatecolumnsettings'))
			{
				// only allow new generated items from theme
				$allowedItems = array('item6', 'item7', 'item8', 'item9');
				
				// decode all items
				$items = json_decode($_POST['data'], 1)['items'];
				
				// specify new columns
				$newColumns = array();
				
				foreach($items AS $item)
				{
					if(in_array($item['id'], $allowedItems))
					{
						$newColumns[] = array('item' => $item['id'], 'section' => $item['column'], 'collapsed' => $item['collapsed']);
					}
				}
				
				// write to db
				$setSetting = $ThemeDB->setSetting('dashboard_columns', $newColumns);
				
				echo "success";
				exit();
			}
		}
	}
}
?>