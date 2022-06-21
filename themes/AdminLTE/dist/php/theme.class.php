<?php

class Theme
{
	private $absolutePath = "../../../..";
	
	public function callOGPFunction($functionName = false, $params = false)
	{
		if($functionName)
		{
			// load ogp functions
			include($this->absolutePath."/includes/functions.php");

			if(function_exists($functionName))
			{
				if($params)
				{
					return $functionName($params);
				}else
				{
					return $functionName();
				}
			}
		}
		
		return false;
	}

	private function getOGPServers($all = false)
	{
		// load ThemeDB class
		require_once("./db.class.php");
		$ThemeDB = new ThemeDB;
		
		// list all ogp servers
		if($all)
		{
			$query = "
				SELECT *
				FROM ".$ThemeDB->tablePrefix()."remote_servers
			";
		}else
		{
			$query = "
				SELECT *
				FROM ".$ThemeDB->tablePrefix()."remote_servers
				ORDER BY 'remote_server_id' ASC
				LIMIT 1
			";
		}
		
		$data = $ThemeDB->query($query);
		if($data)
		{
			return $data;
		}
		
		return false;
	}
	
	private function getAllCrons()
	{
		return $this->OGPCronjob('get');
	}
	
	private function OGPCronjob($type, $id = false, $url = false)
	{
		// load ogp lib_remote
		require_once($this->absolutePath."/includes/lib_remote.php");
		
		$firstRemoteServer = $this->getOGPServers();
		if($firstRemoteServer)
		{
			$remote = new OGPRemoteLibrary($firstRemoteServer[0]['agent_ip'], $firstRemoteServer[0]['agent_port'], $firstRemoteServer[0]['encryption_key'], $firstRemoteServer[0]['timeout']);
			if($remote->status_chk() != 1)
			{
				return false;
			}
		}
		
		if($type=="get")
		{
			return $remote->scheduler_list_tasks();
		}
		elseif($type=="add" && $url)
		{
			return $remote->scheduler_add_task($url);
		}
		elseif($type=="edit" && $id && $url)
		{
			return $remote->scheduler_edit_task($id, $url);
		}
		elseif($type=="del")
		{
			return $remote->scheduler_del_task($id);
		}
	}
	
	public function checkForCronjob($remove = false)
	{
		// load ThemeDB class
		require_once("./db.class.php");
		$ThemeDB = new ThemeDB;
		
		$checkURL = $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME'].'?m=global&p=check&v=updateserverstats';
		
		$updateToken = $ThemeDB->getSetting('updateToken', -1);
		
		$foundCron = false;
		$validCron = false;
		$allCrons = $this->OGPCronjob('get');
		foreach($allCrons AS $cronNum => $cronVal)
		{
			// check if current cron is updateserverstats
			if(strpos($cronVal, 'settings.php?m=global&p=check&v=updateserverstats') !== false)
			{
				if($remove)
				{
					// remove cron
					$this->OGPCronjob('del', $cronNum);
				}else
				{
					if($foundCron)
					{
						// possible duplicates, remove them all
						$this->OGPCronjob('del', $cronNum);
						continue;
					}
					else
					{
						$foundCron = $cronNum;
						
						preg_match('/"(.*)"/', $cronVal, $cronURL);
						$cronComponents = parse_url(end($cronURL));
						parse_str($cronComponents['query'], $cronParams);
						
						if($updateToken==$cronParams['token'])
						{
							$validCron = true;
						}
					}
				}
			}
		}
		
		if(!$remove && ($foundCron || !$validCron))
		{
			// specify cron url
			$goodCronEntry = '*/10 * * * * wget -qO- "'.$checkURL.'&token='.$updateToken.'" --no-check-certificate > /dev/null 2>&1';
			
			if($foundCron && !$validCron)
			{
				// cron existent but invalid - update entry
				$this->OGPCronjob('edit', $foundCron, $goodCronEntry);
				return 'updated cronjob';
			}
			elseif(!$foundCron)
			{
				// cron not existent - create entry
				$this->OGPCronjob('add', false, $goodCronEntry);
				return 'created cronjob';
			}
		}
		
		return false;
	}
	
	private function getGameServers()
	{
		// load ThemeDB class
		require_once("./db.class.php");
		$ThemeDB = new ThemeDB;
		
		// load ogp server_config_parser to get SERVER_CONFIG_LOCATION variable
		require($this->absolutePath."/modules/config_games/server_config_parser.php");
		
		// first get all server homes, specific configs and ip/port config
		$query = "
			SELECT sh.home_id, sh.home_cfg_id, ch.game_name, ch.home_cfg_file, hip.port, rs.use_nat, rs.agent_ip, rsi.ip
			FROM ".$ThemeDB->tablePrefix()."server_homes AS sh
			LEFT JOIN ".$ThemeDB->tablePrefix()."config_homes AS ch
			ON sh.home_cfg_id = ch.home_cfg_id
			LEFT JOIN ".$ThemeDB->tablePrefix()."home_ip_ports AS hip
			ON sh.home_id = hip.home_id
			LEFT JOIN ".$ThemeDB->tablePrefix()."remote_servers AS rs
			ON sh.remote_server_id = rs.remote_server_id
			LEFT JOIN ".$ThemeDB->tablePrefix()."remote_server_ips AS rsi
			ON hip.ip_id = rsi.ip_id
		";
		
		$serverHomes = $ThemeDB->query($query);
		if($serverHomes)
		{
			foreach($serverHomes AS $key => $shData)
			{
				// load home config file
				$serverConfig = simplexml_load_file($this->absolutePath."/".SERVER_CONFIG_LOCATION.$shData['home_cfg_file']);
				if($serverConfig)
				{
					// add protcol to $serverHomes
					$serverHomes[$key]['protocol'] = (string)$serverConfig->{'protocol'};
					
					// get protocol query name
					if($serverHomes[$key]['protocol']=='gameq')
					{
						$serverHomes[$key]['queryName'] = (string)$serverConfig->gameq_query_name;
					}
					elseif($serverHomes[$key]['protocol']=='lgsl')
					{
						$serverHomes[$key]['queryName'] = (string)$serverConfig->lgsl_query_name;
					}
				}
			}
			
			// return serverHomes
			return $serverHomes;
		}
		else
		{
			return false;
		}
	}
	
	private function gameServerQuery($serverObject)
	{
		// declarations
		$timeout = 30;
		
		// default output
		$users = array(
			'online' => 0,
			'max' => 0
		);
		
		// change serverIP to agent ip if server is behind nat
		$serverIP = ($serverObject['use_nat']==0) ? $serverObject['ip'] : $serverObject['agent_ip'];
		
		// gameq
		if($serverObject['protocol']=='gameq')
		{
			require($this->absolutePath."/protocol/GameQ/GameQ.php");
			
			$gq = new GameQ();
			$gq->addServer(array(
			   'id' => 'server',
			   'type' => $serverObject['queryName'],
			   'host' => $serverIP.':'.$serverObject['port'],
			));
			$gq->setOption('timeout', $timeout);
			
			return $gq->requestData();
		}
		// lgsl
		elseif($serverObject['protocol']=='lgsl')
		{
			require($this->absolutePath."/protocol/lgsl/lgsl_protocol.php");
			
			// ogp lgsl_port_conversion
			$portConversion = lgsl_port_conversion($serverObject['queryName'], $serverObject['port'], "", "");
			$c_port = $portConversion['0'];	// conn port
			$q_port = $portConversion['1'];	// query port
			$s_port = $portConversion['2'];	// software port
			
			// get live data
			$data = lgsl_query_live($serverObject['queryName'], $serverIP, $c_port, $q_port, $s_port, "sa");
			
			// only update if server is running
			if($data['b']['status'])
			{
				$users['online'] = $data['s']['players'];
				$users['max'] = $data['s']['playersmax'];
			}
		}
		// ts3
		elseif($serverObject['protocol']=='teamspeak3')
		{
			require($this->absolutePath."/protocol/TeamSpeak3/TeamSpeak3.php");
			
			try
			{
				$ts3_VirtualServer = TeamSpeak3::factory('serverquery://'.$serverIP.':'.($serverObject['port'] + 24).'/?server_port='.$serverObject['port'].'&timeout='.$timeout);
				$ts3_VirtualServer->setExcludeQueryClients(true);
				$users['online'] = $ts3_VirtualServer->virtualserver_clientsonline-$ts3_VirtualServer->virtualserver_queryclientsonline;
				$users['max'] = $ts3_VirtualServer->virtualserver_maxclients;
			}
			catch(Exception $e)
			{
				// dont do anything on error
			}
		}

		return $users;
	}
	
	public function updateGameserverStats($token = false)
	{
		// load ThemeDB class
		require_once("./db.class.php");
		$ThemeDB = new ThemeDB;
		
		// check token
		if($token)
		{
			$checkToken = $ThemeDB->getSetting('updateToken', -1);
			if($token==$checkToken)
			{
				// get all GameServers
				$getGameServers = $this->getGameServers();
				if($getGameServers)
				{
					foreach($getGameServers AS $key => $gameServer)
					{
						$users = $this->gameServerQuery($gameServer);
						$getGameServers[$key]['users'] = $users;
						
						// write player stats into db
						$ThemeDB->query("
							INSERT INTO ".$ThemeDB->serverStatsTable." (home_id, users_online)
							VALUES('".$gameServer['home_id']."', '".$users['online']."')
						");
					}
					
					// delete old stats (keep only entries from last 2 days)
					$ThemeDB->query("
						DELETE FROM ogp_adminlte_serverstats WHERE current_stamp < DATE_ADD(NOW(), INTERVAL -2 DAY)
					");
					
					return true;
				}
			}else
			{
				return "invalid token";
			}
		}
		
		return false;
	}
	
	public function listServersFromSession()
	{
		// get all servers from session
		$allServers = '';
		foreach($_SESSION as $key => $val)
		{
			if(substr($key, 0, strlen('server_')) === 'server_')
			{
				$allServers .= $this->buildServerBox($val);
			}
		}
		
		return $allServers;
	}
	
	private function buildServerBox($serverObject)
	{
		$gameName = (strtolower($serverObject['mod_name'])=='none') ? $serverObject['game_name'] : $serverObject['game_name'].' ('.$serverObject['mod_name'].')';
		
		$currentPlayer = (isset($serverObject['server_players'])) ? $serverObject['server_players'] : 0;
		$maxPlayer = (isset($serverObject['server_playersmax'])) ? $serverObject['server_playersmax'] : 0;
		
		$gameMonitorLink = 'home.php?m=gamemanager&p=game_monitor&home_id-mod_id-ip-port='.$serverObject['home_id'].'-'.$serverObject['mod_id'].'-'.$serverObject['ip'].'-'.$serverObject['port'];
		
		$serverBox = '
		<div class="info-box serverstatus mb-2" data-id="'.$serverObject['home_id'].'">
			<span class="info-box-icon">
				<i class="fas fa-gamepad"></i>
			</span>
			<div class="info-box-content d-flex flex-row flex-wrap">
				<span class="server-infos mr-auto">
					<div class="server-name">
						<a href="'.$gameMonitorLink.'" class="text-dark">'.$serverObject['home_name'].'</a>
					</div>
					<div class="server-ipport">'.$serverObject['ip'].':'.$serverObject['port'].'</div>
					<div class="server-gamename text-muted text-sm">'.$gameName.'</div>
				</span>
				<span class="player-infos">
					<h5 class="server-player text-right ml-2">
						<span class="server-current-player">'.$currentPlayer.'</span>/<span class="server-max-player">'.$maxPlayer.'</span>
					</h5>
					'.$this->buildPlayerChart($serverObject).'
				</span>
			</div>
		</div>
		';
		
		return $serverBox;
	}
	
	private function buildPlayerChart($serverObject)
	{
		// load ThemeDB class
		require_once("./db.class.php");
		$ThemeDB = new ThemeDB;
		
		$chartWidth = '120px';
		$chartHeight = '35px';
		$showElements = 10;
		
		$onlineStatsQuery = $ThemeDB->query("
			SELECT users_online
			FROM ".$ThemeDB->serverStatsTable."
			WHERE home_id = ".$serverObject['home_id']."
			ORDER BY current_stamp DESC
			LIMIT ".$showElements."
		");
		
		$labels = array();
		$onlineStats = array();
		foreach($onlineStatsQuery AS $osq)
		{
			$labels[] = '';
			$onlineStats[] = $osq['users_online'];
		}
		
		$chart = '
		<div class="playerChart">
			<canvas id="playerChart-'.$serverObject['home_id'].'" style="min-height:'.$chartHeight.'; height:'.$chartHeight.'; max-height:'.$chartHeight.'; min-width:'.$chartWidth.'; width:'.$chartWidth.'; max-width:'.$chartWidth.';"></canvas>
			
			<script>
			
			var primaryThemeColor = window.getComputedStyle(document.body).getPropertyValue("--light");
			
			var lineChartCanvas = $("#playerChart-'.$serverObject['home_id'].'").get(0).getContext("2d");
			var lineChart = new Chart(lineChartCanvas, {
				type: "line",
				data: {
					labels: ["'.implode('","', $labels).'"],
					datasets: [{
						label: "Online Users",
						// backgroundColor: primaryThemeColor,
						data: ["'.implode('","', array_reverse($onlineStats)).'"],
						borderWidth: 0
					}]
				},
				options: {
					"title": {
						"display": false,
					},
					"legend": {
						"display": false,
					},
					"scales": {
						"yAxes": [
							{
								"display": false
							}
						],
						"xAxes": [
							{
								"display": false
							}
						],
					},
					"tooltip": {
						"caretSize": 0
					},
				},
			});
			</script>
		</div>
		';
		
		return $chart;
	}
	
	public function getMapImage($serverObject)
	{
		// for later use...
		return false;
		
		// return $this->gameServerQuery($serverObject);
		
		// load ogp server_config_parser to get SERVER_CONFIG_LOCATION variable
		require($this->absolutePath."/modules/config_games/server_config_parser.php");
		
		// load ogp functions
		include($this->absolutePath."/includes/functions.php");
		
		// load home config file
		$serverConfig = simplexml_load_file($this->absolutePath."/".SERVER_CONFIG_LOCATION.$serverObject['home_cfg_file']);
		if($serverConfig)
		{
			// get protocol query name
			if($serverConfig->{'protocol'}=='gameq')
			{
				$queryName = (string)$serverConfig->gameq_query_name;
			}
			elseif($serverConfig->{'protocol'}=='lgsl')
			{
				$queryName = (string)$serverConfig->lgsl_query_name;
			}
		}
		
		return false;
		
		// get_map_path($query_name,$mod,$map)
	}
}
?>