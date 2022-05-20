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
$themeUploadsPath = "themes/AdminLTE/dist/php/uploads/";

// check if uploads folder exists and create if not
if(!file_exists($uploadsFolder))
{
	mkdir($uploadsFolder, 0744, true);
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
		// throw error
		echo "<pre>";
		print_r($ThemeDBCreate);
		echo "</pre>";
		exit();
	}
}

// set admin
if(isset($_SESSION['users_group']) && $_SESSION['users_group']=='admin')
{
	$isadmin = true;
}

if(isset($_GET['m']))
{
	if($_GET['m']=='global')
	{
		if(isset($_GET['p']))
		{
			if($_GET['p']=='check')
			{
				if(isset($_GET['v']))
				{
					if($_GET['v']=='maintenance')
					{
						$data = $ThemeDB->getMaintenanceMode();
						
						header("Content-Type: application/json");
						echo json_encode($data);
						exit();
					}
				}
			}
			elseif($_GET['p']=='theme')
			{
				// check if user session exists
				if(isset($_SESSION['users_login']))
				{
					if(isset($_GET['v']) && ($_GET['v']=='light' || $_GET['v']=='dark'))
					{
						// write new value to db
						$theme = $ThemeDB->setSetting('theme', $_GET['v']);
					}
					else
					{
						$theme = $ThemeDB->getSetting('theme');
						if(empty($theme))
						{
							// write default value to db
							$theme = $ThemeDB->setSetting('theme', 'dark');
						}
					}
					
					header("Content-Type: application/json");
					echo json_encode($theme);
					exit();
				}
			}
			elseif($_GET['p']=='themeLogo')
			{
				// load global setting (id -1)
				$themeLogo = $ThemeDB->getSetting('themeLogo', -1);
				
				if(empty($themeLogo))
				{
					echo 0;
					exit();
				}
				
				header("Content-Type: application/json");
				echo json_encode($themeLogo);
				exit();
			}
		}
	}
	elseif($_GET['m']=='user')
	{
		// check if user session exists
		if(isset($_SESSION['users_login']))
		{
			if(isset($_GET['p']))
			{
				if($_GET['p']=='getavatar')
				{
					if(isset($_GET['userid']) && is_numeric($_GET['userid']))
					{
						$avatar = $ThemeDB->getSetting('avatar', $_GET['userid']);
						if(empty($avatar))
						{
							$avatarPath = "themes/AdminLTE/dist/img/default-avatar.png";
						}else
						{
							$avatarPath = $avatar;
						}
						
						echo $avatarPath;
						exit;
					}
				}elseif($_GET['p']=='setavatar')
				{
					if(isset($_GET['userid']) && is_numeric($_GET['userid']))
					{
						// security; for now, only allow upload for own user id
						if($_GET['userid']==$_SESSION['user_id'])
						{
							echo _NewFileUpload($_FILES['userAvatar'], $_GET['userid'], 'avatar');
							exit;
						}
					}
				}
			}
		}
	}
	elseif($_GET['m']=='dashboard')
	{
		// check if user session exists
		if(isset($_SESSION['users_login']))
		{
			if(isset($_GET['p']))
			{
				if($_GET['p']=='columnsettings')
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
						
						// write default value to db
						$setSetting = $ThemeDB->setSetting('dashboard_columns', $newColumns);
						
						$columns = $newColumns;
					}
					
					header("Content-Type: application/json");
					echo json_encode($columns);
					exit();
				}
				elseif($_GET['p']=='updatecolumnsettings')
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
	elseif($_GET['m']=='settings')
	{
		if($isadmin)
		{
			if(isset($_GET['p']))
			{
				if($_GET['p']=='fileUpload')
				{
					echo _NewFileUpload($_FILES['themeLogo'], 'themeLogo', 'themeLogo', true);
					exit;
				}
				elseif($_GET['p']=='themeLogo')
				{
					if(isset($_GET['v']) && ($_GET['v']=='remove'))
					{
						// load global setting (id -1)
						$themeLogo = $ThemeDB->getSetting('themeLogo', -1);
						
						if(!empty($themeLogo))
						{
							// build direct path
							$oldLogo = $uploadsFolder."/".basename($themeLogo);
							
							// delete old logo if exists
							if(file_exists($oldLogo))
							{
								unlink($oldLogo);
							}
							
							// remove logo from db
							echo $ThemeDB->removeSetting('themeLogo', -1);
						}
					}
				}
			}
		}
	}
}


// file upload function
function _NewFileUpload($filesField, $uploadName, $settingName, $systemSetting = false)
{
	Global $uploadsFolder, $ThemeDB, $themeUploadsPath;
	
	if(isset($filesField))
	{
		// check if uploads folder is writable
		if(!is_writable($uploadsFolder))
		{
			$retArr = array(
				'code' => 'error',
				'data' => 'Error: Uploads Folder is not writable.<br>Check Folder: '.$uploadsFolder,
			);
			return json_encode($retArr);
		}
		
		// check if file is an image
		$isImage = getimagesize($filesField['tmp_name']);
		if($isImage === false)
		{
			// file is not an image; break script
			$retArr = array(
				'code' => 'error',
				'data' => 'Error: File is no Image',
			);
			return json_encode($retArr);
		}
		
		// check file size
		if($filesField['size'] > 500000) // 5mb in bytes
		{
			// filesize is too big; break script
			$retArr = array(
				'code' => 'error',
				'data' => 'Error: Filesize extends 5mb',
			);
			return json_encode($retArr);
		}
		
		// check if setting/upload already exists
		if($systemSetting)
		{
			$oldUpload = $ThemeDB->getSetting($settingName, -1);
		}else
		{
			$oldUpload = $ThemeDB->getSetting($settingName);
		}
		if(!empty($oldUpload))
		{
			// build file path
			$oldLogo = $uploadsFolder."/".basename($oldUpload);
			
			// delete old upload
			if(file_exists($oldLogo))
			{
				unlink($oldLogo);
			}
		}
		
		// get file extension
		$fileExt = pathinfo($filesField['name'])['extension'];
		$destFile = $uploadsFolder."/".$uploadName.".".$fileExt;
		$newUpload = $themeUploadsPath.$uploadName.".".$fileExt;
		
		if(move_uploaded_file($filesField['tmp_name'], $destFile))
		{
			// write to db
			if($systemSetting)
			{
				$setSetting = $ThemeDB->setSetting($settingName, $newUpload, -1);
			}else
			{
				$setSetting = $ThemeDB->setSetting($settingName, $newUpload);
			}
			
			$retArr = array(
				'code' => 'success',
				'data' => $newUpload,
			);
			return json_encode($retArr);
		}
		else
		{
			$retArr = array(
				'code' => 'error',
				'data' => 'Error: Could not move uploaded File',
			);
			return json_encode($retArr);
		}
	}else
	{
		return "no files";
	}
}

?>