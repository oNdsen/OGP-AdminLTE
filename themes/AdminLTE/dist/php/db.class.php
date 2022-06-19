<?php

class ThemeDB
{
	protected $link;
	
	public $settingsTable, $serverStatsTable;
	private $absolutePath = "../../../..";
	
	public function __construct()
	{
		$this->settingsTable = $this->tablePrefix().'adminlte_settings';
		$this->serverStatsTable = $this->tablePrefix().'adminlte_serverstats';
	}
	
	public function tablePrefix()
	{
		include($this->absolutePath."/includes/config.inc.php");
		
		return $table_prefix;
	}
	
	private function getConnType()
	{
		if(class_exists('pdo'))
		{
			return 'pdo';
		}
		elseif(class_exists('mysqli'))
		{
			return 'mysqli';
		}
		else
		{
			echo 'error: neither pdo nor mysqli extensions are installed or activated';
			exit;
		}
	}
	
	private function connect()
	{
		include($this->absolutePath."/includes/config.inc.php");
		
		if($this->getConnType()=='pdo')
		{
			try
			{
				$dbh = new PDO('mysql:host='.$db_host.';dbname='.$db_name, $db_user, $db_pass);
			}
			catch (PDOException $e)
			{
				echo 'Connection failed: ' . $e->getMessage();
				exit;
			}
			
			$this->link = $dbh;
		}
		elseif($this->getConnType()=='mysqli')
		{
			$mysqli = @new mysqli($db_host, $db_user, $db_pass, $db_name);
			if($mysqli->connect_error)
			{
				echo 'Connection error: ' . $mysqli->connect_error;
				exit;
			}
			
			$this->link = $mysqli;
		}
	}
	
	public function query($query, $returnData = true)
	{
		$this->connect();
		
		if($this->getConnType()=='pdo')
		{
			try {
				$stmt = $this->link->prepare($query);
				$stmt->execute();
				
				if($returnData)
				{
					$output = $stmt->fetchAll(PDO::FETCH_ASSOC);
				}
			}
			catch(PDOException $e)
			{
				return $e->getMessage();
			}
		}
		elseif($this->getConnType()=='mysqli')
		{
			$result = $this->link->query($query);
			if(!$result)
			{
				return $this->link->error;
			}
			else
			{
				if($result=="NULL")
				{
					return true;
				}
				else
				{
					$output = array();
					while($row = $result->fetch_assoc())
					{
						$output[] = $row;
					}
				}
			}
		}
		
		if($returnData)
		{
			if(count($output)>=1)
			{
				return $output;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return true;
		}
	}
	
	public function getSetting($name, $userId = false)
	{
		if($userId === false)
		{
			$userId = $_SESSION['user_id'];
		}
		
		$query = '
			SELECT value
			FROM '.$this->settingsTable.'
			WHERE user = "'.$userId.'" AND name = "'.$name.'"
		';
		
		$data = $this->query($query);
		if(!empty($data))
		{
			return unserialize($data[0]['value']);
		}
		else
		{
			return false;
		}
	}
	
	public function setSetting($name, $value, $userId = false)
	{
		if($userId === false)
		{
			$userId = $_SESSION['user_id'];
		}
		
		// dont use on duplicate key update statement because of the increasing index
		// so instead check if the entry exists, if yes update, if not create :)
		if($this->getSetting($name, $userId))
		{
			return $this->query("
				UPDATE ".$this->settingsTable."
				SET value = '".serialize($value)."'
				WHERE user = '".$userId."' AND name = '".$name."'
			");
		}else
		{
			return $this->query("
				INSERT INTO ".$this->settingsTable." (user, name, value)
				VALUES('".$userId."', '".$name."', '".serialize($value)."')
			");
		}
	}
	
	public function removeSetting($name, $userId = false)
	{
		if($userId === false)
		{
			$userId = $_SESSION['user_id'];
		}
		
		$query = "
			DELETE FROM ".$this->settingsTable."
			WHERE user = '".$userId."' and name = '".$name."'
		";
		
		return $this->query($query);
	}
	
	public function getMaintenanceMode()
	{
		$query = "
			SELECT setting,value
			FROM ".$this->tablePrefix()."settings
			WHERE setting = 'maintenance_mode' or setting = 'maintenance_title' or setting = 'maintenance_message'
		";
		
		$data = $this->query($query);
		if($data)
		{
			$dataOut = array();
			foreach($data as $setting)
			{
				$dataOut[$setting['setting']] = $setting['value'];
			}
			return $dataOut;
		}
	}
}