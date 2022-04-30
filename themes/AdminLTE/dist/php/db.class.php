<?php

class ThemeDB
{
	protected $link;
	public $settingsTable = false;
	
	public function tablePrefix()
	{
		require("../../../../includes/config.inc.php");
		
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
		require("../../../../includes/config.inc.php");
		
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
	
	public function query($query)
	{
		$this->connect();
		
		if($this->getConnType()=='pdo')
		{
			try {
				$stmt = $this->link->prepare($query);
				$stmt->execute();
				
				$data = $stmt->fetchAll(PDO::FETCH_ASSOC);
				if(count($data)>=1)
				{
					return $data;
				}
				else
				{
					return false;
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
					return $output;
				}
			}
		}
	}
	
	public function getSetting($name)
	{
		$query = '
			SELECT value
			FROM '.$this->settingsTable.'
			WHERE user = "'.$_SESSION['user_id'].'" AND name = "'.$name.'"
		';
		
		$data = $this->query($query);
		if(!empty($data))
		{
			return json_decode(unserialize($data[0]['value']), 1);
		}
		else
		{
			return false;
		}
	}
	
	public function setSetting($name, $value)
	{
		$query = "
			INSERT INTO ".$this->settingsTable." (user, name, value)
				VALUES('".$_SESSION['user_id']."', '".$name."', '".serialize(json_encode($value))."')
			ON DUPLICATE KEY UPDATE
				value = '".serialize(json_encode($value))."'
		";
		
		return $this->query($query);
	}
}