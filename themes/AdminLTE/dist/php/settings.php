<?php
include("../../../../includes/helpers.php");
include("./db.class.php");
include("./theme.class.php");

// start ogp session
startSession();

// initialize classes
$ThemeDB = new ThemeDB;
$Theme = new Theme;

// declarations
$isadmin = false;
$uploadsFolder = dirname(__FILE__).'/uploads';
$themeUploadsPath = "themes/AdminLTE/dist/php/uploads/";

// check if uploads folder exists and create if not
if(!file_exists($uploadsFolder))
{
	mkdir($uploadsFolder, 0744, true);
}

// declare themeTables
$themeTables = array(
	array(
		'name' => $ThemeDB->settingsTable,
		'query' => '
			CREATE TABLE '.$ThemeDB->settingsTable.' (
				id int(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
				user int(4) NOT NULL,
				name varchar(255) NOT NULL,
				value mediumtext NOT NULL,
				UNIQUE KEY UniqueSetting (user,name)
			);
		'
	),
	// id int(20) NOT NULL AUTO_INCREMENT PRIMARY KEY,
	array(
		'name' => $ThemeDB->serverStatsTable,
		'query' => '
			CREATE TABLE '.$ThemeDB->serverStatsTable.' (
				home_id int(4) NOT NULL,
				users_online int(4) NOT NULL,
				current_stamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
			);
		'
	)
);

// check if theme settings db exists and create if not
foreach($themeTables AS $themeTable)
{
	$sql = 'show tables like "'.$themeTable['name'].'"';
	if($ThemeDB->query($sql) === false)
	{
		// create settings table
		$ThemeDBCreate = $ThemeDB->query($themeTable['query'], false);
		if($ThemeDBCreate===true)
		{
			// echo 'table "'.$themeTable['name'].'" successfully created';
		}
		else
		{
			// throw error
			echo "<pre>Error:";
			print_r($ThemeDBCreate);
			echo "</pre>";
			exit();
		}
	}
}

// check & set admin
if(isset($_SESSION['user_id']))
{
	$isadmin = $Theme->checkIsAdmin($_SESSION['user_id']);
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
					elseif($_GET['v']=='isadmin')
					{
						if($isadmin)
						{
							echo 1;
						}else
						{
							echo 0;
						}
						exit();
					}
					elseif($_GET['v']=='updateserverstats')
					{
						if(isset($_GET['token']))
						{
							echo $Theme->updateGameserverStats($_GET['token']);
						}
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
				}
				exit();
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
			elseif($_GET['p']=='themeNavWidth')
			{
				if(isset($_SESSION['users_login']))
				{
					// load global setting (id -1)
					$themeNavWidth = $ThemeDB->getSetting('themeNavWidth', -1);
					
					if(empty($themeNavWidth))
					{
						$themeNavWidth = 250;
					}
					
					header("Content-Type: application/json");
					echo json_encode($themeNavWidth);
				}
				exit();
			}
			elseif($_GET['p']=='themeServerstats')
			{
				if(isset($_SESSION['users_login']))
				{
					if(isset($_GET['v']) && $_GET['v']=='displayNum')
					{
						$themeServerstatsNum = $ThemeDB->getSetting('themeServerstatsNum', -1);
						
						if(empty($themeServerstatsNum) || $themeServerstatsNum<1 || $themeServerstatsNum>20)
						{
							$themeServerstatsNum = 10;
						}
						
						echo $themeServerstatsNum;
					}else
					{
						// check if token is set to check if themeServerstats are enabled or not
						$themeServerstats = $ThemeDB->getSetting('updateToken', -1);
						
						echo empty($themeServerstats) ? 'remove' : 'activate';
					}
				}
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
				elseif($_GET['p']=='listservers')
				{
					echo $Theme->listServersFromDB();
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
				elseif($_GET['p']=='themeNavWidth')
				{
					if(isset($_GET['v']) && is_numeric($_GET['v']) && $_GET['v']>=250 && $_GET['v']<=350)
					{
						// save new width
						$setSetting = $ThemeDB->setSetting('themeNavWidth', $_GET['v'], -1);
						
						echo $_GET['v'];
						exit;
					}else
					{
						// invalid value - return default width
						echo 250;
						exit;
					}
				}
				elseif($_GET['p']=='themeServerstats')
				{
					if(isset($_GET['v']))
					{
						if($_GET['v']=='activate')
						{
							// generate token
							$newToken = bin2hex(random_bytes(20));
							
							// set token
							$ThemeDB->setSetting('updateToken', $newToken, -1);
							
							// set cronjob
							$Theme->checkForCronjob();
						}
						elseif($_GET['v']=='remove')
						{
							// remove token
							$ThemeDB->removeSetting('updateToken', -1);
							
							// remove cronjob
							$Theme->checkForCronjob(true);
						}
						elseif($_GET['v']=='setNum')
						{
							if(isset($_GET['num']) && is_numeric($_GET['num']))
							{
								$setNum = $_GET['num'];
								
								if($setNum<1 || $setNum>20)
								{
									$setNum = 10;
								}
								
								// set num
								$ThemeDB->setSetting('themeServerstatsNum', $setNum, -1);
							}
						}
					}
					
					exit;
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
		
		// define svg mime types
		$svgMimeTypes = array('image/svg+xml', 'image/svg');
		
		// check if file is an image or a valid svg mime type
		$isImage = getimagesize($filesField['tmp_name']);
		if($isImage === false && !in_array(mime_content_type($filesField['tmp_name']), $svgMimeTypes))
		{
			// file is not an image; break script
			$retArr = array(
				'code' => 'error',
				'data' => 'Error: File is no Image ('.mime_content_type($filesField['tmp_name']).')',
			);
			return json_encode($retArr);
		}
		
		// check file size
		if($filesField['size'] > 5242880) // 5mb in bytes
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