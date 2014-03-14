function fetchFriends(session, _callback) {
	var callback = _callback || function (_) {};
	
	log.info('<Userfetch> �xȡ�����б��_ʼ');
	api.get_user_friends2(session.auth, function (ret, error) {
		session.fetchFriendLock = false;
		if (error)
			log.error('<Userfetch> �xȡ�����б�r��������: ' + error);
		if (ret)
			if (ret.retcode == 0) {
				session.friends = ret.result;
				log.info('<Userfetch> �xȡ�����б�ɹ�');
			} else
				log.error('<Userfetch> �xȡ�����б�r��������: ' + (error || 'retcode != 0 (' + ret.retcode + ')'));
		else
			log.error('<Userfetch> �x������б�r��������: ' + (error || 'null return!'));
		callback(false);
	});
}
module.exports.fetchFriends = fetchFriends;


function fetchGroups(session, callback) {
	if (session.fetchGroupLock)
		return;
	session.fetchGroupLock = true;
	
	log.info('<Userfetch> �x��Ⱥ�M�б��_ʼ');
	api.get_group_name_list_mask2(session.auth, function (ret, error) {
		session.fetchGroupLock = false;
		var cbret = false;
		
		if (error)
			log.error('<Userfetch> �xȡȺ�M�б�r��������: ' + error); // TODO
		if (ret)
			if (ret.retcode === 0) {
				session.groups = ret.result;
				log.info('<Userfetch> �xȡȺ�M�б�ɹ�');
				cbret = true;
			} else
				log.error('<Userfetch> �xȡȺ�M�б�r��������: ' + (error || 'retcode != 0 (' + ret.retcode + ')'));
		else
			log.error('<Userfetch> �xȡȺ�M�б�r��������: ' + (error || 'null return!'));
		
		callback(cbret);
	});
}
module.exports.fetchGroups = fetchGroups;


function fetchGroupInfo2(session, group, callback) {
	session.fetchGroupInfoLock = true;
	
	api.get_group_info_ext2(session.auth, group.code, function (ret, error) {
		session.fetchGroupInfoLock = false;
		var cbret = false;
		
		if (ret)
			if (ret.retcode === 0) {
				session.groups = ret.result;
				log.info('<Userfetch> �xȡȺ�M�Y�ϳɹ�');
				cbret = true;
			} else
				log.error('<Userfetch> �xȡȺ�M�Y�ϕr��������: ' + (error || 'retcode != 0 (' + ret.retcode + ')'));
		else
			log.error('<Userfetch> �xȡȺ�M�Y�ϕr��������: ' + (error || 'null return!'));
		
		callback(cbret);
	});
}

function fetchGroupInfo(session, gcode, callback) {
	var group = getGroup({ code: gcode });
	if (group)
		fetchGroupInfo2(session, group, callback);
	else
		fetchGroups(session, null);
}
module.exports.fetchGroupInfo = fetchGroupInfo;
