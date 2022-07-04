<?php

class Theme
{
	private $absolutePath = "../../../..";
	
	private function getOGPPublicPath()
	{
		return str_replace("themes/AdminLTE/dist/php/settings.php", "", $_SERVER['REQUEST_SCHEME'].'://'.$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME']);
	}
	
	public function checkIsAdmin($user_id)
	{
		// load ThemeDB class
		require_once("./db.class.php");
		$ThemeDB = new ThemeDB;
		
		if(is_numeric($user_id))
		{
			$query = "
				SELECT users_role
				FROM ".$ThemeDB->tablePrefix()."users
				WHERE user_id = ".$user_id."
			";
			
			$data = $ThemeDB->query($query);
			if($data)
			{
				// reset users_group session for on the fly changes
				$_SESSION['users_group'] = $data[0]['users_role'];
				
				if($data[0]['users_role']=='admin')
				{
					return true;
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
		}else
		{
			// no server available
			return false;
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
		
		$checkURL = $this->getOGPPublicPath().'themes/AdminLTE/dist/php/settings.php?m=global&p=check&v=updateserverstats';
		
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
			$goodCronEntry = '*/5 * * * * wget -qO- "'.$checkURL.'&token='.$updateToken.'" --no-check-certificate';
			
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
	
	public function getGameServer($user_id = false)
	{
		// load ThemeDB class
		require_once("./db.class.php");
		$ThemeDB = new ThemeDB;
		
		// load ogp server_config_parser to get SERVER_CONFIG_LOCATION variable
		require_once($this->absolutePath."/modules/config_games/server_config_parser.php");
		
		// load ogp lib_remote
		require_once($this->absolutePath."/includes/lib_remote.php");
		
		// first get all server homes, specific configs and ip/port config
		$query = "
		SELECT *
			FROM ".$ThemeDB->tablePrefix()."home_ip_ports
			NATURAL JOIN ".$ThemeDB->tablePrefix()."remote_servers
			NATURAL JOIN ".$ThemeDB->tablePrefix()."server_homes
			NATURAL JOIN ".$ThemeDB->tablePrefix()."config_homes
			NATURAL JOIN ".$ThemeDB->tablePrefix()."remote_server_ips
			NATURAL JOIN ".$ThemeDB->tablePrefix()."config_mods
			NATURAL JOIN ".$ThemeDB->tablePrefix()."game_mods
		";
		
		if($user_id !== false)
		{
			$query .= "
			NATURAL JOIN
			(
				SELECT home_id
				FROM ".$ThemeDB->tablePrefix()."user_homes
				WHERE user_id = ".$user_id."
				UNION
				SELECT home_id
				FROM ".$ThemeDB->tablePrefix()."user_groups
				NATURAL JOIN ".$ThemeDB->tablePrefix()."user_group_homes
				WHERE user_id = ".$user_id."
			) temp
			";
		}
		
		$query .= "
			WHERE force_mod_id IN
			(
				SELECT force_mod_id
				FROM ".$ThemeDB->tablePrefix()."home_ip_ports
				WHERE force_mod_id = ".$ThemeDB->tablePrefix()."game_mods.mod_id OR force_mod_id = 0
			) ORDER BY home_user_order ASC, ".$ThemeDB->tablePrefix()."server_homes.home_id ASC
		";
		
		$serverHomes = $ThemeDB->query($query);
		if($serverHomes)
		{
			foreach($serverHomes AS $key => $shData)
			{
				// check if the screen running the server is running.
				$remote = new OGPRemoteLibrary($shData['agent_ip'], $shData['agent_port'], $shData['encryption_key'], $shData['timeout']);
				if( $remote->is_screen_running(OGP_SCREEN_TYPE_HOME, $shData['home_id']))
				{
					$queryData = $this->getProtocolAndQuery($serverHomes[$key]);
					$serverHomes[$key]['qProtocol'] = $queryData['qProtocol'];
					$serverHomes[$key]['qName'] = $queryData['qName'];
					$serverHomes[$key]['qMod'] = $queryData['qMod'];
				}
				else
				{
					// server screen stopped - remove server from array
					unset($serverHomes[$key]);
				}
			}
			
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
		$timeout = 5;
		
		// default output
		$gsq = array(
			'online' => 0,
			'max' => 0,
			'serverOnline' => false,
			'map' => false,
		);
		
		// change serverIP to agent ip if server is behind nat
		$serverIP = ($serverObject['use_nat']==0) ? $serverObject['ip'] : $serverObject['agent_ip'];
		
		// gameq
		if($serverObject['qProtocol']=='gameq')
		{
			// load gameq class
			require_once($this->absolutePath."/protocol/GameQ/Autoloader.php");
			
			// ogp lgsl_port_conversion
			require_once($this->absolutePath."/protocol/lgsl/lgsl_protocol.php");
			$portConversion = lgsl_port_conversion($serverObject['qName'], $serverObject['port'], "", "");
			$c_port = $portConversion['0'];	// conn port
			$q_port = $portConversion['1'];	// query port
			$s_port = $portConversion['2'];	// software port
			
			$gq = new \GameQ\GameQ();
			$gq->addServer(array(
			   'id' => 'server',
			   'type' => $serverObject['qName'],
			   'host' => $serverIP.':'.$serverObject['port'],
			   'options' => [
					'query_port' => $q_port,
				],
			));
			$gq->setOption('timeout', $timeout);
			
			// process gameq request
			$data = $gq->process();
			
			// only update if server is running
			if(!empty($data['gq_online']) && $data['gq_online'])
			{
				$gsq['online'] = $data['gq_numplayers'];
				$gsq['max'] = $data['gq_maxplayers'];
				$gsq['serverOnline'] = true;
			}else
			{
				$gsq['serverOnline'] = false;
			}
		}
		// lgsl
		elseif($serverObject['qProtocol']=='lgsl')
		{
			// ogp lgsl_port_conversion
			require_once($this->absolutePath."/protocol/lgsl/lgsl_protocol.php");
			$portConversion = lgsl_port_conversion($serverObject['qName'], $serverObject['port'], "", "");
			$c_port = $portConversion['0'];	// conn port
			$q_port = $portConversion['1'];	// query port
			$s_port = $portConversion['2'];	// software port
			
			// get live data
			$data = lgsl_query_live($serverObject['qName'], $serverIP, $c_port, $q_port, $s_port, "sa");
			
			// only update if server is running
			if($data['b']['status'])
			{
				$gsq['online'] = $data['s']['players'];
				$gsq['max'] = $data['s']['playersmax'];
				$gsq['serverOnline'] = true;
				$gsq['map'] = $data['s']['map'];
			}else
			{
				$gsq['serverOnline'] = false;
			}
		}
		// ts3
		elseif($serverObject['qProtocol']=='teamspeak3')
		{
			require_once($this->absolutePath."/protocol/TeamSpeak3/TeamSpeak3.php");
			
			try
			{
				$ts3_VirtualServer = TeamSpeak3::factory('serverquery://'.$serverIP.':'.($serverObject['port'] + 24).'/?server_port='.$serverObject['port'].'&timeout='.$timeout);
				$ts3_VirtualServer->setExcludeQueryClients(true);
				
				$gsq['online'] = $ts3_VirtualServer->virtualserver_clientsonline-$ts3_VirtualServer->virtualserver_queryclientsonline;
				$gsq['max'] = $ts3_VirtualServer->virtualserver_maxclients;
				$gsq['serverOnline'] = true;
				$gsq['map'] = 'teamspeak3';
			}
			catch(Exception $e)
			{
				$gsq['serverOnline'] = false;
			}
		}

		return $gsq;
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
				$getGameServer = $this->getGameServer();
				if($getGameServer)
				{
					foreach($getGameServer AS $key => $gameServer)
					{
						$gsq = $this->gameServerQuery($gameServer);
						
						// write player stats into db
						$ThemeDB->query("
							INSERT INTO ".$ThemeDB->serverStatsTable." (home_id, users_online)
							VALUES('".$gameServer['home_id']."', '".$gsq['online']."')
						");
					}
					
					// delete old stats (keep only entries from last 1 day)
					$ThemeDB->query("
						DELETE FROM ogp_adminlte_serverstats WHERE current_stamp < DATE_ADD(NOW(), INTERVAL -1 DAY)
					");
					
					return "successfully updated";
				}else
				{
					return "no running gameserver found";
				}
			}else
			{
				return "invalid token";
			}
		}
		
		return "no token";
	}
	
	public function listServersFromDB()
	{
		$allServers = '';
		
		$filterUserId = $_SESSION['user_id'];
		if(isset($_SESSION['users_group']) && $_SESSION['users_group']=='admin')
		{
			// user is admin, so display all servers
			$filterUserId = false;
		}
		
		// get all servers from db
		$getGameServer = $this->getGameServer($filterUserId);
		if($getGameServer)
		{
			foreach($getGameServer as $key => $val)
			{
				$allServers .= $this->buildServerBox($val);
			}
		}
		
		return $allServers;
	}
	
	private function buildServerBox($serverObject)
	{
		$gameName = (strtolower($serverObject['mod_name'])=='none') ? $serverObject['game_name'] : $serverObject['game_name'].' ('.$serverObject['mod_name'].')';
		$gameMonitorLink = 'home.php?m=gamemanager&p=game_monitor&home_id-mod_id-ip-port='.$serverObject['home_id'].'-'.$serverObject['mod_id'].'-'.$serverObject['ip'].'-'.$serverObject['port'];
		
		// call game config file to get protocol, query and mod values
		$queryData = $this->getProtocolAndQuery($serverObject);
		$serverObject['qProtocol'] = $queryData['qProtocol'];
		$serverObject['qName'] = $queryData['qName'];
		$serverObject['qMod'] = $queryData['qMod'];
		
		// start server query to get online/unknown status and map parameter
		$gsq = $this->gameServerQuery($serverObject);
		$serverOnline = ($gsq['serverOnline']) ? 'online' : 'unknown';
		$serverObject['qMap'] = $gsq['map'];
		
		// small map fix for special servers
		$serverObject['qMap'] = ($serverObject['qMap']=='-') ? '_' : $serverObject['qMap'];
		
		// declare icon box
		$iconBox = '
			<span class="info-box-icon">
				<i class="fas fa-gamepad"></i>
			</span>
		';
		
		if($gsq['serverOnline'])
		{
			// check if a map image exists
			$mapImage = $this->getServerImage($serverObject);
			if($mapImage!=$this->getOGPPublicPath().'images/online_big.png')
			{
				$iconBox = '
					<span class="info-box-icon" style="
						background-image: url(\''.$mapImage.'\');
						background-size: cover;
						background-repeat: no-repeat;
					">
					</span>
				';
			}
		}
		
		$serverBox = '
		<div class="info-box serverstatus mb-2" data-id="'.$serverObject['home_id'].'" data-status="'.$serverOnline.'">
			'.$iconBox.'
			<div class="info-box-content d-flex flex-row">
				<span class="server-infos mr-auto">
					<div class="server-name">
						<a href="'.$gameMonitorLink.'" class="text-dark">'.$serverObject['home_name'].'</a>
					</div>
					<div class="server-ipport">'.$serverObject['ip'].':'.$serverObject['port'].'</div>
					<div class="server-gamename text-muted text-sm">'.$gameName.'</div>
				</span>
				<span class="player-infos">
					<h5 class="server-player text-right ml-2">
						<span class="server-current-player">'.$gsq['online'].'</span>/<span class="server-max-player">'.$gsq['max'].'</span>
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
		
		$showElements = $ThemeDB->getSetting('themeServerstatsNum', -1);
		if(empty($showElements))
		{
			$showElements = 10;
		}
		
		$chartWidth = (($showElements*15)<120) ? '120px' : ($showElements*15).'px';
		// $chartWidth = '120px';
		$chartHeight = '35px';
		
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
			var onlineUsersText = langConsts[langConstPrefix + "online"];
			var lineChartCanvas = $("#playerChart-'.$serverObject['home_id'].'").get(0).getContext("2d");
			var lineChart = new Chart(lineChartCanvas, {
				type: "line",
				data: {
					labels: ["'.implode('","', $labels).'"],
					datasets: [{
						label: onlineUsersText,
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
					"responsive": false,
					"scales": {
						"yAxes": [
							{
								"display": false,
								ticks: {
									beginAtZero: true
								}
							}
						],
						"xAxes": [
							{
								"display": false
							}
						],
					},
					tooltips: {
						intersect: false,
						enabled: false,
						custom: function(tooltipModel)
						{
							var tooltipEl = document.getElementById("chartjs-tooltip");

							// Create element on first render
							if(!tooltipEl)
							{
								tooltipEl = document.createElement("div");
								tooltipEl.id = "chartjs-tooltip";
								tooltipEl.innerHTML = tooltipModel.body[0].lines[0];
								document.body.appendChild(tooltipEl);
							}else
							{
								// hide if mouse got away from dot
								if(typeof(tooltipModel.body)=="undefined")
								{
									tooltipEl.style.opacity = 0;
									return;
								}
								
								// update innerHTML
								tooltipEl.innerHTML = tooltipModel.body[0].lines[0];
							}

							// Hide if no tooltip
							if(tooltipModel.opacity === 0)
							{
								tooltipEl.style.opacity = 0;
								return;
							}

							// Set caret Position
							tooltipEl.classList.remove("above", "below", "no-transform");
							if(tooltipModel.yAlign)
							{
								tooltipEl.classList.add(tooltipModel.yAlign);
							}
							else
							{
								tooltipEl.classList.add("no-transform");
							}

							var position = this._chart.canvas.getBoundingClientRect();

							// Display, position, and set styles for font
							tooltipEl.style.opacity = 1;
							tooltipEl.style.position = "absolute";
							tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + "px";
							tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + "px";
							tooltipEl.style.pointerEvents = "none";
						},
					},
				},
			});
			</script>
		</div>
		';
		
		return $chart;
	}
	
	private function getProtocolAndQuery($serverObject)
	{
		// load ogp server_config_parser to get SERVER_CONFIG_LOCATION variable
		require_once($this->absolutePath."/modules/config_games/server_config_parser.php");
		
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
			else
			{
				$queryName = (string)$serverConfig->{'protocol'};
			}
			
			return array(
				'qName' => $queryName,
				'qProtocol' => (string)$serverConfig->{'protocol'},
				'qMod' => (string)$serverConfig->{'mods'}->{'mod'}['key'],
			);
		}
		
		return false;
	}
	
	private function getServerImage($serverObject)
	{
		// load ogp helpers
		require_once($this->absolutePath."/includes/helpers.php");
		
		$query_name = strtolower($serverObject['qName']);
		$mod = strtolower($serverObject['qMod']);
		$map = str_replace("-", "_", strtolower($serverObject['qMap']));
		
		// adapting get_map_path() from OGP
		$mod_gt = $mod;
	
		if($mod == "cstrike")
		{
			if ($query_name == "halflife")
				$mod_gt = "cs";
			elseif($query_name == "source")
				$mod_gt = "css";
		}
		if($mod == "tf")
		{
			if ($query_name == "halflife")
				$mod_gt = "tf";
			elseif($query_name == "source")
				$mod_gt = "tf2";
		}
		
		// ts3 fix
		$query_name = ($query_name == "teamspeak3") ? "ts3" : $query_name;
		
		$mod_gt = $mod == "fof" ? "hl2dm" : $mod_gt;
		$mod_gt = $mod == "insurgency" ? "ins" : $mod_gt;
		$mod_gt = $mod == "redorchestra2" ? "ro2" : $mod_gt;
		$mod_gt = $mod == "risingstorm2" ? "ro2" : $mod_gt;
		$mod_gt = $mod == "killingfloor2" ? "kf2" : $mod_gt;
		$mod_gt = $query_name == "7dtd" ? "7daystodie" : $mod_gt;
		$mod_gt = $query_name == "callofduty" ? "cod" : $mod_gt;
		$mod_gt = $query_name == "callofdutyuo" ? "uo" : $mod_gt;
		$mod_gt = $query_name == "callofduty2" ? "cod2" : $mod_gt;
		$mod_gt = $query_name == "callofduty4mw" ? "cod4" : $mod_gt;
		$mod_gt = $query_name == "callofdutywaw" ? "codww" : $mod_gt;
		$mod_gt = $query_name == "callofdutymw3" ? "mw3" : $mod_gt;
		$mod_gt = $query_name == "conanexiles" ? "conan" : $mod_gt;
		
		$map_paths = array(
			$this->getOGPPublicPath()."protocol/lgsl/maps/$query_name/$mod/$map.jpg",
			$this->getOGPPublicPath()."protocol/lgsl/maps/$query_name/$mod/$map.gif",
			$this->getOGPPublicPath()."protocol/lgsl/maps/$query_name/$mod/$map.png",
			$this->getOGPPublicPath()."protocol/lgsl/maps/$query_name/$map.jpg",
			$this->getOGPPublicPath()."protocol/lgsl/maps/$query_name/$map.gif",
			$this->getOGPPublicPath()."protocol/lgsl/maps/$query_name/$map.png",
			"https://image.gametracker.com/images/maps/160x120/$mod_gt/$map.jpg",
			"https://image.gametracker.com/images/maps/160x120/$query_name/$map.jpg",
			$this->getOGPPublicPath()."images/online_big.png"
		);

		return get_first_existing_file($map_paths, 'https://gametracker.com', 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0');
	}
}
?>